"use client";

import { motion } from "framer-motion";
import { Award, Compass, Gem, Clock } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/shared/back-button";

const milestones = [
  { year: "2020", title: "Founded in India", desc: "ONIXX is established with a clear vision — to bring premium watches and accessories to Indian customers through a seamless online experience." },
  { year: "2021", title: "Growing Collection", desc: "Expanded our catalogue to include over 50 carefully selected watches across classic, chronograph, and smart categories." },
  { year: "2022", title: "Pan India Delivery", desc: "Rolled out secure, insured delivery across all major cities and towns in India, making premium watches accessible nationwide." },
  { year: "2023", title: "Accessories Launch", desc: "Introduced a curated range of accessories including leather straps, sunglasses, and watch winders to complement our watch collection." },
  { year: "2024", title: "New Collections", desc: "Launched our signature collections — Classic, Chronograph, and Smart — each designed to suit different lifestyles and occasions." },
  { year: "2025", title: "Looking Ahead", desc: "Continuing to expand our catalogue, improve the shopping experience, and bring you the best in watches and accessories." },
];

const values = [
  { icon: Compass, title: "Curated Selection", desc: "Every product in our catalogue is handpicked for quality, design, and value." },
  { icon: Gem, title: "Premium Quality", desc: "We partner with trusted brands and suppliers to bring you watches that meet high standards." },
  { icon: Clock, title: "Transparent Pricing", desc: "No hidden fees. What you see is what you pay, with secure checkout and clear policies." },
  { icon: Award, title: "Customer First", desc: "From browsing to delivery, every step is designed to give you a smooth, hassle-free experience." },
];

export default function StoryPage() {
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
                OUR JOURNEY
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                Our Story
              </h1>
              <p className="text-sm text-muted max-w-lg mx-auto">
                ONIXX is a premium online destination for watches and accessories,
                curated for quality, style, and everyday elegance.
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
                The values that drive everything we do.
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
