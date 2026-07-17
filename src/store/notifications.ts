import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import type { Notification } from "@/lib/types";

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "user-001",
    type: "order_update",
    title: "Order Delivered",
    message: "Order ONX-20260710-000001 has been delivered",
    priority: "high",
    read: false,
    actionUrl: "/orders/ORD-001",
    createdAt: "2026-07-12T14:00:00Z",
  },
  {
    id: "n2",
    userId: "user-002",
    type: "order_update",
    title: "Order Shipped",
    message: "Order ONX-20260712-000001 has been shipped",
    priority: "medium",
    read: false,
    actionUrl: "/orders/ORD-002",
    createdAt: "2026-07-14T10:00:00Z",
  },
  {
    id: "n3",
    userId: "user-003",
    type: "account",
    title: "Welcome to ONIXX!",
    message: "Complete your profile",
    priority: "low",
    read: false,
    actionUrl: "/account/profile",
    createdAt: "2026-07-14T10:00:00Z",
  },
  {
    id: "n4",
    userId: "user-001",
    type: "wishlist",
    title: "Back in Stock",
    message: "Royal Chronograph is back in stock",
    priority: "low",
    read: false,
    actionUrl: "/products/royal-chronograph",
    createdAt: "2026-07-15T09:00:00Z",
  },
  {
    id: "n5",
    userId: null,
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Nocturne Skeleton has only 1 unit left",
    priority: "high",
    read: false,
    actionUrl: "/admin/inventory",
    createdAt: "2026-07-16T08:15:00Z",
  },
  {
    id: "n6",
    userId: null,
    type: "new_order",
    title: "New Order",
    message: "New order ONX-20260715-000001 received",
    priority: "medium",
    read: false,
    actionUrl: "/admin/orders",
    createdAt: "2026-07-15T10:00:00Z",
  },
  {
    id: "n7",
    userId: null,
    type: "review",
    title: "New Review",
    message: "New review submitted for Heritage Classic",
    priority: "low",
    read: false,
    actionUrl: "/admin/reviews",
    createdAt: "2026-07-16T11:00:00Z",
  },
  {
    id: "n8",
    userId: null,
    type: "system",
    title: "System Maintenance",
    message: "System maintenance scheduled",
    priority: "low",
    read: false,
    createdAt: "2026-07-17T00:00:00Z",
  },
];

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId?: string) => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (userId?: string) => number;
  getForUser: (userId: string) => Notification[];
  _syncFromFirebase: (data: Notification[]) => void;
}

let firebaseUnsubscribed = false;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [...INITIAL_NOTIFICATIONS],

      addNotification: (notification) => {
        const updated = [
          {
            ...notification,
            id: `n${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...get().notifications,
        ];
        set({ notifications: updated });
        saveToPath("notifications", updated);
      },

      markAsRead: (id) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        set({ notifications: updated });
        saveToPath("notifications", updated);
      },

      markAllAsRead: (userId) => {
        const updated = get().notifications.map((n) => {
          if (userId !== undefined) {
            return n.userId === userId || n.userId === null
              ? { ...n, read: true }
              : n;
          }
          return { ...n, read: true };
        });
        set({ notifications: updated });
        saveToPath("notifications", updated);
      },

      deleteNotification: (id) => {
        const updated = get().notifications.filter((n) => n.id !== id);
        set({ notifications: updated });
        saveToPath("notifications", updated);
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter((n) => {
          if (userId !== undefined) {
            return !n.read && (n.userId === userId || n.userId === null);
          }
          return !n.read;
        }).length;
      },

      getForUser: (userId) => {
        return get().notifications.filter(
          (n) =>
            n.userId === userId ||
            n.userId === null ||
            n.type === "system"
        );
      },

      _syncFromFirebase: (data) => {
        if (Array.isArray(data) && data.every((n) => n && n.id)) {
          set({ notifications: data });
        }
      },
    }),
    {
      name: "onixx-notifications",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<Notification[]>("notifications", (data) => {
            if (data) {
              useNotificationStore.getState()._syncFromFirebase(data);
            }
          });
          if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", unsub);
          }
        }
      },
    }
  )
);
