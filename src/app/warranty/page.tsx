"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

export default function WarrantyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    model: "",
    serial: "",
    purchaseDate: "",
  });
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setRegistered(true);
  };

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
                OUR PROMISE
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Warranty
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                We stand behind the quality of our products. Here&apos;s what you can
                expect from ONIXX.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
              <div>
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                What&apos;s Covered
              </h2>
                <div className="space-y-4">
                  {[
                    "Products received in damaged or defective condition",
                    "Incorrect items shipped",
                    "Products not matching the description on our website",
                    "Quality issues reported within 7 days of delivery",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  What&apos;s Not Covered
                </h2>
                <div className="space-y-4">
                  {[
                    "Normal wear and tear from regular use",
                    "Damage caused by accidents or misuse",
                    "Issues reported after 7 days of delivery",
                    "Products damaged due to unauthorized repairs or modifications",
                    "Cosmetic damage that does not affect functionality",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="w-4 h-4 flex items-center justify-center text-muted flex-shrink-0 mt-0.5">
                        &times;
                      </span>
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  How to Claim
                </h2>
                <div className="space-y-4 mb-8">
                  {[
                  "Contact our support team with your order number",
                  "Describe the issue and share photos if applicable",
                  "Our team will review and respond within 24 hours",
                  "If eligible, we'll arrange a replacement or refund",
                  "Refunds are processed within 5–7 business days",
                ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-gold font-medium text-sm">{i + 1}.</span>
                      <span className="text-sm text-muted">{item}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                <h2
                  className="text-2xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Need Help?
                </h2>
                {registered ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-card border border-gold/30 rounded-[2px] text-center"
                  >
                    <Shield className="w-10 h-10 text-gold mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Registration Complete</h3>
                    <p className="text-sm text-muted">
                      Your request has been received. Our team will get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRegister} className="p-8 bg-card border border-border rounded-[2px] space-y-4">
                    <Input
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Order number"
                      value={form.serial}
                      onChange={(e) => setForm({ ...form, serial: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder="Describe your issue..."
                      rows={4}
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none"
                    />
                    <Button type="submit" variant="primary" className="w-full">
                      SUBMIT REQUEST
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
