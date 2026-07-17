// ─── Order Lifecycle ──────────────────────────────────────

export type BadgeType = "BESTSELLER" | "SALE" | "NEW" | "LIMITED";

// ─── Product ─────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeType;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  strapMaterial?: string;
  caseMaterial?: string;
  movement?: string;
  waterResistance?: string;
  caseSize?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
  stock: number;
}

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

// ─── Reviews ─────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

export interface ReviewVote {
  userId: string;
  helpful: boolean;
  timestamp: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  votes: ReviewVote[];
  helpfulCount: number;
  unhelpfulCount: number;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
  verifiedCount: number;
}

// ─── Notifications ───────────────────────────────────────

export type NotificationType =
  | "order_update"
  | "account"
  | "wishlist"
  | "low_stock"
  | "new_order"
  | "review"
  | "system";

export type NotificationPriority = "low" | "medium" | "high";

export interface Notification {
  id: string;
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── Search & Filtering ──────────────────────────────────

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "rating"
  | "name_asc"
  | "name_desc";

export interface SearchFilters {
  query: string;
  categories: string[];
  collections: string[];
  priceRange: { min: number; max: number } | null;
  inStock: boolean | null;
  badge: BadgeType | null;
  sort: SortOption;
  page: number;
  perPage: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  suggestions: string[];
}

// ─── Settings ────────────────────────────────────────────

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  taxRate: number;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableNotifications: boolean;
  enableOrderConfirmationEmails: boolean;
  enableShippingUpdateEmails: boolean;
  heroBanners: HeroBanner[];
  featuredProductIds: string[];
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  order: number;
}

// ─── Media ───────────────────────────────────────────────

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: "image";
  size: number;
  width: number;
  height: number;
  alt: string;
  createdAt: string;
}

// ─── Analytics ───────────────────────────────────────────

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: { productId: string; name: string; revenue: number; units: number }[];
  lowStockProducts: { productId: string; name: string; stock: number }[];
  recentActivity: Notification[];
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: Record<string, number>;
}
