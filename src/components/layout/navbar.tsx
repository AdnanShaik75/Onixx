"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, User, Heart, ShoppingBag, Menu, Settings, Home } from "lucide-react";
import { NAV_ITEMS } from "@/lib/data";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { MobileMenu } from "./mobile-menu";
import { CartDrawer } from "./cart-drawer";
import { SearchModal } from "./search-modal";
import { AccountModal } from "./account-modal";
import { SettingsPanel } from "./settings-panel";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isScrolled = useScrollPosition(50);
  const { isOpen: isMobileOpen, toggle: toggleMobile, close: closeMobile } = useMobileMenu();
  const { totalItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const cartCount = totalItems();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 left-0 right-0 z-50 h-16 lg:h-[90px] transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex-shrink-0 group">
            <h1
              className="text-2xl lg:text-3xl font-heading font-semibold tracking-[4px] text-foreground group-hover:text-gold transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              ONIXX
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative py-2"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="text-[11px] tracking-[2px] uppercase text-muted hover:text-foreground transition-colors duration-300">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-gold transition-all duration-300",
                    hoveredItem === item.label ? "w-full" : "w-0"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="hidden lg:flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 h-10 px-4 border border-border rounded-[2px] text-muted hover:border-gold/50 hover:text-foreground transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] tracking-[1px] uppercase">Search</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hidden lg:flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300"
            >
              <Settings className="w-4 h-4" />
            </button>

            <Link
              href="/wishlist"
              className="hidden lg:flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300 relative"
            >
              <Heart className="w-4 h-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsAccountOpen(true)}
              className="hidden lg:flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobile}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-muted hover:text-gold transition-colors duration-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={isMobileOpen} onClose={closeMobile} />
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
