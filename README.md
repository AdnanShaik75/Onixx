# ONIXX — Luxury Watch Store

A premium e-commerce storefront for ONIXX luxury timepieces, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State:** Zustand (with localStorage persistence)
- **Fonts:** Playfair Display + Inter (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout
│   ├── watches/            # Product catalog
│   ├── collections/        # Collection pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── wishlist/           # Saved items
│   └── ...                 # Info pages (shipping, warranty, etc.)
├── components/
│   ├── layout/             # Navbar, Footer, Drawers, Modals
│   ├── sections/           # Homepage sections
│   ├── shared/             # ProductCard, Gallery, ProductInfo
│   └── ui/                 # Button, Input, Badge, Separator
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and product data
└── store/                  # Zustand stores (cart, wishlist)
```

## Features

- **Product catalog** with category filtering, sorting, and grid toggle
- **Product detail pages** with image gallery, specs, and add-to-cart
- **Cart** with slide-in drawer + full page, localStorage persistence
- **Wishlist** with persistence
- **Search modal** with real-time filtering
- **Checkout** with form validation and order confirmation
- **Account & Settings** slide-in panels
- **Mobile responsive** with hamburger navigation
- **SEO metadata** on all pages
- **Dark luxury theme** with gold accents and animations
- **14 informational pages** (shipping, warranty, FAQs, size guide, etc.)

## Products

12 luxury watches across 3 collections (Signature, Heritage, Skeleton), ranging from $3,450 to $45,000.
