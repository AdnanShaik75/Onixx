"use client";

import { motion } from "framer-motion";
import { Gem, Eye, Settings, FlaskConical, Award } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const pillars = [
  {
    icon: Gem,
    title: "Curated for Quality",
    desc: "Every watch and accessory in our catalogue is carefully selected from trusted brands and suppliers. We evaluate each product for build quality, design, and value before it reaches our store.",
  },
  {
    icon: Settings,
    title: "Verified Products",
    desc: "We work directly with authorized distributors and brands to ensure authenticity. Each product undergoes quality checks before dispatch to maintain the standards our customers expect.",
  },
  {
    icon: Eye,
    title: "Detailed Descriptions",
    desc: "We provide comprehensive specifications, high-resolution images, and honest descriptions for every product. Our goal is to help you make informed decisions from the comfort of your home.",
  },
  {
    icon: FlaskConical,
    title: "Quality Assurance",
    desc: "From secure packaging to insured delivery, every step is designed to ensure your order arrives in perfect condition. Our support team is always available to assist with any concerns.",
  },
];

const stats = [
  { value: "500+", label: "Products Listed" },
  { value: "50+", label: "Cities Delivered" },
  { value: "10K+", label: "Happy Customers" },
  { value: "4.8", label: "Average Rating" },
];

export default function CraftsmanshipPage() {
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
                WHAT WE DO
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Our Commitment
              </h1>
              <p className="text-sm text-muted max-w-lg mx-auto">
                At ONIXX, we believe everyone deserves access to premium watches and accessories. We focus on curating quality products, providing honest information, and delivering a seamless shopping experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center p-6 bg-card border border-border rounded-[2px]"
                >
                  <p
                    className="text-3xl md:text-4xl font-semibold text-gold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-muted tracking-wide uppercase">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-12">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex flex-col ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 items-center p-8 bg-card border border-border rounded-[2px]`}
                >
                  <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-semibold mb-3"
                      style={{ fontFamily: "var(--font-heading), serif" }}
                    >
                      {p.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator className="my-16" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Get in Touch
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Have questions about our products or policies? Our team is here to
                help. Reach out to us anytime and we&apos;ll get back to you within 24 hours.
              </p>
              <p className="text-xs text-muted">
                Contact us at support@onixx.com or through our Contact page.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
