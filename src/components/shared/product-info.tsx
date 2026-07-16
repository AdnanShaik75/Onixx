"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/shared/product-gallery";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
  };

  return (
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
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
                <span className="text-foreground">{product.caseMaterial}</span>
              </div>
            )}
            {product.caseSize && (
              <div className="px-3 py-2 border border-border rounded-[2px]">
                <span className="text-muted">Size: </span>
                <span className="text-foreground">{product.caseSize}</span>
              </div>
            )}
            {product.movement && (
              <div className="px-3 py-2 border border-border rounded-[2px]">
                <span className="text-muted">Movement: </span>
                <span className="text-foreground">{product.movement}</span>
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
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleAddToCart}
          >
            ADD TO BAG
          </Button>
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
              <p className="text-[10px] text-muted">Worldwide</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold" />
            <div>
              <p className="text-xs font-medium">5 Year Warranty</p>
              <p className="text-[10px] text-muted">International</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-gold" />
            <div>
              <p className="text-xs font-medium">30 Day Returns</p>
              <p className="text-[10px] text-muted">No questions</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
