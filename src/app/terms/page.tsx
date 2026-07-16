"use client";

import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", content: "By accessing or using the ONIXX website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { id: "accounts", title: "Account Terms", content: "You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to create an account. One account per person." },
  { id: "products", title: "Products & Pricing", content: "All prices are listed in INR (₹) and include applicable taxes unless otherwise stated. We reserve the right to modify prices without notice. Product images are representative; actual items may vary slightly." },
  { id: "orders", title: "Orders & Payment", content: "Placing an order constitutes an offer to purchase. We may accept or decline any order. Payment must be received in full before shipment. We accept major credit cards, UPI, net banking, and popular wallets." },
  { id: "shipping", title: "Shipping", content: "We ship to addresses across India. Risk of loss transfers to you upon delivery. We are not responsible for delays caused by shipping carriers. See our Shipping Policy page for full details." },
  { id: "returns", title: "Returns", content: "Returns are accepted within 7 days of delivery for unworn items in original packaging. Personalized or engraved items are final sale. See our Returns Policy page for the full return process." },
  { id: "liability", title: "Limitation of Liability", content: "ONIXX shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the purchase price of the product in question." },
  { id: "governing-law", title: "Governing Law", content: "These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, Maharashtra." },
];

export default function TermsPage() {
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
                TERMS & CONDITIONS
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Terms of Service
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Last updated: January 1, 2024
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
              <nav className="lg:col-span-1">
                <ul className="space-y-2 sticky top-40">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-xs text-muted hover:text-gold transition-colors"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="lg:col-span-3 space-y-8">
                {sections.map((s, i) => (
                  <motion.div
                    key={s.id}
                    id={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <h2
                      className="text-lg font-semibold mb-3"
                      style={{ fontFamily: "var(--font-heading), serif" }}
                    >
                      {s.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed">{s.content}</p>
                    {i < sections.length - 1 && <Separator className="mt-8" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
