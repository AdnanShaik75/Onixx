import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import type { Order, OrderStatus, OrderTimelineEvent } from "@/lib/types";

function buildTimeline(event: string, actor: string, note?: string): OrderTimelineEvent {
  return {
    timestamp: new Date().toISOString(),
    actor,
    action: event,
    note,
  };
}

function seedOrder(
  id: string, orderNumber: string, items: Order["items"],
  shipping: Order["shippingAddress"], status: OrderStatus,
  total: number, createdAt: string, events: OrderTimelineEvent[],
): Order {
  return {
    id, orderNumber, userId: null, items,
    shippingAddress: shipping, billingAddress: shipping,
    subtotal: total, shipping: 0, tax: 0, discount: 0, total,
    shippingProvider: "flat_rate", status,
    paymentId: `pay_old_${id}`, paymentMethod: "dummy",
    timeline: events,
    createdAt, updatedAt: events[events.length - 1]?.timestamp ?? createdAt,
  };
}

const addr = (first: string, last: string, email: string, phone: string, line1: string, city: string, state: string, zip: string): Order["shippingAddress"] =>
  ({ firstName: first, lastName: last, email, phone, line1, city, state, zip, country: "IN" });

const INITIAL_ORDERS: Order[] = [
  seedOrder("ORD-001", "ONX-20260710-000001",
    [{ productId: "royal-chronograph", productName: "Royal Chronograph", sku: "ONX-RC-001", variant: "Default", image: "/images/watches/royal-chronograph.jpg", unitPrice: 1074850, quantity: 1, lineTotal: 1074850 }],
    addr("Arjun", "Mehta", "arjun.mehta@email.com", "+91 9876543210", "42 Marine Drive", "Mumbai", "Maharashtra", "400001"),
    "Delivered", 1074850, "2026-07-10T10:00:00Z", [
      { timestamp: "2026-07-10T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-11T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-11T15:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK001" },
      { timestamp: "2026-07-12T14:00:00Z", actor: "system", action: "Delivered" },
    ]),
  seedOrder("ORD-002", "ONX-20260712-000001",
    [{ productId: "midnight-automatic", productName: "Midnight Automatic", sku: "ONX-MA-001", variant: "Default", image: "/images/watches/midnight-automatic.jpg", unitPrice: 726250, quantity: 1, lineTotal: 726250 }],
    addr("Priya", "Sharma", "priya.sharma@email.com", "+91 9876543211", "15 MG Road", "Bangalore", "Karnataka", "560001"),
    "Shipped", 726250, "2026-07-12T10:00:00Z", [
      { timestamp: "2026-07-12T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-13T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-14T10:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK002" },
    ]),
  seedOrder("ORD-003", "ONX-20260714-000001",
    [{ productId: "sovereign-tourbillon", productName: "Sovereign Tourbillon", sku: "ONX-ST-001", variant: "Default", image: "/images/watches/sovereign-tourbillon.jpg", unitPrice: 2033500, quantity: 1, lineTotal: 2033500 }],
    addr("Vikram", "Singh", "vikram.singh@email.com", "+91 9876543212", "8 Civil Lines", "Jaipur", "Rajasthan", "302001"),
    "Confirmed", 2033500, "2026-07-14T10:00:00Z", [
      { timestamp: "2026-07-14T10:00:00Z", actor: "system", action: "Order placed" },
    ]),
  seedOrder("ORD-004", "ONX-20260708-000001",
    [{ productId: "heritage-classic", productName: "Heritage Classic", sku: "ONX-HC-001", variant: "Default", image: "/images/watches/heritage-classic.jpg", unitPrice: 410850, quantity: 1, lineTotal: 410850 }],
    addr("Neha", "Kapoor", "neha.kapoor@email.com", "+91 9876543213", "22 Connaught Place", "Delhi", "Delhi", "110001"),
    "Delivered", 410850, "2026-07-08T10:00:00Z", [
      { timestamp: "2026-07-08T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-09T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-09T15:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK004" },
      { timestamp: "2026-07-10T14:00:00Z", actor: "system", action: "Delivered" },
    ]),
  seedOrder("ORD-005", "ONX-20260713-000001",
    [{ productId: "apex-diver", productName: "Apex Diver Pro", sku: "ONX-AD-001", variant: "Default", image: "/images/watches/apex-diver.jpg", unitPrice: 576850, quantity: 1, lineTotal: 576850 }],
    addr("Rahul", "Verma", "rahul.verma@email.com", "+91 9876543214", "7 Jubilee Hills", "Hyderabad", "Telangana", "500033"),
    "Shipped", 576850, "2026-07-13T10:00:00Z", [
      { timestamp: "2026-07-13T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-14T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-15T10:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK005" },
    ]),
  seedOrder("ORD-006", "ONX-20260715-000001",
    [{ productId: "titan-sport", productName: "Titan Sport", sku: "ONX-TS-001", variant: "Default", image: "/images/watches/titan-sport.jpg", unitPrice: 597600, quantity: 1, lineTotal: 597600 }],
    addr("Ananya", "Reddy", "ananya.reddy@email.com", "+91 9876543215", "31 Koramangala", "Bangalore", "Karnataka", "560034"),
    "Confirmed", 597600, "2026-07-15T10:00:00Z", [
      { timestamp: "2026-07-15T10:00:00Z", actor: "system", action: "Order placed" },
    ]),
  seedOrder("ORD-007", "ONX-20260706-000001",
    [{ productId: "chronos-aviator", productName: "Chronos Aviator", sku: "ONX-CA-001", variant: "Default", image: "/images/watches/chronos-aviator.jpg", unitPrice: 817550, quantity: 1, lineTotal: 817550 }],
    addr("Dev", "Malhotra", "dev.malhotra@email.com", "+91 9876543216", "56 Park Street", "Kolkata", "West Bengal", "700016"),
    "Delivered", 817550, "2026-07-06T10:00:00Z", [
      { timestamp: "2026-07-06T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-07T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-07T15:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK007" },
      { timestamp: "2026-07-08T14:00:00Z", actor: "system", action: "Delivered" },
    ]),
  seedOrder("ORD-008", "ONX-20260711-000001",
    [{ productId: "meridian-world", productName: "Meridian World Timer", sku: "ONX-MW-001", variant: "Default", image: "/images/watches/meridian-world.jpg", unitPrice: 954500, quantity: 1, lineTotal: 954500 }],
    addr("Meera", "Joshi", "meera.joshi@email.com", "+91 9876543217", "12 FC Road", "Pune", "Maharashtra", "411004"),
    "Shipped", 954500, "2026-07-11T10:00:00Z", [
      { timestamp: "2026-07-11T10:00:00Z", actor: "system", action: "Order placed" },
      { timestamp: "2026-07-12T09:00:00Z", actor: "admin", action: "Packed" },
      { timestamp: "2026-07-13T10:00:00Z", actor: "admin", action: "Shipped", note: "Tracking: TRK008" },
    ]),
];

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus, actor?: string, note?: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
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

      updateStatus: (id, status, actor = "admin", note) => {
        const event = buildTimeline(status, actor, note);
        const updated = get().orders.map((o) => {
          if (o.id !== id) return o;
          return {
            ...o,
            status,
            updatedAt: event.timestamp,
            timeline: [...o.timeline, event],
          };
        });
        set({ orders: updated });
        saveToPath("orders", updated);
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),

      getOrdersByUser: (userId) => get().orders.filter((o) => o.userId === userId),

      _syncFromFirebase: (orders) => {
        if (Array.isArray(orders) && orders.every((o) => o && o.id)) {
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

export type { Order, OrderStatus };
export { buildTimeline };
