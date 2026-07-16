"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[54px] w-full border border-border bg-card px-5 py-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-gold/50 transition-colors duration-300 rounded-[2px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
