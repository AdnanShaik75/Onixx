"use client";

import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const pressReleases = [
  {
    date: "March 10, 2025",
    title: "ONIXX Expands Watch Catalogue with 20+ New Models",
    excerpt:
      "ONIXX adds over 20 new watches across Classic, Chronograph, and Smart categories, strengthening its position as a leading online watch retailer in India.",
  },
  {
    date: "January 22, 2025",
    title: "ONIXX Launches Pan India Express Delivery",
    excerpt:
      "Starting January 2025, ONIXX offers express delivery across 50+ Indian cities, ensuring customers receive their orders within 2–3 business days.",
  },
  {
    date: "November 5, 2024",
    title: "ONIXX Introduces Curated Accessories Collection",
    excerpt:
      "ONIXX expands beyond watches with a new accessories line featuring premium leather straps, sunglasses, and watch winders, all available with the same quality assurance.",
  },
];

export default function PressPage() {
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
                MEDIA CENTER
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Press
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Stay updated with the latest news and announcements from ONIXX.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-8 mb-16">
              {pressReleases.map((pr, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-8 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors duration-300"
                >
                  <p className="text-xs text-gold tracking-[1px] uppercase mb-3">
                    {pr.date}
                  </p>
                  <h2
                    className="text-xl font-semibold mb-3"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {pr.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {pr.excerpt}
                  </p>
                  <a
                    href="#"
                    className="text-xs tracking-[1px] uppercase text-gold hover:text-gold-hover transition-colors"
                  >
                    Read More &rarr;
                  </a>
                </motion.article>
              ))}
            </div>

            <Separator className="mb-12" />

            <div className="text-center max-w-lg mx-auto">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Press Contact
              </h2>
              <p className="text-sm text-muted mb-2">
                For media inquiries, interview requests, or high-resolution images:
              </p>
              <p className="text-sm text-gold">press@onixx.com</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
