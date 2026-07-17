"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Share2, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();

  const handleMoveToCart = useCallback(
    (product: (typeof items)[0]) => {
      const added = addItem(product);
      if (added) {
        removeItem(product.id);
        toast(`${product.name} added to cart`);
      } else {
        toast("Already in cart or out of stock");
      }
    },
    [addItem, removeItem, toast]
  );

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast("Wishlist link copied to clipboard");
  }, [toast]);

  const handleClearAll = useCallback(() => {
    items.forEach((item) => removeItem(item.id));
    toast("Wishlist cleared");
  }, [items, removeItem, toast]);

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
            SAVED
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Your Wishlist
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto">
            Timepieces you&apos;ve saved for later — your personal collection of
            desired watches.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-border" />
            </div>
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted mb-8 max-w-md mx-auto">
              Browse our collection and save the timepieces that speak to you.
            </p>
            <Link href="/watches">
              <Button variant="primary">BROWSE WATCHES</Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border"
            >
              <p className="text-sm text-muted">
                <span className="text-foreground font-medium">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>{" "}
                in your wishlist
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </Button>
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {items.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="group"
                  >
                    <div className="relative aspect-square bg-card rounded-[2px] overflow-hidden border border-border group-hover:border-gold/30 transition-all duration-500">
                      <Link href={`/watches/${product.slug}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      <p className="text-[10px] tracking-[2px] uppercase text-gold font-medium">
                        {product.category}
                      </p>
                      <Link href={`/watches/${product.slug}`}>
                        <h3 className="text-base font-medium text-foreground group-hover:text-gold transition-colors duration-300">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-muted" />
                        {product.stock > 0 ? (
                          <span className="text-[10px] text-muted">
                            {product.stock <= 5
                              ? `Only ${product.stock} left`
                              : "In Stock"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-400">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full gap-2"
                        disabled={product.stock <= 0}
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Move to Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
