"use client";

import { motion } from "framer-motion";
import { Award, Compass, Gem, Clock } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

const milestones = [
  { year: "1892", title: "Founded in Geneva", desc: "Master horologist Émile ONIXX establishes the maison on Rue du Rhône, driven by a vision of precision and beauty." },
  { year: "1920", title: "First Automatic Movement", desc: "ONIXX unveils the Caliber A01, one of the earliest self-winding movements, earning recognition from the Geneva Observatory." },
  { year: "1955", title: "The Chronograph Era", desc: "Introduction of the column-wheel chronograph cementing ONIXX's reputation in complication watchmaking." },
  { year: "1980", title: "Skeleton Collection", desc: "The Skeleton collection debuts, showcasing the art of open-worked movements and hand-finished bridges." },
  { year: "2010", title: "Modern Renaissance", desc: "A new generation of watchmakers brings contemporary design while honoring 118 years of tradition." },
  { year: "2024", title: "The Future", desc: "ONIXX continues to push boundaries with in-house tourbillons, perpetual calendars, and sustainable practices." },
];

const values = [
  { icon: Compass, title: "Innovation", desc: "Pushing the boundaries of mechanical watchmaking while respecting centuries of tradition." },
  { icon: Gem, title: "Craftsmanship", desc: "Every component hand-finished to the highest standards of Swiss haute horlogerie." },
  { icon: Clock, title: "Precision", desc: "COSC-certified chronometers delivering accuracy within -4/+6 seconds per day." },
  { icon: Award, title: "Legacy", desc: "Over 130 years of continuous innovation, with each generation building on the last." },
];

export default function StoryPage() {
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
                THE ONIXX JOURNEY
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Our Story
              </h1>
              <p className="text-sm text-muted max-w-lg mx-auto">
                Since 1892, ONIXX has been at the forefront of Swiss watchmaking,
                blending heritage craftsmanship with forward-thinking design.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-12">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-gold border-4 border-background" />
                      <p className="text-gold text-xs tracking-[2px] uppercase font-medium mb-1">
                        {m.year}
                      </p>
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ fontFamily: "var(--font-heading), serif" }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="mb-16" />

            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Our Values
              </h2>
              <p className="text-sm text-muted max-w-md mx-auto">
                The principles that guide every timepiece we create.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
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
