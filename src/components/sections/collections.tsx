"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/lib/data";

export function Collections() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 bg-section">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
              SHOP BY CATEGORY
            </p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Our Collections
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/collections"
              className="hidden md:flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-gold hover:text-gold-hover transition-colors duration-300 group"
            >
              VIEW ALL
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/collections/${collection.id}`}
                className="group block relative aspect-[3/4] rounded-[2px] overflow-hidden border border-border hover:border-gold/30 transition-all duration-500"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[10px] tracking-[2px] uppercase text-gold mb-2">
                    Collection
                  </p>
                  <h3
                    className="text-2xl md:text-3xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {collection.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-foreground group-hover:text-gold transition-colors duration-300">
                    <span>DISCOVER</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
