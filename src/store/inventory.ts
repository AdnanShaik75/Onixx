import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeToPath, saveToPath, isConfigured } from "@/lib/firebase";
import {
  buildInventoryItem,
  createReservation,
  createTransaction,
  getAvailableStock,
  isReservationExpired,
} from "@/lib/inventory";
import type {
  InventoryItem,
  InventoryTransaction,
  StockReservation,
} from "@/lib/types";

interface InventoryState {
  items: Record<string, InventoryItem>;
  reservations: StockReservation[];
  transactions: InventoryTransaction[];
  setStock: (productId: string, totalStock: number, note?: string) => void;
  reserveStock: (productId: string, quantity: number, orderId: string) => StockReservation | null;
  confirmReservation: (reservationId: string) => void;
  releaseReservation: (reservationId: string) => void;
  releaseExpiredReservations: () => void;
  deductStock: (productId: string, quantity: number, referenceId: string, note?: string) => void;
  restoreStock: (productId: string, quantity: number, referenceId: string, note?: string) => void;
  adjustStock: (productId: string, newTotal: number, referenceId: string, note?: string) => void;
  getItem: (productId: string) => InventoryItem;
  getAvailable: (productId: string) => number;
  _syncFromFirebase: (data: { items?: Record<string, InventoryItem>; reservations?: StockReservation[] } | null) => void;
}

let firebaseUnsubscribed = false;

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: {},
      reservations: [],
      transactions: [],

      setStock: (productId, totalStock, note = "Stock set") => {
        const prev = get().getItem(productId);
        const newReserved = Math.min(prev.reservedStock, totalStock);
        const updated = buildInventoryItem(productId, totalStock, newReserved, prev.lowStockThreshold);

        const txn = createTransaction(
          productId, "adjustment", totalStock - prev.totalStock,
          prev.totalStock, updated.totalStock,
          prev.reservedStock, updated.reservedStock,
          productId, note,
        );

        set((s) => ({
          items: { ...s.items, [productId]: updated },
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/transactions", get().transactions);
      },

      reserveStock: (productId, quantity, orderId) => {
        const item = get().getItem(productId);
        const available = getAvailableStock(item);
        if (available < quantity) return null;

        const reservation = createReservation(productId, quantity, orderId);
        const newReserved = item.reservedStock + quantity;
        const updated = buildInventoryItem(productId, item.totalStock, newReserved, item.lowStockThreshold);

        const txn = createTransaction(
          productId, "reservation", quantity,
          item.totalStock, updated.totalStock,
          item.reservedStock, newReserved,
          orderId, `Reserved ${quantity} for ${orderId}`,
        );

        set((s) => ({
          items: { ...s.items, [productId]: updated },
          reservations: [...s.reservations, reservation],
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/reservations", get().reservations);
        saveToPath("inventory/transactions", get().transactions);
        return reservation;
      },

      confirmReservation: (reservationId) => {
        const reservation = get().reservations.find((r) => r.id === reservationId);
        if (!reservation) return;

        const item = get().getItem(reservation.productId);
        const newStock = item.totalStock - reservation.quantity;
        const newReserved = Math.max(0, item.reservedStock - reservation.quantity);
        const updated = buildInventoryItem(reservation.productId, newStock, newReserved, item.lowStockThreshold);

        const txn = createTransaction(
          reservation.productId, "order_confirm", reservation.quantity,
          item.totalStock, newStock,
          item.reservedStock, newReserved,
          reservation.orderId, `Confirmed ${reservation.quantity} for ${reservation.orderId}`,
        );

        set((s) => ({
          items: { ...s.items, [reservation.productId]: updated },
          reservations: s.reservations.filter((r) => r.id !== reservationId),
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/reservations", get().reservations);
        saveToPath("inventory/transactions", get().transactions);
      },

      releaseReservation: (reservationId) => {
        const reservation = get().reservations.find((r) => r.id === reservationId);
        if (!reservation) return;

        const item = get().getItem(reservation.productId);
        const newReserved = Math.max(0, item.reservedStock - reservation.quantity);
        const updated = buildInventoryItem(reservation.productId, item.totalStock, newReserved, item.lowStockThreshold);

        const txn = createTransaction(
          reservation.productId, "release", reservation.quantity,
          item.totalStock, item.totalStock,
          item.reservedStock, newReserved,
          reservation.orderId, `Released ${reservation.quantity} from ${reservation.orderId}`,
        );

        set((s) => ({
          items: { ...s.items, [reservation.productId]: updated },
          reservations: s.reservations.filter((r) => r.id !== reservationId),
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/reservations", get().reservations);
        saveToPath("inventory/transactions", get().transactions);
      },

      releaseExpiredReservations: () => {
        const expired = get().reservations.filter(isReservationExpired);
        expired.forEach((r) => get().releaseReservation(r.id));
      },

      deductStock: (productId, quantity, referenceId, note = "Stock deducted") => {
        const item = get().getItem(productId);
        const newStock = Math.max(0, item.totalStock - quantity);
        const updated = buildInventoryItem(productId, newStock, item.reservedStock, item.lowStockThreshold);

        const txn = createTransaction(
          productId, "stock_deduction", quantity,
          item.totalStock, newStock,
          item.reservedStock, item.reservedStock,
          referenceId, note,
        );

        set((s) => ({
          items: { ...s.items, [productId]: updated },
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/transactions", get().transactions);
      },

      restoreStock: (productId, quantity, referenceId, note = "Stock restored") => {
        const item = get().getItem(productId);
        const newStock = item.totalStock + quantity;
        const updated = buildInventoryItem(productId, newStock, item.reservedStock, item.lowStockThreshold);

        const txn = createTransaction(
          productId, "return_restore", quantity,
          item.totalStock, newStock,
          item.reservedStock, item.reservedStock,
          referenceId, note,
        );

        set((s) => ({
          items: { ...s.items, [productId]: updated },
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/transactions", get().transactions);
      },

      adjustStock: (productId, newTotal, referenceId, note = "Manual adjustment") => {
        const item = get().getItem(productId);
        const diff = newTotal - item.totalStock;
        const updated = buildInventoryItem(productId, newTotal, item.reservedStock, item.lowStockThreshold);

        const txn = createTransaction(
          productId, "adjustment", diff,
          item.totalStock, newTotal,
          item.reservedStock, item.reservedStock,
          referenceId, note,
        );

        set((s) => ({
          items: { ...s.items, [productId]: updated },
          transactions: [...s.transactions, txn],
        }));

        saveToPath("inventory/items", get().items);
        saveToPath("inventory/transactions", get().transactions);
      },

      getItem: (productId) => {
        const existing = get().items[productId];
        if (existing) return existing;
        return buildInventoryItem(productId, 0, 0);
      },

      getAvailable: (productId) => {
        return getAvailableStock(get().getItem(productId));
      },

      _syncFromFirebase: (data) => {
        if (!data) return;
        set((s) => ({
          items: data.items ?? s.items,
          reservations: data.reservations ?? s.reservations,
        }));
      },
    }),
    {
      name: "onixx-inventory",
      onRehydrateStorage: () => {
        if (isConfigured && !firebaseUnsubscribed) {
          firebaseUnsubscribed = true;
          const unsub = subscribeToPath<{ items?: Record<string, InventoryItem>; reservations?: StockReservation[] }>(
            "inventory",
            (data) => {
              if (data) {
                useInventoryStore.getState()._syncFromFirebase(data);
              }
            },
          );
          if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", unsub);
          }
        }
      },
    }
  )
);
