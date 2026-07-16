"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { formatPrice } from "@/lib/utils";

const giftCardAmounts = [41500, 83000, 207500, 415000];

export default function GiftCardsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <BackButton />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-[11px] tracking-[3px] uppercase text-gold font-medium mb-4">
                THE PERFECT GIFT
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Gift Cards
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Give the gift of choice. Let them pick their perfect ONIXX piece
                from our collection.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {giftCardAmounts.map((amount, i) => (
                <motion.button
                  key={amount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onClick={() => setSelected(amount)}
                  className={`p-8 border rounded-[2px] text-center transition-all duration-300 ${
                    selected === amount
                      ? "border-gold bg-gold/10"
                      : "border-border bg-card hover:border-gold/30"
                  }`}
                >
                  <Gift className="w-8 h-8 text-gold mx-auto mb-4" />
                  <p
                    className="text-3xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {formatPrice(amount)}
                  </p>
                  <p className="text-xs text-muted">
                    {selected === amount ? (
                      <span className="text-gold flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    ) : (
                      "Select Amount"
                    )}
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="max-w-2xl mx-auto text-center mb-16">
              <Button variant="primary" className="px-12" disabled={!selected}>
                PURCHASE GIFT CARD{selected ? ` — ${formatPrice(selected)}` : ""}
              </Button>
            </div>

            <Separator className="mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Redeemable Online",
                  desc: "Use your gift card on any watch or accessory in our collection, online or in-store.",
                },
                {
                  title: "Never Expires",
                  desc: "Gift cards have no expiration date. Redeem whenever you're ready to find the perfect piece.",
                },
                {
                  title: "Delivered Instantly",
                  desc: "Digital gift cards are delivered via email within minutes, ready to be gifted.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center p-6"
                >
                  <h3
                    className="text-lg font-medium mb-3"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
