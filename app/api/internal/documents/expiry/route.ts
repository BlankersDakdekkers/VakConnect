import { executeWorkerRequest } from "@/lib/internal/worker-auth";
import { processDocumentExpiry } from "@/lib/operations/workers";

export async function POST(request: Request) {
  return executeWorkerRequest(request, () => processDocumentExpiry());
}
