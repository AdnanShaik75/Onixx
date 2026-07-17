"use client";

import { useEffect } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { seedFirebaseIfEmpty } from "@/lib/seed-firebase";
import { FirebaseAuthProvider } from "@/components/layout/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedFirebaseIfEmpty();
  }, []);

  return (
    <FirebaseAuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </FirebaseAuthProvider>
  );
}
