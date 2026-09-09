import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { genericLeadSubmissionErrorMessage, resolveLeadSubmissionError } from "@/lib/leads/errors";
import { createLeadSubmission } from "@/lib/leads/submission";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: genericLeadSubmissionErrorMessage }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const result = await createLeadSubmission(formData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const resolvedError = resolveLeadSubmissionError(error);
    if (resolvedError.statusCode >= 500) {
      console.error("Unhandled /api/leads error", error);
    }
    return NextResponse.json(
      {
        error: resolvedError.message,
      },
      { status: resolvedError.statusCode },
    );
  }
}
