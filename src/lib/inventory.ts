import type {
  InventoryItem,
  InventoryTransaction,
  InventoryTransactionType,
  StockReservation,
} from "@/lib/types";

const RESERVATION_TTL_MS = 15 * 60 * 1000;

// ─── Stock Queries ───────────────────────────────────────

export function getAvailableStock(item: InventoryItem): number {
  return Math.max(0, item.totalStock - item.reservedStock);
}

export function isAvailable(item: InventoryItem, qty: number): boolean {
  return getAvailableStock(item) >= qty;
}

export function buildInventoryItem(
  productId: string,
  totalStock: number,
  reservedStock = 0,
  lowStockThreshold = 5,
): InventoryItem {
  const available = Math.max(0, totalStock - reservedStock);
  return {
    productId,
    totalStock,
    reservedStock,
    availableStock: available,
    lowStockThreshold,
    isOutOfStock: available === 0,
  };
}

// ─── Reservations ────────────────────────────────────────

export function createReservation(
  productId: string,
  quantity: number,
  orderId: string,
): StockReservation {
  return {
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    productId,
    quantity,
    orderId,
    expiresAt: new Date(Date.now() + RESERVATION_TTL_MS).toISOString(),
  };
}

export function isReservationExpired(reservation: StockReservation): boolean {
  return new Date(reservation.expiresAt) < new Date();
}

// ─── Transactions ────────────────────────────────────────

export function createTransaction(
  productId: string,
  type: InventoryTransactionType,
  quantity: number,
  stockBefore: number,
  stockAfter: number,
  reservedBefore: number,
  reservedAfter: number,
  referenceId: string,
  note: string,
): InventoryTransaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    productId,
    type,
    quantity,
    stockBefore,
    stockAfter,
    reservedBefore,
    reservedAfter,
    referenceId,
    note,
    timestamp: new Date().toISOString(),
  };
}
