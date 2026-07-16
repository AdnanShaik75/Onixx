"use client";

import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

const caseSizes = [
  { size: "36mm", wrist: "Under 6.0\"", desc: "Classic dress watch size. Ideal for slender wrists and those who prefer understated elegance." },
  { size: "38mm", wrist: "6.0\" – 6.5\"", desc: "Versatile mid-size. Balances presence with comfort for everyday wear." },
  { size: "40mm", wrist: "6.5\" – 7.0\"", desc: "The modern standard. Suits most wrist sizes with refined proportions." },
  { size: "42mm", wrist: "7.0\" – 7.5\"", desc: "Commanding presence. Perfect for those who prefer a bolder statement." },
  { size: "44mm", wrist: "7.5\" – 8.0\"", desc: "Sport and dive territory. Strong wrist presence with robust proportions." },
  { size: "47mm+", wrist: "8.0\"+", desc: "Maximum impact. For those who want their watch to be noticed." },
];

export default function SizeGuidePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
                FIND YOUR PERFECT FIT
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Size Guide
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Choosing the right case size ensures comfort and style. Use our
                guide to find your ideal fit.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto mb-16">
              <h2
                className="text-2xl font-semibold mb-8 text-center"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Case Size Reference
              </h2>
              <div className="space-y-4">
                {caseSizes.map((item, i) => (
                  <motion.div
                    key={item.size}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-card border border-border rounded-[2px]"
                  >
                    <div className="flex items-center gap-4 sm:w-48">
                      <Ruler className="w-5 h-5 text-gold flex-shrink-0" />
                      <div>
                        <p className="text-lg font-semibold text-gold">{item.size}</p>
                        <p className="text-xs text-muted">{item.wrist}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  How to Measure Your Wrist
                </h2>
                <ol className="space-y-3 text-sm text-muted">
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">1.</span>
                    Use a flexible tape measure or a strip of paper
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">2.</span>
                    Wrap it around your wrist just below the wrist bone
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">3.</span>
                    Mark where the tape overlaps and measure the length
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">4.</span>
                    This measurement is your wrist circumference
                  </li>
                </ol>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Strap Sizing
                </h2>
                <div className="space-y-3 text-sm text-muted">
                  <p>
                    Our leather straps and metal bracelets are available in standard
                    lengths. Most bracelets can be adjusted by removing links at any
                    ONIXX boutique — complimentary for the life of the watch.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Standard strap lengths:</span>{" "}
                    Small (6.5&quot;–7.5&quot;), Medium (7.0&quot;–8.0&quot;), Large (7.5&quot;–8.5&quot;)
                  </p>
                  <p>
                    If you&apos;re between sizes, we recommend sizing up for comfort.
                    Visit any boutique for a complimentary fitting.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
