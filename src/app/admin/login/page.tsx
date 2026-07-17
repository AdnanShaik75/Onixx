"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirebaseAuth } from "@/components/layout/auth-provider";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const { signIn, sendPasswordReset } = useFirebaseAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const idToken = await result.user?.getIdToken();

      if (!idToken) {
        setError("Failed to create session");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Session creation failed");
        setLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (!sessionData.data?.user?.isAdmin) {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await sendPasswordReset(email);

      if (result.error) {
        setError(result.error);
      } else {
        setResetSent(true);
      }
    } catch {
      setError("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-gold/30 flex items-center justify-center">
            <Lock className="w-7 h-7 text-gold" />
          </div>
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-heading), serif" }}
          >
            ONIXX Admin
          </h1>
          <p className="text-sm text-muted">
            {resetMode ? "Reset your password" : "Sign in to access the dashboard"}
          </p>
        </div>

        {resetMode ? (
          resetSent ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-[2px] bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400">
                  Password reset email sent. Check your inbox.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setResetMode(false);
                  setResetSent(false);
                }}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="text-xs text-muted">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@onixx.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setResetMode(false);
                  setError("");
                }}
                className="w-full text-xs text-muted hover:text-foreground text-center transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-muted">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@onixx.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10"
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

            {error && (
              <div className="p-3 rounded-[2px] bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "ACCESS DASHBOARD"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setResetMode(true);
                setError("");
              }}
              className="w-full text-xs text-muted hover:text-gold text-center transition-colors"
            >
              Forgot password?
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
