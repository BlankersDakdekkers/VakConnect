import { NextResponse } from "next/server";
import { processDistributionExpirations } from "@/lib/distribution/engine";

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

  const processed = await processDistributionExpirations();
  return NextResponse.json({ processed });
}
