import { NextResponse } from "next/server";

export function isAuthorizedWorkerRequest(request: Request) {
  const secret = process.env.INTERNAL_WORKER_SECRET ?? process.env.DISTRIBUTION_CRON_SECRET;
  return Boolean(secret) && request.headers.get("x-worker-secret") === secret;
}

export async function executeWorkerRequest(
  request: Request,
  worker: () => Promise<{ processed: number; failed: number; status: string }>,
) {
  if (!isAuthorizedWorkerRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await worker();
    return NextResponse.json({
      processed: result.processed,
      failed: result.failed,
      status: result.status,
    });
  } catch {
    return NextResponse.json({ processed: 0, failed: 1, status: "failed" }, { status: 500 });
  }
}
