"use client";

import { ANNOUNCEMENT_ITEMS } from "@/lib/data";

export function AnnouncementBar() {
  return (
    <div className="bg-background border-b border-border">
      <div className="flex items-center justify-center h-8 px-4 overflow-hidden">
        <p className="text-[9px] sm:text-[10px] tracking-[1.5px] sm:tracking-[2px] uppercase text-gold font-medium whitespace-nowrap">
          {ANNOUNCEMENT_ITEMS.map((item, i) => (
            <span key={item}>
              {item}
              {i < ANNOUNCEMENT_ITEMS.length - 1 && (
                <span className="mx-2 sm:mx-3 text-gold/40">&#8226;</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
