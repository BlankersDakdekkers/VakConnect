import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { leadRefundSchema } from "../lib/validation/commercial.ts";

const purchaseId = "11111111-1111-4111-8111-111111111111";
const source = readFileSync(new URL("../lib/commercial/actions.ts", import.meta.url), "utf8");

function loadAction(options: { denied?: boolean; status?: string; price?: number; rpcError?: string } = {}) {
  const calls: Array<{ name: string; args: unknown }> = [];
  const compiledModule = { exports: {} as { refundLeadPurchaseAction: (form: FormData) => Promise<void> } };
  const query = {
    select: () => query,
    eq: () => query,
    maybeSingle: async () => ({ data: { id: purchaseId, status: options.status ?? "purchased", price_credits: options.price ?? 18 }, error: null }),
  };
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    module: compiledModule, exports: compiledModule.exports, URLSearchParams,
    require: (name: string) => {
      if (name === "next/cache") return { revalidatePath: () => {} };
      if (name === "next/navigation") return { redirect: (path: string) => { throw new Error(path); } };
      if (name === "@/lib/auth/helpers") return { requireAdminUser: async () => { if (options.denied) throw new Error("DENIED"); } };
      if (name === "@/lib/validation") return { leadRefundSchema };
      if (name === "@/lib/supabase/server") return {
        createServerSupabaseClient: async () => ({
          from: () => query,
          rpc: async (name: string, args: unknown) => {
            calls.push({ name, args });
            return { error: options.rpcError ? { message: options.rpcError } : null };
          },
        }),
      };
      if (name === "@/lib/supabase/admin") return {};
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return { action: compiledModule.exports.refundLeadPurchaseAction, calls };
}

function form(confirmed = true, credits = "18") {
  const data = new FormData();
  data.set("purchase_id", purchaseId);
  data.set("reason", "Handmatig onderzocht");
  data.set("redirect_to", "/admin/leads/lead");
  data.set("expected_price_credits", credits);
  if (confirmed) data.set("confirm_purchase_id", purchaseId);
  return data;
}

test("refund requires admin authorization and explicit purchase confirmation", async () => {
  for (const denied of [true, false]) {
    const { action, calls } = loadAction({ denied });
    await assert.rejects(action(form(false)), denied ? /DENIED/ : /error=/);
    assert.equal(calls.length, 0);
  }
  const { action, calls } = loadAction();
  const forged = form();
  forged.set("confirm_purchase_id", "another-purchase");
  await assert.rejects(action(forged), /error=/);
  assert.equal(calls.length, 0);
});

test("refund blocks stale impact and already refunded purchases before RPC", async () => {
  for (const options of [{ status: "refunded" }, { price: 19 }]) {
    const { action, calls } = loadAction(options);
    await assert.rejects(action(form()), /error=/);
    assert.equal(calls.length, 0);
  }
  for (const credits of ["", "NaN", "0", "-1", "18.5"]) {
    const { action, calls } = loadAction();
    await assert.rejects(action(form(true, credits)), /error=/);
    assert.equal(calls.length, 0);
  }
});

test("confirmed refund uses only the existing atomic financial RPC", async () => {
  const { action, calls } = loadAction();
  await assert.rejects(action(form()), /success=/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, "refund_lead_purchase");
  assert.equal((calls[0].args as { target_purchase_id: string }).target_purchase_id, purchaseId);
  const duplicate = loadAction({ rpcError: "PURCHASE_ALREADY_REFUNDED" });
  await assert.rejects(duplicate.action(form()), /error=/);
  assert.equal(duplicate.calls.length, 1);
});

test("existing purchase view exposes a targeted refund link and labelled impact confirmation", () => {
  const page = readFileSync(new URL("../app/(admin)/admin/leads/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(page, /id=\{`purchase-\$\{purchase.id\}`\}/);
  assert.match(page, /name="confirm_purchase_id"/);
  assert.match(page, /name="expected_price_credits"/);
  assert.match(page, /Ik bevestig de volledige refund/);
  assert.match(page, /label="Refundreden"/);
});
