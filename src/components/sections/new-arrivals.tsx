"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/shared/product-card";
import { useProductStore } from "@/store/products";

export function NewArrivals() {
  const { products } = useProductStore();
  const arrivals = products.filter((p) => p.isNewArrival);
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
            JUST ARRIVED
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            New Arrivals
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {arrivals.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
