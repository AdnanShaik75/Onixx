"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p
          className="text-8xl md:text-9xl font-semibold text-gold/20 mb-4"
          style={{ fontFamily: "var(--font-heading), serif" }}
        >
          404
        </p>
        <h1
          className="text-3xl md:text-4xl font-semibold mb-4"
          style={{ fontFamily: "var(--font-heading), serif" }}
        >
          Page Not Found
        </h1>
        <p className="text-sm text-muted mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
          Please return to our collection.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary">BACK TO HOME</Button>
          </Link>
          <Link href="/watches">
            <Button variant="secondary">SHOP WATCHES</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
