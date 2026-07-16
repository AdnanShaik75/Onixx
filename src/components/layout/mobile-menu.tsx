"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Home } from "lucide-react";
import { NAV_ITEMS } from "@/lib/data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between h-16 lg:h-[90px] px-6 border-b border-border">
              <h2
                className="text-xl font-semibold tracking-[3px] text-foreground"
                style={{ fontFamily: "var(--font-heading), serif" }}
              >
                ONIXX
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 text-muted hover:text-foreground transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Link
                  href="/"
                  onClick={onClose}
                  className="block py-4 border-b border-border group"
                >
                  <span className="flex items-center gap-3 text-sm tracking-[3px] uppercase text-gold group-hover:text-gold-hover transition-colors duration-300">
                    <Home className="w-4 h-4" /> HOME
                  </span>
                </Link>
              </motion.div>
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-4 border-b border-border group"
                  >
                    <span className="text-sm tracking-[3px] uppercase text-muted group-hover:text-gold transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-6 lg:px-8 pb-8">
              <p className="text-[10px] tracking-[2px] uppercase text-muted text-center">
                COMPLIMENTARY WORLDWIDE SHIPPING
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
