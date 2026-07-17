import { NextRequest } from "next/server";
import { setSessionCookie } from "@/lib/session";
import { jsonResponse, handleApiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { checkRateLimit, recordFailure, resetRateLimit } from "@/lib/rate-limit";

const LOGIN_IP_CONFIG = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 20,
  lockoutMs: 30 * 60 * 1000,
};

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return jsonResponse({ error: "ID token is required" }, 400);
    }

    const ip = getClientIp(request);
    const ipCheck = checkRateLimit("login:ip", ip, LOGIN_IP_CONFIG);

    if (!ipCheck.allowed) {
      logger.warn("Rate limit exceeded (IP)", { ip, retryAfterMs: ipCheck.retryAfterMs });
      return jsonResponse(
        { error: "Too many attempts. Please try again later." },
        429,
      );
    }

    try {
      await setSessionCookie(idToken);
    } catch (sessionError) {
      recordFailure("login:ip", ip, LOGIN_IP_CONFIG);
      throw sessionError;
    }

    resetRateLimit("login:ip", ip);

    logger.info("User session created");

    const { generateCsrfToken, setCsrfCookie } = await import("@/lib/csrf");
    const { getSessionUser } = await import("@/lib/session");
    const user = await getSessionUser();

    const csrfToken = user ? generateCsrfToken(user.uid) : "";
    const csrfCookie = setCsrfCookie(csrfToken);

    const response = jsonResponse({ success: true });
    response.headers.append("Set-Cookie", csrfCookie);

    return response;
  } catch (error) {
    logger.error("Login failed", error);
    return handleApiError(error);
  }
}
