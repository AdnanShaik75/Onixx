jest.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: jest.fn(),
  getAdminDb: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
  createLogger: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() })),
}));

import { getPermissions, hasPermission, hasAnyPermission } from "@/lib/permissions";
import type { SessionUser } from "@/lib/session";

function createAdminUser(): SessionUser {
  return { uid: "admin-uid", email: "admin@onixx.com", isAdmin: true };
}

function createRegularUser(): SessionUser {
  return { uid: "user-uid", email: "user@example.com", isAdmin: false };
}

describe("Permissions", () => {
  describe("getPermissions", () => {
    it("returns all permissions for admin users", () => {
      const perms = getPermissions(createAdminUser());
      expect(perms).toContain("admin:access");
      expect(perms).toContain("products:read");
      expect(perms).toContain("products:write");
      expect(perms).toContain("orders:read");
      expect(perms).toContain("orders:write");
      expect(perms).toContain("settings:read");
      expect(perms).toContain("settings:write");
    });

    it("returns empty permissions for regular users", () => {
      const perms = getPermissions(createRegularUser());
      expect(perms).toHaveLength(0);
    });

    it("returns empty permissions for null user", () => {
      const perms = getPermissions(null);
      expect(perms).toHaveLength(0);
    });
  });

  describe("hasPermission", () => {
    it("returns true for admin with admin:access", () => {
      expect(hasPermission(createAdminUser(), "admin:access")).toBe(true);
    });

    it("returns false for regular user with admin:access", () => {
      expect(hasPermission(createRegularUser(), "admin:access")).toBe(false);
    });

    it("returns false for null user", () => {
      expect(hasPermission(null, "admin:access")).toBe(false);
    });
  });

  describe("hasAnyPermission", () => {
    it("returns true if admin has any of the required permissions", () => {
      expect(hasAnyPermission(createAdminUser(), ["products:write", "orders:write"])).toBe(true);
    });

    it("returns false if regular user has none of the required permissions", () => {
      expect(hasAnyPermission(createRegularUser(), ["products:write", "orders:write"])).toBe(false);
    });
  });
});

describe("AuthError", () => {
  it("has correct code and message", async () => {
    const { AuthError } = await import("@/lib/auth");
    const error = new AuthError("UNAUTHENTICATED", "Authentication required");
    expect(error.code).toBe("UNAUTHENTICATED");
    expect(error.message).toBe("Authentication required");
    expect(error.name).toBe("AuthError");
  });

  it("is instanceof Error", async () => {
    const { AuthError } = await import("@/lib/auth");
    const error = new AuthError("PERMISSION_DENIED", "Admin access required");
    expect(error).toBeInstanceOf(Error);
  });
});

describe("Session constants", () => {
  it("exports SESSION_COOKIE_NAME", async () => {
    const { SESSION_COOKIE_NAME } = await import("@/lib/session");
    expect(SESSION_COOKIE_NAME).toBe("__session");
  });
});

describe("Logger", () => {
  it("exports logger with info, warn, error, debug methods", async () => {
    const { logger } = await import("@/lib/logger");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("exports createLogger factory", async () => {
    const { createLogger } = await import("@/lib/logger");
    const customLogger = createLogger("test-context");
    expect(typeof customLogger.info).toBe("function");
    expect(typeof customLogger.error).toBe("function");
  });
});
