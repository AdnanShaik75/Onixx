import { getAdminAuth } from "@/lib/firebase-admin";
import type { SessionUser } from "@/lib/session";

export async function requireAdmin(): Promise<SessionUser> {
  const { getSessionUser } = await import("@/lib/session");
  const user = await getSessionUser();

  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "Authentication required");
  }

  if (!user.isAdmin) {
    throw new AuthError("PERMISSION_DENIED", "Admin access required");
  }

  return user;
}

export async function requireAuth(): Promise<SessionUser> {
  const { getSessionUser } = await import("@/lib/session");
  const user = await getSessionUser();

  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "Authentication required");
  }

  return user;
}

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export async function setAdminClaim(uid: string, admin: boolean): Promise<void> {
  const adminAuth = getAdminAuth();
  await adminAuth.setCustomUserClaims(uid, { admin });
}

export async function getUserByUid(uid: string) {
  const adminAuth = getAdminAuth();
  return adminAuth.getUser(uid);
}

export async function getUserByEmail(email: string) {
  const adminAuth = getAdminAuth();
  return adminAuth.getUserByEmail(email);
}
