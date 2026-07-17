# ONIXX Watch Store — Architecture Documentation

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| State | Zustand 5 (client), Firebase RTDB (server) |
| Auth | Firebase Authentication + Custom Claims |
| Database | Firebase Realtime Database |
| Hosting | Vercel |
| Testing | Jest (unit), Playwright (E2E) |

---

## Authentication Flow

```
Browser                    Vercel (Next.js)              Firebase
  │                              │                           │
  │── signInWithEmailAndPassword ──────────────────────────>│
  │<── idToken ─────────────────────────────────────────────│
  │                              │                           │
  │── POST /api/auth/login ────>│                           │
  │   (sends idToken)          │── verifyIdToken ──────────>│
  │<── Set-Cookie: __session ──│<── decoded token ─────────│
  │   (HTTP-only, secure)      │                           │
  │                              │                           │
  │── GET /admin/* ───────────>│                           │
  │                  proxy.ts reads __session cookie        │
  │                  Verifies JWT using Google public keys  │
  │                  Checks auth.admin custom claim         │
  │<── Allow / Redirect ───────│                           │
```

### Session Management

- **ID Token**: Firebase issues a short-lived JWT (1 hour)
- **Session Cookie**: Stored as HTTP-only, secure, SameSite=Lax cookie named `__session`
- **Cookie Lifetime**: 7 days
- **Verification**: Middleware (proxy.ts) verifies the JWT using Google's public signing keys directly (no server roundtrip to Firebase)
- **Custom Claims**: Admin users have `admin: true` set via Firebase Admin SDK

### Login/Logout

1. **Login**: User enters email/password on `/admin/login`
2. Client SDK authenticates with Firebase
3. On success, sends ID token to `/api/auth/login`
4. API route verifies token, sets HTTP-only session cookie
5. Proxy verifies admin claim, allows access

6. **Logout**: User clicks "Sign Out" in admin sidebar
7. Client SDK signs out from Firebase
8. Calls `/api/auth/logout` to clear session cookie
9. Redirects to `/admin/login`

---

## Authorization

### Custom Claims

Admin access is controlled via Firebase Custom Claims:

```typescript
// Set admin claim (server-side only, via Firebase Admin SDK)
await adminAuth.setCustomUserClaims(uid, { admin: true });
```

### Permission System

`lib/permissions.ts` defines role-based permissions:

| Permission | Admin |
|-----------|-------|
| `admin:access` | Yes |
| `products:read` | Yes |
| `products:write` | Yes |
| `orders:read` | Yes |
| `orders:write` | Yes |
| `settings:read` | Yes |
| `settings:write` | Yes |

### Route Protection

Proxy (middleware) protects all `/admin/*` routes:

| Scenario | Behavior |
|----------|----------|
| No session cookie | Redirect to `/admin/login` |
| Invalid/expired token | Clear cookie, redirect to `/admin/login` |
| Valid token, no admin claim | Redirect to `/admin/unauthorized` (403) |
| Valid token, admin claim | Allow access |

---

## Server Architecture

### File Structure

```
src/
├── lib/
│   ├── firebase-admin.ts    Firebase Admin SDK initialization
│   ├── auth.ts              Authentication utilities (requireAdmin, setAdminClaim)
│   ├── session.ts           Session cookie management
│   ├── permissions.ts       Role-based permission system
│   ├── api.ts               API response helpers
│   ├── logger.ts            Structured logger
│   ├── firebase.ts          Firebase Client SDK (browser)
│   ├── data.ts              Static product/collection data
│   ├── utils.ts             Utility functions
│   ├── pricing.ts           PricingEngine — calculatePricing / buildPricingInput
│   ├── shipping.ts          ShippingProvider — FlatRateShippingProvider + singleton
│   ├── order-number.ts      generateOrderNumber() → ONX-YYYYMMDD-000001
│   ├── inventory.ts         Inventory helpers (buildInventoryItem, createReservation, etc.)
│   ├── search.ts            Product search engine — searchProducts, getSuggestions, filters
│   ├── analytics.ts         Admin analytics service — revenue/orders/customers metrics
│   ├── email-templates.ts   9 email templates (welcome, orders, alerts)
│   └── types.ts             Shared TypeScript types (Order, OrderStatus, PricingInput, etc.)
├── store/
│   ├── inventory.ts         Zustand InventoryStore — stock + reservation system
│   ├── orders.ts            Zustand order management
│   ├── cart.ts              Zustand cart store
│   ├── activity.ts          Zustand activity log
│   ├── customer.ts          Zustand customer profile
│   ├── wishlist.ts          Zustand wishlist
│   ├── reviews.ts           Zustand product reviews store
│   ├── notifications.ts     Zustand notification system store
│   └── settings.ts          Zustand store settings store
├── proxy.ts                 Route protection (middleware)
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts   Session creation
│   │   ├── logout/route.ts  Session destruction
│   │   └── session/route.ts Session verification
│   ├── admin/
│   │   ├── page.tsx         Admin dashboard (client)
│   │   ├── login/page.tsx   Login page (client)
│   │   ├── analytics/       Admin analytics dashboard
│   │   ├── settings/        Store settings page (6 tabs)
│   │   ├── unauthorized/    403 page
│   │   ├── loading.tsx      Loading state
│   │   └── error.tsx        Error boundary
│   ├── account/             Customer dashboard (profile, orders, addresses)
│   ├── checkout/
│   │   └── page.tsx         Checkout flow (client)
│   └── error.tsx            Global error boundary
```

### Key Design Decisions

1. **Middleware → Proxy**: Next.js 16 renamed middleware to proxy. Same API, different convention name.
2. **JWT Verification in Edge**: Uses `jose` library to verify Firebase ID tokens using Google's public X.509 certificates. No Firebase Admin SDK needed in Edge Runtime.
3. **HTTP-only Cookies**: Session tokens stored in HTTP-only cookies, inaccessible to JavaScript. Prevents XSS attacks.
4. **Firebase Client + Admin Split**: Client SDK for browser auth, Admin SDK for server-side operations.

---

## PricingEngine

File: `src/lib/pricing.ts`

Centralizes all price calculations for an order:

```typescript
calculatePricing(input: PricingInput): PricingResult
buildPricingInput(items, shippingCost, taxRate?, discountAmount?): PricingInput
```

| Field | Source |
|-------|--------|
| `subtotal` | Sum of `unitPrice × quantity` across items |
| `shipping` | Passed in (provided by `ShippingProvider`) |
| `tax` | `subtotal × taxRate` (default 0) |
| `discount` | Capped at `subtotal` (cannot exceed subtotal) |
| `total` | `subtotal - discount + shipping + tax` (floor 0) |
| `itemCount` | Total units across all items |

Types (`PricingInput`, `PricingResult`) are defined in `src/lib/types.ts:190-204`.

---

## ShippingProvider

File: `src/lib/shipping.ts`

### Interface

```typescript
interface ShippingProvider {
  name: string;
  calculate(subtotal: number): ShippingCalculation;
}
```

### FlatRateShippingProvider

| Subtotal | Cost | Method |
|----------|------|--------|
| ≥ ₹500,000 | ₹0 | Free Shipping (3-7 days) |
| < ₹500,000 | ₹999 | Standard Shipping (3-7 days) |

### Singleton

```typescript
getShippingProvider(): ShippingProvider
```

Returns a single `FlatRateShippingProvider` instance (lazy-initialized).

Types: `ShippingProvider` and `ShippingCalculation` in `src/lib/types.ts:162-172`.

---

## Order Numbers

File: `src/lib/order-number.ts`

```
generateOrderNumber() → "ONX-YYYYMMDD-000001"
```

| Part | Description |
|------|-------------|
| `ONX` | Static prefix (brand abbreviation) |
| `YYYYMMDD` | Current date (UTC) |
| `000001` | Daily sequential counter (resets each day, 6-digit zero-padded) |

Counter resets whenever the date changes. Thread-safe for single-process usage.

---

## Inventory Store

File: `src/store/inventory.ts`

Zustand store (`useInventoryStore`) managing stock with a reservation system:

### Reservation Lifecycle

```
reserveStock(productId, quantity, orderId) → StockReservation | null
       │
       ├── payment succeeds → confirmReservation(reservationId)
       │     Deducts stock from total, removes reservation
       │
       └── payment fails / abandoned → releaseReservation(reservationId)
             Releases reserved stock back to available pool
```

### Store API

| Method | Purpose |
|--------|---------|
| `reserveStock` | Reserve `quantity` for an order — returns `null` if insufficient |
| `confirmReservation` | Convert reservation to confirmed stock deduction |
| `releaseReservation` | Release reserved stock back (cancelled/failed orders) |
| `releaseExpiredReservations` | Bulk-release expired reservations |
| `deductStock` | Direct stock deduction (non-reservation path) |
| `restoreStock` | Return stock (e.g. returns/refunds) |
| `adjustStock` | Manual stock adjustment (admin) |
| `getItem(productId)` | Returns `InventoryItem` (defaults to 0 stock) |
| `getAvailable(productId)` | Returns `totalStock - reservedStock` |

### InventoryTransaction

Every stock operation creates an `InventoryTransaction` record:

```typescript
interface InventoryTransaction {
  id: string;
  productId: string;
  type: "stock_addition" | "stock_deduction" | "reservation" | "release"
      | "adjustment" | "order_confirm" | "order_cancel_release" | "return_restore";
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reservedBefore: number;
  reservedAfter: number;
  referenceId: string;   // order ID or admin reference
  note: string;
  timestamp: string;
}
```

Firebase persistence syncs `items`, `reservations`, and `transactions` under `inventory/`.

---

## Updated Order Type

### OrderItem (Product Snapshot)

File: `src/lib/types.ts:40-49`

```typescript
interface OrderItem {
  productId: string;
  productName: string;
  sku: string;          // SKU at time of order
  variant: string;      // Variant label
  image: string;        // Product image URL
  unitPrice: number;    // Price per unit at time of order
  quantity: number;
  lineTotal: number;    // unitPrice × quantity
}
```

### Order (extended)

File: `src/lib/types.ts:77-96`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Same as `orderNumber` |
| `orderNumber` | `string` | `ONX-YYYYMMDD-000001` |
| `items` | `OrderItem[]` | Product snapshots with SKU/variant/image/price |
| `subtotal` | `number` | From `PricingEngine` |
| `shipping` | `number` | From `ShippingProvider` |
| `tax` | `number` | From `PricingEngine` |
| `discount` | `number` | From `PricingEngine` |
| `total` | `number` | From `PricingEngine` |
| `shippingProvider` | `string` | Provider name (e.g. `"flat_rate"`) |
| `status` | `OrderStatus` | 9-state lifecycle |
| `timeline` | `OrderTimelineEvent[]` | Replaces `statusHistory` |
| `paymentId` | `string \| null` | Payment gateway reference |
| `paymentMethod` | `string` | e.g. `"dummy"` |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### OrderTimelineEvent

```typescript
interface OrderTimelineEvent {
  timestamp: string;    // ISO 8601
  actor: string;        // "customer" | "system" | "admin"
  action: string;       // e.g. "Order placed", "Payment confirmed"
  note?: string;        // Optional detail (e.g. payment ID)
}
```

---

## Updated OrderStatus

File: `src/lib/types.ts:3-12`

Now with 9 states in a forward-flow lifecycle:

```
Draft ──→ Pending Payment ──→ Confirmed ──→ Packed ──→ Shipped ──→ Delivered
  │              │                │                                      │
  └──→ Cancelled ←┘──────────────┘──────────────────────────────────────┘
                                                                         │
                                                              Returned ──┘
                                                                   │
                                                              Refunded
```

| Status | Description |
|--------|-------------|
| Draft | Initial creation, not yet submitted |
| Pending Payment | Awaiting payment confirmation |
| Confirmed | Payment received, order accepted |
| Packed | Items picked and packed |
| Shipped | Dispatched to carrier |
| Delivered | Received by customer |
| Cancelled | Order voided (from Draft, Pending Payment, or Confirmed) |
| Returned | Customer initiated return (from Delivered) |
| Refunded | Amount returned to customer |

Transition map: `ORDER_STATUS_FLOW` in `src/lib/types.ts:14-24`.

---

## Checkout Flow

File: `src/app/checkout/page.tsx`

Reservation-based checkout with four steps: Cart → Address → Payment → Confirmation.

### Flow

```
1. Cart Review
   │
2. Collect Address
   │
3. reserveStock() ←── one reservation per cart item
   │                     returns null if insufficient stock
   │
4. Payment (with dummy provider)
   │
   ├── on failure → releaseReservation() for all reserved IDs
   │
   └── on success → confirmReservation() for all reserved IDs
                     generateOrderNumber() for order ID
                     calculatePricing() for financials
                     getShippingProvider().calculate() for shipping
                     OrderItem snapshots (sku/variant/image/price)
                     addOrder() to Zustand orders store
                     orderConfirmationHtml() email (non-blocking)
                     clearCart()
```

### Key Libraries Used

| Concern | Library | Function |
|---------|---------|----------|
| Pricing | `@/lib/pricing` | `calculatePricing`, `buildPricingInput` |
| Shipping | `@/lib/shipping` | `getShippingProvider` |
| Order number | `@/lib/order-number` | `generateOrderNumber` |
| Inventory | `@/store/inventory` | `reserveStock`, `confirmReservation`, `releaseReservation` |
| Payment | `@/lib/payment` | `getPaymentProvider` |
| Email | `@/lib/email` | `getEmailProvider`, `orderConfirmationHtml` |

### Cleanup

On checkout page unmount (e.g. user navigates away before completing), all active reservations are automatically released via `useEffect` cleanup:

```typescript
useEffect(() => {
  return () => {
    reservationIds.forEach((id) => releaseReservation(id));
  };
}, [reservationIds, releaseReservation]);
```

---

## Product Search & Filtering

File: `src/lib/search.ts`

Client-side search engine for products with filtering, sorting, and URL parameter sync.

### API

| Function | Signature | Purpose |
|----------|-----------|---------|
| `searchProducts` | `(products, filters) => Product[]` | Full-text search across name, description, category, collection |
| `getSuggestions` | `(products, query) => string[]` | Autocomplete suggestions based on partial query |
| `debouncedSearch` | `(fn, delay?) => debouncedFn` | 300ms debounced wrapper for search input handlers |

### Filter Options

| Filter | Type | Description |
|--------|------|-------------|
| `category` | `string` | Filter by product category |
| `collection` | `string` | Filter by collection slug |
| `priceMin` / `priceMax` | `number` | Price range bounds |
| `inStock` | `boolean` | Show only available products |
| `badge` | `string` | Filter by product badge (e.g. "New", "Sale") |

### Sort Options

7 sort modes: `relevance`, `price-asc`, `price-desc`, `name-asc`, `name-desc`, `newest`, `oldest`.

### URL Param Sync

Filter and sort state is synced to URL search params (`?q=...&category=...&sort=...`). Enables shareable/bookmarkable filtered views and browser back/forward navigation through search state.

---

## Product Reviews

### Store

File: `src/store/reviews.ts`

Zustand store (`useReviewsStore`) managing product reviews with Firebase persistence.

| Method | Purpose |
|--------|---------|
| `addReview` | Submit a new review (linked to order for verified purchase check) |
| `getReviews(productId)` | Fetch all reviews for a product |
| `getAverageRating(productId)` | Calculate average star rating |
| `toggleHelpful(reviewId)` | Increment/decrement helpful vote count |
| `moderateReview(reviewId, action)` | Admin approve/reject/hide a review |
| `reportReview(reviewId, reason)` | Flag a review for admin review |

### Component

File: `src/components/shared/review-section.tsx`

Renders the full review experience on product pages: summary stats, review list with sorting, and review submission form (for verified purchasers).

### Types

```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;        // Links to purchase for verified badge
  rating: number;         // 1-5 stars
  title: string;
  comment: string;
  verified: boolean;      // True if linked to a delivered order
  helpful: number;        // Helpful vote count
  status: ReviewStatus;
  createdAt: string;
}

type ReviewStatus = "pending" | "approved" | "rejected" | "hidden";
```

### Features

- **Verified Purchase Badge**: Reviews linked to delivered orders are marked as verified
- **Admin Moderation**: All reviews go through approval before public display
- **Helpful Votes**: Users can mark reviews as helpful; count displayed on each review
- **Rating Summary**: Average rating, rating distribution bar chart, total count

---

## Notifications

### Store

File: `src/store/notifications.ts`

Zustand store (`useNotificationsStore`) managing real-time notifications for both admin and customer users.

| Method | Purpose |
|--------|---------|
| `addNotification` | Create a new notification (admin or customer) |
| `markAsRead(notificationId)` | Mark a single notification as read |
| `markAllAsRead()` | Mark all current notifications as read |
| `clearNotification(notificationId)` | Remove a notification |
| `getUnreadCount()` | Returns number of unread notifications |

### Component

File: `src/components/layout/notification-bell.tsx`

Header bell icon with unread count badge and dropdown notification list.

### Notification Types

| Type | Target | Trigger |
|------|--------|---------|
| `order_placed` | Admin | New customer order |
| `order_shipped` | Customer | Order dispatched |
| `order_delivered` | Customer | Order delivered |
| `order_cancelled` | Customer/Admin | Order cancelled |
| `low_stock` | Admin | Product stock below threshold |
| `new_review` | Admin | New product review submitted |
| `payment_received` | Admin | Payment confirmed |

### Features

- Unread count badge on bell icon (caps at 99+)
- Timestamp-relative display ("5m ago", "2h ago")
- Click to mark as read
- Firebase RTDB sync for real-time updates

---

## Customer Dashboard

Route: `/account`

Enhanced customer dashboard providing a central hub for account management.

### Sections

| Section | Description |
|---------|-------------|
| **Profile Completion** | Progress bar showing profile completeness; prompts for missing fields (name, phone, etc.) |
| **Order Stats** | Summary cards: total orders, total spent, average order value |
| **Wishlist Summary** | Quick view of wishlisted items with thumbnails; link to full wishlist |
| **Address Management** | Add, edit, delete shipping addresses; set default address |
| **Quick Actions** | Links to browse products, view order history, manage settings |

### Layout

- Sidebar navigation for account sub-sections
- Mobile-responsive: collapses to stacked cards on small screens
- Profile completion widget shown prominently until 100%

---

## Wishlist Enhancements

File: `src/store/wishlist.ts`

Extended wishlist functionality beyond basic add/remove.

### New Capabilities

| Feature | Description |
|---------|-------------|
| **Move to Cart** | Move a wishlisted item directly to cart (removes from wishlist) |
| **Share Wishlist** | Generate a shareable link or send via email |
| **Clear All** | Remove all items from wishlist with confirmation dialog |
| **Stock Status** | Display real-time availability (In Stock / Low Stock / Out of Stock) on each item |

### Stock Display

Wishlist items show live stock status from the inventory store. Out-of-stock items are visually dimmed with a strikethrough price. "Move to Cart" is disabled for unavailable items.

---

## Settings

### Store

File: `src/store/settings.ts`

Zustand store (`useSettingsStore`) managing configurable store settings with Firebase persistence.

| Method | Purpose |
|--------|---------|
| `getSetting(key)` | Retrieve a single setting value |
| `updateSetting(key, value)` | Update a setting (admin only) |
| `getSettings()` | Retrieve all settings as a map |
| `resetDefaults()` | Reset all settings to factory defaults |

### Admin Page

Route: `/admin/settings`

6-tab settings interface:

| Tab | Controls |
|-----|----------|
| **Store Info** | Store name, logo, tagline, contact email, phone, address |
| **Shipping** | Free shipping threshold, flat rate cost, shipping methods |
| **Tax** | Tax rate (%), tax display (inclusive/exclusive), tax regions |
| **Email** | Sender name, reply-to address, email footer, template toggles |
| **Features** | Toggle reviews, wishlist, notifications, search features on/off |
| **Banners** | Hero banners for homepage — image URL, link, active/inactive |

All settings persist to Firebase under `siteConfig/` and are accessible publicly for storefront rendering.

---

## Admin Analytics

Route: `/admin/analytics`

### Service

File: `src/lib/analytics.ts`

Computes aggregated metrics from orders and customer data.

| Function | Returns |
|----------|---------|
| `getRevenueMetrics(dateRange)` | Total revenue, average order value, revenue trend |
| `getOrderMetrics(dateRange)` | Order count, status distribution, fulfillment rate |
| `getCustomerMetrics(dateRange)` | New customers, returning customers, customer growth |
| `getTopProducts(limit)` | Top products by revenue and quantity sold |
| `getLowStockAlerts(threshold)` | Products with stock below threshold |

### Dashboard Sections

| Section | Content |
|---------|---------|
| **Revenue Overview** | Total revenue, AOV, revenue trend chart (line/bar) |
| **Orders** | Total orders, status breakdown pie chart, daily order trend |
| **Customers** | New vs returning, growth chart |
| **Top Products** | Ranked table with revenue, units sold, image |
| **Low Stock Alerts** | Products below stock threshold with restock links |

### Date Range Filtering

Analytics can be filtered by: last 7 days, 30 days, 90 days, 12 months, custom range.

---

## Admin Product Management

Enhanced product management capabilities in the admin panel.

### Bulk Operations

| Feature | Description |
|---------|-------------|
| **Bulk Select** | Checkbox selection for multiple products; select all / deselect all |
| **Bulk Delete** | Delete selected products with confirmation dialog |
| **Bulk Visibility** | Toggle visibility (publish/unpublish) for selected products |
| **Bulk Collection** | Add/remove selected products from a collection |

### Individual Product Actions

| Action | Description |
|--------|-------------|
| **Duplicate Product** | Clone a product with all variants, images, and pricing (prefixed name) |
| **Featured Toggle** | Mark/unmark product as featured for homepage display |

### Collections Management

| Feature | Description |
|---------|-------------|
| **Create Collection** | Name, slug, description, image |
| **Edit Collection** | Update metadata, reorder products |
| **Delete Collection** | Remove collection (products remain, unlinked) |
| **Assign Products** | Drag-and-drop or bulk-assign products to collections |

---

## Email Templates

File: `src/lib/email-templates.ts`

9 HTML email templates for transactional emails, all using a consistent brand layout.

| Template | Trigger | Recipient |
|----------|---------|-----------|
| `welcome` | User registration | Customer |
| `passwordReset` | Password reset request | Customer |
| `orderConfirmation` | Order placed successfully | Customer |
| `orderShipped` | Order dispatched to carrier | Customer |
| `orderDelivered` | Order delivered to customer | Customer |
| `orderCancelled` | Order cancelled | Customer |
| `orderReturn` | Return processed | Customer |
| `lowStockAlert` | Product stock below threshold | Admin |
| `newOrderAlert` | New order received | Admin |

### Template Features

- Responsive HTML layout (works in Gmail, Outlook, Apple Mail)
- Brand header with logo and colors
- Dynamic content blocks per template type
- Plain-text fallback included
- Order templates include itemized product list, totals, and tracking links

---

## Loading Skeletons

File: `src/components/shared/skeletons.tsx`

Collection of skeleton placeholder components for perceived performance during data loading.

| Component | Usage |
|-----------|-------|
| `ProductCardSkeleton` | Product card placeholder (image, title, price) |
| `ProductGridSkeleton` | Grid of `ProductCardSkeleton` (configurable count) |
| `OrderCardSkeleton` | Order summary card placeholder |
| `ReviewCardSkeleton` | Review card placeholder (avatar, stars, text) |
| `DashboardCardSkeleton` | Admin dashboard metric card placeholder |
| `TableSkeleton` | Generic table placeholder (configurable rows/columns) |
| `PageSkeleton` | Full-page loading state (header + content blocks) |

### Implementation

- All skeletons use Tailwind `animate-pulse` with a subtle shimmer effect
- Dimensions match the real components they replace (no layout shift)
- Used with React Suspense boundaries for automatic loading states
- Consistent `bg-muted` color across all skeletons

---

## Firebase RTDB Rules

File: `firebase-database-rules.json`

| Path | Read | Write |
|------|------|-------|
| `/products` | Public | Admin only |
| `/collections` | Public | Admin only |
| `/siteConfig` | Public | Admin only |
| `/orders` | Admin only | Admin only |
| `/activity` | Admin only | Admin only |
| `/users/$uid` | Owner or Admin | Owner or Admin |
| `/carts/$uid` | Owner only | Owner only |
| `/wishlists/$uid` | Owner only | Owner only |
| `/reviews/$productId` | Public | Owner (create), Admin (moderate) |
| `/notifications/$uid` | Owner or Admin | Owner or Admin |
| `/siteConfig` | Public | Admin only |
| **Default** | Deny | Deny |

---

## Environment Variables

### Client (NEXT_PUBLIC_*)
| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Firebase RTDB URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Server Only
| Variable | Description |
|----------|------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID (for Admin SDK) |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key (PEM format) |

---

## Deployment

### Vercel

1. Connect GitHub repository
2. Set all environment variables in Vercel dashboard
3. Framework preset: Next.js (auto-detected)
4. Deploy

### Firebase Setup

1. Create Firebase project (if not exists)
2. Enable Authentication > Email/Password
3. Create Realtime Database
4. Generate service account key (Project Settings > Service Accounts)
5. Set Admin SDK env vars in Vercel
6. Deploy RTDB rules from `firebase-database-rules.json`
7. Create admin user in Firebase Console
8. Set admin custom claim:

```typescript
// Run once to set admin claim
const admin = require("firebase-admin");
admin.auth().setCustomUserClaims("USER_UID", { admin: true });
```

### Post-Deployment

1. Create admin user in Firebase Console (Authentication > Users)
2. Sign in at `/admin/login`
3. Set custom claim via Firebase Admin SDK or Cloud Function
4. Verify access to `/admin`

---

## Security Checklist

- [x] No hardcoded passwords in source code
- [x] No `NEXT_PUBLIC_ADMIN_PASSWORD` env var
- [x] Admin auth via Firebase Authentication (not client-side)
- [x] Session stored in HTTP-only cookies
- [x] Proxy verifies JWT using Google's public keys
- [x] Custom claims checked server-side
- [x] Firebase RTDB rules enforce access control
- [x] `.env.local` not committed (in .gitignore)
- [x] Service account private key not committed
- [x] Admin routes protected by proxy
- [x] 403 page for unauthorized users
- [x] Error boundaries for runtime errors
- [x] CSRF protection on authenticated API routes
- [x] Rate limiting on login endpoint
- [x] Security headers (CSP, HSTS, X-Frame-Options, etc.)

---

## Admin Promotion

Use the `create-admin` script to grant admin access to a user:

```bash
npx tsx scripts/create-admin.ts admin@onixx.com
npx tsx scripts/create-admin.ts <uid>
```

The script:
1. Looks up the user by email or UID
2. Sets the `admin: true` custom claim
3. Verifies the claim was applied
4. Prints status messages

**After running**, the user must sign out and sign back in for the claim to take effect.

### Setup Steps

1. Create the user in Firebase Console (Authentication > Users)
2. Run the script: `npx tsx scripts/create-admin.ts user@email.com`
3. Have the user sign in at `/admin/login`

---

## CSRF Protection

All authenticated POST/PUT/PATCH/DELETE endpoints require a CSRF token.

### How It Works

1. Server generates an HMAC-based CSRF token bound to the user's UID
2. Token is set as an HTTP-only cookie (`__csrf`)
3. Client reads the token and sends it in the `x-csrf-token` header
4. Server validates the token matches the session

### Implementation

- `lib/csrf.ts` — Token generation, validation, cookie management
- Tokens expire after 1 hour
- Tokens are bound to the user's UID (can't be used across sessions)

---

## Rate Limiting

Protected endpoint: `/api/auth/login`

### Configuration

| Limit | Value |
|-------|-------|
| Window | 15 minutes |
| Max attempts (per IP) | 20 |
| Lockout duration | 30 minutes |

### Behavior

- IP-based tracking via `x-forwarded-for` header
- Failed login attempts are recorded
- After `maxAttempts`, the IP is locked out for `lockoutMs`
- Successful logins reset the counter
- Lockout expires automatically

### Implementation

- `lib/rate-limit.ts` — Modular, reusable rate limiter
- In-memory store (resets on server restart)
- Supports multiple namespaces for different endpoints
- Automatic cleanup of expired entries

---

## Security Headers

Configured in `next.config.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Restrictive policy | Prevents XSS, data injection |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer info |
| Permissions-Policy | Deny camera, mic, geo | Restricts browser features |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | Forces HTTPS |
| X-DNS-Prefetch-Control | on | Improves DNS lookup performance |

### CSP Breakdown

- Scripts: self + inline + eval (required for Next.js)
- Styles: self + inline + Google Fonts
- Images: self, data:, Unsplash, Google APIs
- Fonts: self, Google Fonts
- Connect: self, Firebase RTDB, Auth APIs
- Frame: none (embedded content blocked)
