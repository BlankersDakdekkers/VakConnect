import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createLeadSubmission } from "@/lib/leads/submission";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is nog niet geconfigureerd." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const result = await createLeadSubmission(formData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "De aanvraag kon niet worden verwerkt.",
      },
      { status: 400 },
    );
  }
}
