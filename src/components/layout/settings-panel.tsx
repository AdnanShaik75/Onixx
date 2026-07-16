"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border z-[61]"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-gold" />
                    <h3 className="text-sm font-medium">Currency</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["USD", "EUR", "GBP", "CHF", "JPY", "AED"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-2 text-xs tracking-wide border rounded-[2px] transition-all ${
                          currency === c
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-muted hover:border-gold/30"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-4 h-4 text-gold" />
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Order updates", default: true },
                      { label: "New arrivals", default: true },
                      { label: "Promotions", default: false },
                    ].map((item) => (
                      <label
                        key={item.label}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-sm text-muted">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={item.default}
                          className="w-4 h-4 accent-gold rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <Button variant="primary" className="w-full" onClick={handleSave}>
                  {saved ? "SAVED!" : "SAVE PREFERENCES"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
