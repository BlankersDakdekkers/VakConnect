import { NextResponse } from "next/server";
import { processDistributionExpirations } from "@/lib/distribution/engine";
import { finishWorkerRun, startWorkerRun } from "@/lib/notifications/worker";

function isAuthorized(request: Request) {
  const secret = process.env.DISTRIBUTION_CRON_SECRET;
  if (!secret) {
    return false;
  }
  return request.headers.get("x-distribution-secret") === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let runId: string;
  try {
    runId = await startWorkerRun("distribution");
  } catch {
    return NextResponse.json({ processed: 0, failed: 1, status: "failed" }, { status: 500 });
  }
  try {
    const processed = await processDistributionExpirations();
    await finishWorkerRun({
      id: runId,
      status: "completed",
      claimedCount: processed,
      processedCount: processed,
      failedCount: 0,
    });
    return NextResponse.json({ processed, failed: 0, status: "completed" });
  } catch {
    await finishWorkerRun({
      id: runId,
      status: "failed",
      claimedCount: 0,
      processedCount: 0,
      failedCount: 1,
      errorSummary: "distribution_worker_failed",
    });
    return NextResponse.json({ processed: 0, failed: 1, status: "failed" }, { status: 500 });
  }
}
