"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/shared/back-button";

const positions = [
  { title: "Customer Support Executive", department: "Client Services", location: "Remote", type: "Full-time" },
  { title: "Content Writer", department: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Social Media Manager", department: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Order Fulfillment Associate", department: "Operations", location: "Mumbai", type: "Full-time" },
  { title: "UI/UX Designer", department: "Product", location: "Remote", type: "Full-time" },
];

export default function CareersPage() {
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
                JOIN THE TEAM
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Careers
              </h1>
              <p className="text-sm text-muted max-w-lg mx-auto">
                We&apos;re building a team of passionate people who believe in making
                premium watches and accessories accessible to everyone in India.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-sm text-muted leading-relaxed text-center mb-12">
                At ONIXX, every team member contributes to creating a seamless shopping
                experience for our customers. We offer competitive compensation, a
                flexible work environment, and the opportunity to grow with a fast-paced
                e-commerce brand.
              </p>

              <div className="space-y-4">
                {positions.map((pos, i) => (
                  <motion.div
                    key={pos.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card border border-border rounded-[2px] hover:border-gold/30 transition-colors duration-300"
                  >
                    <div className="mb-4 sm:mb-0">
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ fontFamily: "var(--font-heading), serif" }}
                      >
                        {pos.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {pos.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {pos.location}
                        </span>
                        <span className="px-2 py-0.5 border border-border rounded-[2px]">
                          {pos.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="secondary" className="sm:flex-shrink-0">
                      APPLY NOW
                    </Button>
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
