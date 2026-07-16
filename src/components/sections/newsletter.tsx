"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-5 h-5 text-gold" />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-heading), serif" }}
            >
              Welcome to the Circle
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-6">
              You&apos;re now part of the ONIXX inner circle. Expect exclusive
              access to new releases, private events, and curated content.
            </p>
            <p className="text-[10px] text-muted">
              You can unsubscribe at any time from your account settings.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            Join the ONIXX Circle
          </h2>

          <p className="text-sm text-muted leading-relaxed mb-10">
            Be the first to discover new releases, limited editions, and private
            events. Exclusive access awaits.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="sm:w-auto w-full"
              disabled={isLoading}
            >
              {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </Button>
          </form>

          <p className="text-[10px] text-muted mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any
            time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
