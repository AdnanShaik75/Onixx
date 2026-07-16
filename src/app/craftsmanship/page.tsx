"use client";

import { motion } from "framer-motion";
import { Gem, Eye, Settings, FlaskConical, Award } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const pillars = [
  {
    icon: Gem,
    title: "The Movement",
    desc: "Every ONIXX caliber is designed and assembled in-house in our Geneva manufacture. Our movements are COSC-certified chronometers, achieving accuracy within -4/+6 seconds per day. Each undergoes 500 hours of testing before leaving the workshop.",
  },
  {
    icon: Settings,
    title: "The Case",
    desc: "Our cases are machined from solid blocks of precious metals and advanced alloys. Each undergoes 12 separate finishing processes — from mirror polishing to satin brushing — by artisans with decades of experience.",
  },
  {
    icon: Eye,
    title: "The Dial",
    desc: "Guilloche patterns are hand-engraved using centuries-old rose engines. Grand Feu enamel dials require up to 40 firings at 800°C. Every index and marker is individually applied and aligned by hand.",
  },
  {
    icon: FlaskConical,
    title: "Quality Control",
    desc: "Each timepiece passes through 200+ quality checkpoints during assembly. We conduct 500 hours of simulated wear testing, water resistance verification, and precision calibration before final approval.",
  },
];

const stats = [
  { value: "130+", label: "Years of Tradition" },
  { value: "200+", label: "Components Per Watch" },
  { value: "500", label: "Hours of Testing" },
  { value: "200+", label: "Quality Checkpoints" },
];

export default function CraftsmanshipPage() {
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
                THE ART OF WATCHMAKING
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Craftsmanship
              </h1>
              <p className="text-sm text-muted max-w-lg mx-auto">
                At ONIXX, we believe a watch is more than a timekeeping device.
                It is a work of art, engineered with precision and finished by hand.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center p-6 bg-card border border-border rounded-[2px]"
                >
                  <p
                    className="text-3xl md:text-4xl font-semibold text-gold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-muted tracking-wide uppercase">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-12">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex flex-col ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 items-center p-8 bg-card border border-border rounded-[2px]`}
                >
                  <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-semibold mb-3"
                      style={{ fontFamily: "var(--font-heading), serif" }}
                    >
                      {p.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator className="my-16" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Visit Our Manufacture
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Experience the art of ONIXX firsthand. Book a private tour of our
                Geneva manufacture and witness master watchmakers at work.
              </p>
              <p className="text-xs text-muted">
                Tours available by appointment. Contact our concierge team to arrange your visit.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
