"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <Link href={`/watches/${product.id}`}>
        <div className="relative aspect-square bg-card rounded-[2px] overflow-hidden border border-border group-hover:border-gold/30 transition-all duration-500">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {product.badge && (
            <div className="absolute top-4 left-4 z-10">
              <Badge type={product.badge} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <div className="mt-5 space-y-2">
        <p className="text-[10px] tracking-[2px] uppercase text-gold font-medium">
          {product.category}
        </p>
        <h3 className="text-base font-medium text-foreground group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
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
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < fullStars
                    ? "text-gold fill-gold"
                    : i === fullStars && hasHalfStar
                    ? "text-gold fill-gold/50"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted">
            ({product.reviewCount})
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product);
            }}
            className="ml-auto"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-300 ${
                isInWishlist(product.id)
                  ? "text-gold fill-gold"
                  : "text-muted hover:text-gold"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
