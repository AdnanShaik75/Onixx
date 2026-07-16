"use client";

import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { seedFirebaseIfEmpty } from "@/lib/seed-firebase";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedFirebaseIfEmpty();
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
}
