"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
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
                GET IN TOUCH
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Contact Us
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Our concierge team is available to assist with any inquiries about
                our timepieces and services.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 bg-card border border-border rounded-[2px] text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-gold mx-auto mb-6" />
                    <h2
                      className="text-2xl font-semibold mb-4"
                      style={{ fontFamily: "var(--font-heading), serif" }}
                    >
                      Message Sent
                    </h2>
                    <p className="text-sm text-muted">
                      Thank you for reaching out. Our team will respond within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 bg-card border border-border rounded-[2px] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your name"
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
                    </div>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full h-10 px-3 bg-transparent border border-border rounded-[2px] text-sm text-foreground focus:outline-none focus:border-gold/50"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales</option>
                      <option value="support">Customer Support</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="press">Press</option>
                    </select>
                    <textarea
                      placeholder="Your message"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-transparent border border-border rounded-[2px] text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 resize-none"
                    />
                    <Button type="submit" variant="primary" className="w-full sm:w-auto">
                      SEND MESSAGE
                    </Button>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "+1 (800) ONIXX-WT", sub: "Mon–Fri, 9am–6pm EST" },
                  { icon: Mail, label: "Email", value: "concierge@onixx.com", sub: "Response within 24 hours" },
                  { icon: MapPin, label: "Headquarters", value: "Rue du Rhône 48", sub: "1204 Geneva, Switzerland" },
                ].map((item) => (
                  <div key={item.label} className="p-6 bg-card border border-border rounded-[2px]">
                    <item.icon className="w-5 h-5 text-gold mb-3" />
                    <h3 className="text-sm font-medium mb-1">{item.label}</h3>
                    <p className="text-sm text-foreground">{item.value}</p>
                    <p className="text-xs text-muted mt-1">{item.sub}</p>
                  </div>
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
