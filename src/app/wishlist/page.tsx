"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { BackButton } from "@/components/shared/back-button";
import { useWishlistStore } from "@/store/wishlist";

export default function WishlistPage() {
  const { items } = useWishlistStore();

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
          <div className="text-center py-24">
            <Heart className="w-16 h-16 text-border mx-auto mb-6" />
            <p className="text-sm text-muted mb-8 max-w-md mx-auto">
              Your wishlist is empty. Browse our collection and save the
              timepieces that speak to you.
            </p>
            <Link href="/watches">
              <Button variant="primary">EXPLORE WATCHES</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
