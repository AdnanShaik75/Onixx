import { NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireCsrf, deleteCsrfCookie } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const csrf = await requireCsrf(request);
    if (!csrf.valid) {
      return jsonResponse({ error: csrf.error }, 403);
    }

    await clearSessionCookie();

    logger.info("User session cleared");

    const response = jsonResponse({ success: true });
    response.headers.append("Set-Cookie", deleteCsrfCookie());

    return response;
  } catch (error) {
    logger.error("Logout failed", error);
    return handleApiError(error);
  }
}
