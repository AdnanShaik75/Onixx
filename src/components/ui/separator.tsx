import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
  variant?: "default" | "gold";
}

export function Separator({ className, variant = "default" }: SeparatorProps) {
  return (
    <div
      className={cn(
        "h-px w-full",
        variant === "gold" ? "bg-gold/30" : "bg-border",
        className
      )}
    />
  );
}
