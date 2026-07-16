import { cn } from "@/lib/utils";
import type { BadgeType } from "@/lib/data";

const badgeStyles: Record<BadgeType, string> = {
  BESTSELLER: "bg-gold text-background",
  SALE: "bg-red-600 text-white",
  NEW: "bg-foreground text-background",
  LIMITED: "bg-gold/20 text-gold border border-gold/30",
};

interface BadgeProps {
  type: BadgeType;
  className?: string;
}

export function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[1.5px] uppercase rounded-[2px]",
        badgeStyles[type],
        className
      )}
    >
      {type}
    </span>
  );
}
