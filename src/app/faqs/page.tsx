"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/shared/back-button";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our collection, select your desired timepiece, choose any options, and add it to your bag. Proceed to checkout where you can enter your shipping and payment details. You'll receive an order confirmation email immediately after purchase.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and offer financing options through Affirm for qualifying purchases. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping across India takes 5–7 business days. Express shipping (2–3 business days) is available at checkout for select cities. All shipments are fully insured and require signature upon delivery.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day return policy on all unworn items in original packaging. Simply contact our support team to initiate a return. Refunds are processed within 5–7 business days of receiving the returned item. Personalized or engraved items cannot be returned.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order from your account dashboard. For any issues, contact our support team with your order number.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Cash on delivery is available for select pin codes across India. You can check availability at checkout by entering your delivery address. Prepaid orders are processed faster.",
  },
  {
    q: "How should I care for my watch?",
    a: "Avoid exposure to extreme temperatures, magnets, and chemicals. Clean your watch regularly with a soft cloth. For water-resistant models, have the seals tested annually. We recommend servicing your mechanical watch every 3–5 years.",
  },
  {
    q: "Do you offer engraving?",
    a: "Yes, we offer engraving on select models. Engraved pieces are personalized and cannot be returned. Engraving adds 2–3 business days to the processing time. Contact our support team for available engraving options.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                HELP CENTER
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Frequently Asked Questions
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Find answers to common questions about our timepieces, services,
                and policies.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border border-border rounded-[2px] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-card/80 transition-colors"
                  >
                    <span className="text-sm font-medium pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-300 ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-6 pb-6 text-sm text-muted leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
