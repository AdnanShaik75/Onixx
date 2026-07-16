import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityEntry {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: "product" | "order" | "stock" | "system";
}

const INITIAL_ACTIVITY: ActivityEntry[] = [
  { id: "a1", action: "Order Shipped", detail: "ORD-002 shipped to Priya Sharma", timestamp: "2026-07-16T09:30:00", type: "order" },
  { id: "a2", action: "Stock Alert", detail: "Nocturne Skeleton dropped to 1 unit", timestamp: "2026-07-16T08:15:00", type: "stock" },
  { id: "a3", action: "Product Updated", detail: "Royal Chronograph price refreshed", timestamp: "2026-07-15T16:42:00", type: "product" },
  { id: "a4", action: "Order Delivered", detail: "ORD-004 delivered to Neha Kapoor", timestamp: "2026-07-15T14:20:00", type: "order" },
  { id: "a5", action: "System Backup", detail: "Daily catalogue backup completed", timestamp: "2026-07-15T00:00:00", type: "system" },
  { id: "a6", action: "New Order", detail: "ORD-008 placed by Meera Joshi", timestamp: "2026-07-14T11:05:00", type: "order" },
  { id: "a7", action: "Stock Alert", detail: "Emperor Grand out of stock", timestamp: "2026-07-14T09:00:00", type: "stock" },
];

interface ActivityState {
  entries: ActivityEntry[];
  addEntry: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      entries: [...INITIAL_ACTIVITY],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: `a${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
            ...state.entries,
          ].slice(0, 50),
        })),
    }),
    {
      name: "onixx-activity",
    }
  )
);
