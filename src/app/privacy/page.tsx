"use client";

import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "collection", title: "Information We Collect", content: "We collect information you provide directly, such as your name, email, shipping address, and payment information when you make a purchase. We also automatically collect certain data about your device and browsing behavior through cookies and similar technologies." },
  { id: "usage", title: "How We Use Your Information", content: "We use your information to process transactions, send order updates, provide customer support, personalize your experience, and send marketing communications (with your consent). We may also use data to improve our website and services." },
  { id: "sharing", title: "Data Sharing", content: "We do not sell your personal information. We share data with service providers who assist in operations (payment processing, shipping, analytics) and as required by law. All third-party providers are contractually obligated to protect your data." },
  { id: "transfers", title: "International Transfers", content: "Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses where required." },
  { id: "rights", title: "Your Rights", content: "You have the right to access, correct, delete, or port your personal data. You can also opt out of marketing communications at any time. To exercise these rights, contact our privacy team at privacy@onixx.com." },
  { id: "retention", title: "Data Retention", content: "We retain your information for as long as necessary to provide services and comply with legal obligations. Purchase records are retained for 7 years. Marketing preferences are maintained until you unsubscribe." },
  { id: "contact", title: "Contact Us", content: "For privacy-related inquiries, contact our Data Protection Officer at privacy@onixx.com or write to: ONIXX SA, Data Protection, Rue du Rhône 48, 1204 Geneva, Switzerland." },
];

export default function PrivacyPage() {
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
                YOUR DATA, YOUR RIGHTS
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Privacy Policy
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
