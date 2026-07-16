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
                Every ONIXX timepiece is backed by our comprehensive 5-year
                international warranty.
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
                    "Manufacturing defects in materials and workmanship",
                    "Movement malfunction under normal use",
                    "Water resistance as specified for your model",
                    "Crystal defects (cracking without impact)",
                    "Bracelet or strap defects under normal wear",
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
                    "Accidental damage (drops, impacts, scratches)",
                    "Damage from unauthorized service or modifications",
                    "Normal wear and tear (scratches, patina)",
                    "Water damage on non-diver models",
                    "Loss or theft",
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
                    "Contact our concierge team with your order number",
                    "Describe the issue and provide photos if applicable",
                    "Receive a prepaid shipping label for your watch",
                    "Our watchmakers will inspect and repair your timepiece",
                    "Fully serviced watch returned within 2–4 weeks",
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
                  Register Your Warranty
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
                      Your warranty has been registered. You&apos;ll receive a confirmation email shortly.
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
                      placeholder="Watch model (e.g., Royal Chronograph)"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Serial number"
                      value={form.serial}
                      onChange={(e) => setForm({ ...form, serial: e.target.value })}
                      required
                    />
                    <Input
                      type="date"
                      placeholder="Purchase date"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      required
                    />
                    <Button type="submit" variant="primary" className="w-full">
                      REGISTER WARRANTY
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
