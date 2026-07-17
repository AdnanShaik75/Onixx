import { clearSessionCookie } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    await clearSessionCookie();

    logger.info("User session cleared");

    return jsonResponse({ success: true });
  } catch (error) {
    logger.error("Logout failed", error);
    return handleApiError(error);
  }
}
