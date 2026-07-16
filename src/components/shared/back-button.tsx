"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-xs text-muted hover:text-gold transition-colors duration-300 mb-8"
    >
      <ArrowLeft className="w-3 h-3" />
      <span className="tracking-[1px] uppercase">Back</span>
    </button>
  );
}
