"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-[61] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading), serif" }}
                >
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <User className="w-7 h-7 text-gold" />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-heading), serif" }}
                  >
                    Welcome{mode === "register" ? " to ONIXX" : " Back"}
                  </h3>
                  <p className="text-sm text-muted mb-6">
                    {mode === "register"
                      ? "Your account has been created successfully."
                      : "You have been signed in successfully."}
                  </p>
                  <Button variant="primary" onClick={handleClose}>
                    CONTINUE SHOPPING
                  </Button>
                </motion.div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <User className="w-3 h-3 text-muted" />
                          <label className="text-xs text-muted">Full Name</label>
                        </div>
                        <Input
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Mail className="w-3 h-3 text-muted" />
                        <label className="text-xs text-muted">Email</label>
                      </div>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Lock className="w-3 h-3 text-muted" />
                        <label className="text-xs text-muted">Password</label>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" variant="primary" className="w-full mt-6">
                      {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-muted">
                      {mode === "signin" ? (
                        <>
                          Don&apos;t have an account?{" "}
                          <button
                            onClick={() => setMode("register")}
                            className="text-gold hover:text-gold-hover transition-colors"
                          >
                            Create one
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            onClick={() => setMode("signin")}
                            className="text-gold hover:text-gold-hover transition-colors"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
