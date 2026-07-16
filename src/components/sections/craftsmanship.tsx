"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Globe, Award, RefreshCw } from "lucide-react";
import { CRAFTSMANSHIP_FEATURES } from "@/lib/data";

const iconMap = {
  shield: Shield,
  globe: Globe,
  award: Award,
  refreshCw: RefreshCw,
};

export function Craftsmanship() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 bg-section">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
              ABOUT ONIXX
            </p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-2"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Timeless Style.
            </h2>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] italic text-gold mb-8"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Modern Collection.
            </h2>

            <p className="text-sm text-muted leading-relaxed mb-12 max-w-md">
              ONIXX brings together premium watches and accessories selected for
              their quality, craftsmanship, and style. Whether you&apos;re looking
              for a classic everyday watch or a statement piece, our collection is
              designed to suit every occasion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {CRAFTSMANSHIP_FEATURES.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0 group-hover:border-gold/30 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1587836374828-4dbafa74b0c2?w=800&h=1000&fit=crop&q=80"
                alt="Watch detail"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/20 rounded-[2px]" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-gold/20 rounded-[2px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
