import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  productId: string;
  amount: number;
  status: OrderStatus;
  date: string;
  address: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Arjun Mehta", email: "arjun.mehta@email.com", product: "Royal Chronograph", productId: "royal-chronograph", amount: 1074850, status: "Delivered", date: "2026-07-10", address: "42 Marine Drive, Mumbai" },
  { id: "ORD-002", customer: "Priya Sharma", email: "priya.sharma@email.com", product: "Midnight Automatic", productId: "midnight-automatic", amount: 726250, status: "Shipped", date: "2026-07-12", address: "15 MG Road, Bangalore" },
  { id: "ORD-003", customer: "Vikram Singh", email: "vikram.singh@email.com", product: "Sovereign Tourbillon", productId: "sovereign-tourbillon", amount: 2033500, status: "Processing", date: "2026-07-14", address: "8 Civil Lines, Jaipur" },
  { id: "ORD-004", customer: "Neha Kapoor", email: "neha.kapoor@email.com", product: "Heritage Classic", productId: "heritage-classic", amount: 410850, status: "Delivered", date: "2026-07-08", address: "22 Connaught Place, Delhi" },
  { id: "ORD-005", customer: "Rahul Verma", email: "rahul.verma@email.com", product: "Apex Diver Pro", productId: "apex-diver", amount: 576850, status: "Shipped", date: "2026-07-13", address: "7 Jubilee Hills, Hyderabad" },
  { id: "ORD-006", customer: "Ananya Reddy", email: "ananya.reddy@email.com", product: "Titan Sport", productId: "titan-sport", amount: 597600, status: "Processing", date: "2026-07-15", address: "31 Koramangala, Bangalore" },
  { id: "ORD-007", customer: "Dev Malhotra", email: "dev.malhotra@email.com", product: "Chronos Aviator", productId: "chronos-aviator", amount: 817550, status: "Delivered", date: "2026-07-06", address: "56 Park Street, Kolkata" },
  { id: "ORD-008", customer: "Meera Joshi", email: "meera.joshi@email.com", product: "Meridian World Timer", productId: "meridian-world", amount: 954500, status: "Shipped", date: "2026-07-11", address: "12 FC Road, Pune" },
];

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  _syncFromFirebase: (orders: Order[] | null) => void;
}

let firebaseUnsubscribed = false;

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [...INITIAL_ORDERS],

      addOrder: (order) => {
        const updated = [...get().orders, order];
        set({ orders: updated });
        saveToPath("orders", updated);
      },

      updateStatus: (id, status) => {
        const updated = get().orders.map((o) =>
          o.id === id ? { ...o, status } : o
        );
        set({ orders: updated });
        saveToPath("orders", updated);
      },

      _syncFromFirebase: (orders) => {
        if (Array.isArray(orders) && orders.every((o) => o && o.id && o.customer)) {
          set({ orders });
        }
      },
    }),
    {
      name: "onixx-orders",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<Order[]>("orders", (data) => {
            if (data) {
              useOrderStore.getState()._syncFromFirebase(data);
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
