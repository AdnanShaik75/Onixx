"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/shared/product-gallery";
import { ReviewSection } from "@/components/shared/review-section";
import { ProductCard } from "@/components/shared/product-card";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem, items, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const toast = useToast();

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const isInCart = items.some((item) => item.product.id === product.id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast(`${product.name} added to bag`);
    setTimeout(() => openCart(), 500);
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleBuyNow = () => {
    if (!isInCart) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
    router.push("/checkout");
  };

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <nav className="flex items-center gap-2 text-xs text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/collections"
            className="hover:text-gold transition-colors uppercase"
          >
            {product.collection}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col"
          >
            {product.badge && (
              <div className="mb-4">
                <Badge type={product.badge} />
              </div>
            )}

            <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-2">
              {product.category}
            </p>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fullStars
                        ? "text-gold fill-gold"
                        : i === fullStars && hasHalfStar
                        ? "text-gold fill-gold/50"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <p className="text-3xl font-medium">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p className="text-lg text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>

            <Separator className="mb-6" />

            <p className="text-sm text-muted leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap gap-4 text-xs">
                {product.caseMaterial && (
                  <div className="px-3 py-2 border border-border rounded-[2px]">
                    <span className="text-muted">Case: </span>
                    <span className="text-foreground">
                      {product.caseMaterial}
                    </span>
                  </div>
                )}
                {product.caseSize && (
                  <div className="px-3 py-2 border border-border rounded-[2px]">
                    <span className="text-muted">Size: </span>
                    <span className="text-foreground">
                      {product.caseSize}
                    </span>
                  </div>
                )}
                {product.movement && (
                  <div className="px-3 py-2 border border-border rounded-[2px]">
                    <span className="text-muted">Movement: </span>
                    <span className="text-foreground">
                      {product.movement}
                    </span>
                  </div>
                )}
                {product.waterResistance && (
                  <div className="px-3 py-2 border border-border rounded-[2px]">
                    <span className="text-muted">Water: </span>
                    <span className="text-foreground">
                      {product.waterResistance}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
              {!isOutOfStock && (
                <div className="flex items-center border border-border rounded-[2px] justify-center sm:justify-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isOutOfStock ? (
                <Button variant="secondary" className="flex-1" disabled>
                  OUT OF STOCK
                </Button>
              ) : isInCart ? (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleGoToCart}
                >
                  GO TO CART
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </Button>
              )}

              {!isOutOfStock && (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </Button>
              )}

              <Button
                variant="secondary"
                size="icon"
                onClick={() => toggleItem(product)}
                className="hidden sm:flex"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.id) ? "text-gold fill-gold" : ""
                  }`}
                />
              </Button>
            </div>

            <button
              onClick={() => toggleItem(product)}
              className="flex sm:hidden items-center justify-center gap-2 w-full py-3 border border-border rounded-[2px] text-sm text-muted hover:border-gold/50 hover:text-gold transition-all mb-8"
            >
              <Heart
                className={`w-4 h-4 ${
                  isInWishlist(product.id) ? "text-gold fill-gold" : ""
                }`}
              />
              {isInWishlist(product.id) ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-[10px] text-muted">Pan India</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-xs font-medium">Quality Assured</p>
                  <p className="text-[10px] text-muted">Verified products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-xs font-medium">7 Day Returns</p>
                  <p className="text-[10px] text-muted">Easy returns</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <ReviewSection productId={product.id} />

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-2">
              You May Also Like
            </p>
            <h2
              className="text-2xl md:text-3xl font-semibold text-foreground mb-8"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
