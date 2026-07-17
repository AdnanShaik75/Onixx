import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { createHmac, timingSafeEqual } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const CSRF_COOKIE = "__csrf";
const CSRF_HEADER = "x-csrf-token";
const CSRF_MAX_AGE = 60 * 60; // 1 hour

export function generateCsrfToken(sessionId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${sessionId}:${timestamp}`;
  const signature = createHmac("sha256", CSRF_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function validateCsrfToken(token: string, sessionId: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;

    const [tokenSessionId, timestamp, signature] = parts;

    if (tokenSessionId !== sessionId) return false;

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CSRF_MAX_AGE || age < 0) return false;

    const expectedPayload = `${tokenSessionId}:${timestamp}`;
    const expectedSignature = createHmac("sha256", CSRF_SECRET).update(expectedPayload).digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length) return false;

    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function setCsrfCookie(token: string): string {
  return `${CSRF_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${CSRF_MAX_AGE}`;
}

export function deleteCsrfCookie(): string {
  return `${CSRF_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export async function requireCsrf(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { valid: false, error: "Authentication required" };
  }

  const csrfToken = request.headers.get(CSRF_HEADER);
  if (!csrfToken) {
    return { valid: false, error: "CSRF token missing" };
  }

  if (!validateCsrfToken(csrfToken, sessionUser.uid)) {
    return { valid: false, error: "Invalid CSRF token" };
  }

  return { valid: true };
}
