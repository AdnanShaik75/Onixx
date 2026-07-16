"use client";

import { motion } from "framer-motion";
import { useProductStore } from "@/store/products";
import { ProductCard } from "@/components/shared/product-card";

export function LimitedEditionContent() {
  const { products } = useProductStore();
  const limited = products.filter((p) => p.isLimitedEdition);

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
            EXCLUSIVE
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Limited Edition
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto">
            Extraordinary timepieces produced in extremely limited quantities.
            Once sold, they are gone forever.
          </p>
        </motion.div>

        {limited.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted">
              No limited edition pieces available at this time. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {limited.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
