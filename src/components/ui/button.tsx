"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center uppercase tracking-[2px] text-sm font-medium transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-background hover:bg-gold-hover h-[54px] px-8 rounded-[2px] hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]",
        secondary:
          "border border-border text-foreground bg-transparent hover:border-gold hover:text-gold h-[54px] px-8 rounded-[2px]",
        ghost:
          "text-foreground hover:text-gold h-[54px] px-4",
        link:
          "text-foreground underline-offset-4 hover:underline hover:text-gold h-auto p-0",
      },
      size: {
        default: "h-[54px] px-8",
        sm: "h-[42px] px-6 text-xs",
        lg: "h-[60px] px-10 text-base",
        icon: "h-[54px] w-[54px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
