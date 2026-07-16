"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, Shield, Globe } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

export default function ShippingPage() {
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
                DELIVERY INFORMATION
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Shipping & Returns
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Shipping
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Globe className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Pan India Free Shipping</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        Every ONIXX order includes free insured shipping to
                        addresses across India. All shipments require signature upon delivery.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Truck className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Standard (5–7 Business Days)</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        Standard domestic shipping. Tracking information is
                        provided within 24 hours of dispatch.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Truck className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Express (2–3 Business Days)</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        Need it faster? Select express shipping at checkout for an
                        additional fee. Available for select cities.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Truck className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Express Shipping (2–3 Business Days)</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        Need it faster? Select express shipping at checkout for an
                        additional fee. Available for most destinations.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Returns
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <RotateCcw className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">7-Day Return Policy</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        We want you to love your ONIXX purchase. If you&apos;re not completely
                        satisfied, return your unworn item within 7 days for a full refund.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium mb-1">Conditions</h3>
                      <p className="text-sm text-muted leading-relaxed">
                        Items must be in original, unworn condition with all packaging,
                        tags, and documentation. Personalized or engraved items are
                        final sale and cannot be returned.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <h3 className="text-sm font-medium mb-4">How to Initiate a Return</h3>
                <ol className="space-y-3 text-sm text-muted">
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">1.</span>
                    Contact our support team with your order number
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">2.</span>
                    Receive a prepaid return shipping label via email
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">3.</span>
                    Pack the watch securely in its original packaging
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">4.</span>
                    Drop off at your nearest shipping location
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-medium">5.</span>
                    Refund processed within 5–7 business days of receipt
                  </li>
                </ol>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
