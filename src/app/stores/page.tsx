"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/shared/back-button";

const stores = [
  { city: "Online Store", subtitle: "Available Nationwide", address: "Shop from anywhere in India at onixx.com", phone: "+91 98765 43210", hours: "Available 24/7 online" },
  { city: "Customer Support", subtitle: "We're Here to Help", address: "Reach us via email, phone, or live chat", phone: "support@onixx.com", hours: "Mon–Sat, 10am–7pm IST" },
  { city: "Warehouse", subtitle: "Order Fulfillment", address: "Mumbai, Maharashtra, India", phone: "—", hours: "Orders dispatched Mon–Sat" },
];

export default function StoresPage() {
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
                CONNECT WITH US
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Where to Find Us
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                ONIXX is an online-first store serving customers across India. Browse
                our collection from anywhere, anytime.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store, i) => (
                <motion.div
                  key={store.city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-8 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors duration-300"
                >
                  <h3
                    className="text-xl font-semibold mb-1"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {store.city}
                  </h3>
                  <p className="text-xs text-gold tracking-[1px] uppercase mb-4">
                    {store.subtitle}
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{store.address}</span>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{store.phone}</span>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{store.hours}</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="inline-block mt-6 text-xs tracking-[1px] uppercase text-gold hover:text-gold-hover transition-colors"
                  >
                    Learn More &rarr;
                  </a>
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
