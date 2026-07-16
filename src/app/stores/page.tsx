"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/shared/back-button";

const stores = [
  { city: "Geneva", subtitle: "Flagship", address: "Rue du Rhône 48, 1204 Geneva", phone: "+41 22 310 1234", hours: "Mon–Sat 10am–7pm, Sun 12pm–5pm" },
  { city: "New York", subtitle: "Fifth Avenue", address: "712 Fifth Avenue, 10th Floor, New York, NY 10019", phone: "+1 (212) 555-0199", hours: "Mon–Sat 10am–8pm, Sun 11am–6pm" },
  { city: "Tokyo", subtitle: "Ginza", address: "4-6-16 Ginza, Chuo-ku, Tokyo 104-0061", phone: "+81 3-5555-0188", hours: "Mon–Sat 11am–8pm, Sun 11am–7pm" },
  { city: "London", subtitle: "Bond Street", address: "141 New Bond Street, London W1S 2BS", phone: "+44 20 7555 0177", hours: "Mon–Sat 10am–7pm, Sun 12pm–5pm" },
  { city: "Dubai", subtitle: "The Dubai Mall", address: "Financial Center Rd, Dubai, UAE", phone: "+971 4 555 0166", hours: "Sat–Thu 10am–12am, Fri 2pm–12am" },
  { city: "Hong Kong", subtitle: "Tsim Sha Tsui", address: "18 Salisbury Road, Tsim Sha Tsui, Hong Kong", phone: "+852 2555 0155", hours: "Mon–Sat 10:30am–8:30pm, Sun 11am–8pm" },
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
                FIND A STORE
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Our Boutiques
              </h1>
              <p className="text-sm text-muted max-w-md mx-auto">
                Visit an ONIXX boutique for a personalized experience. Our
                specialists will guide you through our collection.
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
                    Get Directions &rarr;
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
