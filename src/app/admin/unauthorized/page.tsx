"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-red-500/30 flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "var(--font-heading), serif" }}
        >
          Access Denied
        </h1>
        <p className="text-sm text-muted mb-8">
          You don&apos;t have permission to access the admin dashboard.
          Contact an administrator for access.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
