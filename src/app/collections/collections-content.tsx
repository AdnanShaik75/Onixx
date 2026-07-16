"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/lib/data";

export default function CollectionsContent() {
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
            EXPLORE
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Our Collections
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto">
            Each collection represents a distinct chapter in the ONIXX story,
            curated for those who appreciate the extraordinary.
          </p>
        </motion.div>

        <div className="space-y-8">
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
                className="group block relative h-[400px] md:h-[500px] rounded-[2px] overflow-hidden border border-border hover:border-gold/30 transition-all duration-500"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                  <p className="text-[10px] tracking-[2px] uppercase text-gold mb-3">
                    Collection
                  </p>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {collection.title}
                  </h2>
                  <p className="text-sm text-muted mb-6 max-w-md">
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase text-foreground group-hover:text-gold transition-colors duration-300">
                    <span>DISCOVER</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
