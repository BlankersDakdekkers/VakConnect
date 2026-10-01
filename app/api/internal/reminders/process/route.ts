import { executeWorkerRequest } from "@/lib/internal/worker-auth";
import { processReminderChecks } from "@/lib/operations/workers";

export async function POST(request: Request) {
  return executeWorkerRequest(request, () => processReminderChecks());
}
