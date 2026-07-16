"use client";

import { motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const cookieTypes = [
  { name: "session_id", type: "Essential", duration: "Session", desc: "Maintains your session state across page loads." },
  { name: "cart_data", type: "Essential", duration: "30 days", desc: "Stores your shopping cart contents for persistence." },
  { name: "_ga", type: "Analytics", duration: "2 years", desc: "Google Analytics cookie used to distinguish unique users." },
  { name: "_gid", type: "Analytics", duration: "24 hours", desc: "Google Analytics cookie used to distinguish unique users." },
  { name: "_fbp", type: "Marketing", duration: "90 days", desc: "Facebook pixel cookie for ad tracking and optimization." },
  { name: "preferences", type: "Functional", duration: "1 year", desc: "Stores your preferences (currency, language, grid view)." },
];

export default function CookiesPage() {
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
                HOW WE USE COOKIES
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Cookie Policy
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Last updated: January 1, 2024
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  What Are Cookies?
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  Cookies are small text files placed on your device when you visit
                  a website. They help us recognize your browser and remember certain
                  information, such as your preferences and items in your shopping cart.
                </p>
              </motion.div>

              <Separator />

              <div>
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Cookies We Use
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Cookie</th>
                        <th className="text-left py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Type</th>
                        <th className="text-left py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Duration</th>
                        <th className="text-left py-3 text-xs tracking-[1px] uppercase text-muted font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieTypes.map((c) => (
                        <tr key={c.name} className="border-b border-border/50">
                          <td className="py-3 text-gold font-mono text-xs">{c.name}</td>
                          <td className="py-3 text-xs text-muted">{c.type}</td>
                          <td className="py-3 text-xs text-muted">{c.duration}</td>
                          <td className="py-3 text-xs text-muted">{c.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Managing Cookies
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  You can control and manage cookies through your browser settings.
                  Most browsers allow you to refuse or delete cookies. Note that
                  disabling essential cookies may affect website functionality.
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  Third-party cookies (Google Analytics, Facebook) can be managed
                  through the respective platform&apos;s privacy settings or by using
                  browser extensions that block tracking cookies.
                </p>
              </motion.div>

              <Separator />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Cookie Consent
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  When you first visit our website, you will be presented with a
                  cookie consent banner allowing you to accept or customize your
                  cookie preferences. You can update your preferences at any time
                  by clicking the &quot;Cookie Settings&quot; link in our footer.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
