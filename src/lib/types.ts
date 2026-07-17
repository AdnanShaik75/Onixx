// ─── Order Lifecycle ──────────────────────────────────────

export type OrderStatus =
  | "Draft"
  | "Pending Payment"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned"
  | "Refunded";

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  "Draft": ["Pending Payment", "Cancelled"],
  "Pending Payment": ["Confirmed", "Cancelled"],
  "Confirmed": ["Packed", "Cancelled"],
  "Packed": ["Shipped", "Cancelled"],
  "Shipped": ["Delivered", "Returned"],
  "Delivered": ["Returned"],
  "Cancelled": [],
  "Returned": ["Refunded"],
  "Refunded": [],
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  "Draft": "bg-gray-500/10 text-gray-400",
  "Pending Payment": "bg-yellow-500/10 text-yellow-500",
  "Confirmed": "bg-blue-500/10 text-blue-500",
  "Packed": "bg-indigo-500/10 text-indigo-400",
  "Shipped": "bg-cyan-500/10 text-cyan-400",
  "Delivered": "bg-green-500/10 text-green-500",
  "Cancelled": "bg-red-500/10 text-red-500",
  "Returned": "bg-orange-500/10 text-orange-400",
  "Refunded": "bg-purple-500/10 text-purple-400",
};

// ─── Order Item (Product Snapshot) ───────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variant: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

// ─── Order Timeline ──────────────────────────────────────

export interface OrderTimelineEvent {
  timestamp: string;
  actor: string;
  action: string;
  note?: string;
}

// ─── Order Address ───────────────────────────────────────

export interface OrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// ─── Order ───────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingProvider: string;
  status: OrderStatus;
  paymentId: string | null;
  paymentMethod: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

// ─── Customer ─────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  status: "captured" | "pending" | "failed";
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  paymentId: string;
  amount: number;
  status: "refunded" | "pending" | "failed";
  error?: string;
}

export interface PaymentProvider {
  name: string;
  createOrder(order: PaymentOrder): Promise<PaymentResult>;
  verifyPayment(paymentId: string): Promise<PaymentResult>;
  refund(paymentId: string, amount: number): Promise<RefundResult>;
}

// ─── Shipping ────────────────────────────────────────────

export interface ShippingCalculation {
  provider: string;
  method: string;
  cost: number;
  estimatedDays: { min: number; max: number };
}

export interface ShippingProvider {
  name: string;
  calculate(subtotal: number): ShippingCalculation;
}

// ─── Email ────────────────────────────────────────────────

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  name: string;
  send(message: EmailMessage): Promise<{ success: boolean; error?: string }>;
}

// ─── Pricing ─────────────────────────────────────────────

export interface PricingInput {
  items: { unitPrice: number; quantity: number }[];
  shippingCost: number;
  taxRate?: number;
  discountAmount?: number;
}

export interface PricingResult {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

// ─── Inventory ────────────────────────────────────────────

export type InventoryTransactionType =
  | "stock_addition"
  | "stock_deduction"
  | "reservation"
  | "release"
  | "adjustment"
  | "order_confirm"
  | "order_cancel_release"
  | "return_restore";

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: InventoryTransactionType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reservedBefore: number;
  reservedAfter: number;
  referenceId: string;
  note: string;
  timestamp: string;
}

export interface InventoryItem {
  productId: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  isOutOfStock: boolean;
}

export interface StockReservation {
  id: string;
  productId: string;
  quantity: number;
  orderId: string;
  expiresAt: string;
}
