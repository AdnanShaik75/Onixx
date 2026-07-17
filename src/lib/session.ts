import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE_NAME = "__session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export async function setSessionCookie(idToken: string): Promise<void> {
  const adminAuth = getAdminAuth();
  await adminAuth.verifyIdToken(idToken);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) return null;

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(sessionCookie.value);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email ?? null,
      isAdmin: decodedToken.admin === true,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
