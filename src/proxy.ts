import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, importX509, type JWTPayload } from "jose";

export const config = {
  matcher: ["/admin/:path*"],
};

const SESSION_COOKIE_NAME = "__session";
const GOOGLE_KEYS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

interface SessionPayload extends JWTPayload {
  uid: string;
  email?: string;
  admin?: boolean;
}

let cachedKeys: { pem: string; kid: string; expiresAt: number }[] = [];
let keysFetchedAt = 0;

async function getSigningKeys(): Promise<Map<string, CryptoKey>> {
  const now = Date.now();
  if (cachedKeys.length > 0 && now < keysFetchedAt + 3600_000) {
    const map = new Map<string, CryptoKey>();
    for (const k of cachedKeys) {
      map.set(k.kid, await importX509(k.pem, "RS256"));
    }
    return map;
  }

  const res = await fetch(GOOGLE_KEYS_URL);
  if (!res.ok) throw new Error("Failed to fetch Google signing keys");

  const data: Record<string, string> = await res.json();
  const maxAgeHeader = res.headers.get("cache-control");
  const maxAge = maxAgeHeader
    ? parseInt(maxAgeHeader.match(/max-age=(\d+)/)?.[1] ?? "3600")
    : 3600;

  cachedKeys = Object.entries(data).map(([kid, pem]) => ({ pem, kid, expiresAt: now + maxAge * 1000 }));
  keysFetchedAt = now;

  const map = new Map<string, CryptoKey>();
  for (const k of cachedKeys) {
    map.set(k.kid, await importX509(k.pem, "RS256"));
  }
  return map;
}

async function verifyFirebaseToken(token: string): Promise<SessionPayload | null> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const keys = await getSigningKeys();

    const header = JSON.parse(atob(token.split(".")[0]));
    const key = keys.get(header.kid);
    if (!key) return null;

    const { payload } = await jwtVerify(token, key, {
      algorithms: ["RS256"],
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie) {
      const user = await verifyFirebaseToken(sessionCookie.value);
      if (user?.admin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const user = await verifyFirebaseToken(sessionCookie.value);

  if (!user) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  if (!user.admin) {
    return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
  }

  return NextResponse.next();
}
