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
│   └── types.ts             Shared TypeScript types (Order, OrderStatus, PricingInput, etc.)
├── store/
│   ├── inventory.ts         Zustand InventoryStore — stock + reservation system
│   ├── orders.ts            Zustand order management
│   ├── cart.ts              Zustand cart store
│   ├── activity.ts          Zustand activity log
│   ├── customer.ts          Zustand customer profile
│   └── wishlist.ts          Zustand wishlist (if present)
├── proxy.ts                 Route protection (middleware)
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts   Session creation
│   │   ├── logout/route.ts  Session destruction
│   │   └── session/route.ts Session verification
│   ├── admin/
│   │   ├── page.tsx         Admin dashboard (client)
│   │   ├── login/page.tsx   Login page (client)
│   │   ├── unauthorized/    403 page
│   │   ├── loading.tsx      Loading state
│   │   └── error.tsx        Error boundary
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
