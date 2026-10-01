import { executeWorkerRequest } from "@/lib/internal/worker-auth";
import { processOperationsHealthCheck } from "@/lib/operations/workers";

export async function POST(request: Request) {
  return executeWorkerRequest(request, () => processOperationsHealthCheck());
}
