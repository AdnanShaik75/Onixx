"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/shared/product-card";
import { useProductStore } from "@/store/products";

export function FeaturedTimepieces() {
  const { products } = useProductStore();
  const featured = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
            SIGNATURE PIECES
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Featured Timepieces
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Each timepiece is a masterpiece of precision engineering and timeless
            design, crafted for those who demand nothing but the finest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
