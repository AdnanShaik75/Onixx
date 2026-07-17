import type { SessionUser } from "@/lib/session";

export type Permission =
  | "products:read"
  | "products:write"
  | "orders:read"
  | "orders:write"
  | "customers:read"
  | "activity:read"
  | "settings:read"
  | "settings:write"
  | "admin:access";

const ADMIN_PERMISSIONS: Permission[] = [
  "products:read",
  "products:write",
  "orders:read",
  "orders:write",
  "customers:read",
  "activity:read",
  "settings:read",
  "settings:write",
  "admin:access",
];

const USER_PERMISSIONS: Permission[] = [];

export function getPermissions(user: SessionUser | null): Permission[] {
  if (!user) return [];
  if (user.isAdmin) return ADMIN_PERMISSIONS;
  return USER_PERMISSIONS;
}

export function hasPermission(user: SessionUser | null, permission: Permission): boolean {
  return getPermissions(user).includes(permission);
}

export function hasAnyPermission(user: SessionUser | null, permissions: Permission[]): boolean {
  const userPerms = getPermissions(user);
  return permissions.some((p) => userPerms.includes(p));
}
