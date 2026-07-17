import { NextRequest } from "next/server";
import { setSessionCookie } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return jsonResponse({ error: "ID token is required" }, 400);
    }

    await setSessionCookie(idToken);

    logger.info("User session created");

    return jsonResponse({ success: true });
  } catch (error) {
    logger.error("Login failed", error);
    return handleApiError(error);
  }
}
