import { executeWorkerRequest } from "@/lib/internal/worker-auth";
import { processPendingNotifications } from "@/lib/notifications/worker";

export async function POST(request: Request) {
  return executeWorkerRequest(request, () => processPendingNotifications());
}
