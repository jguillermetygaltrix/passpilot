"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] will-change-transform",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-pop hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110",
        secondary:
          "bg-white text-brand-700 border border-brand-200 hover:border-brand-300 hover:bg-brand-50 hover:-translate-y-0.5 shadow-soft",
        ghost: "text-foreground hover:bg-muted",
        outline:
          "border border-border bg-white hover:bg-muted text-foreground hover:-translate-y-0.5",
        dark: "bg-gradient-to-b from-slate-800 to-slate-950 text-white hover:brightness-110 hover:-translate-y-0.5 shadow-pop",
        danger:
          "bg-gradient-to-b from-rose-500 to-rose-700 text-white hover:brightness-110 hover:-translate-y-0.5 shadow-sm",
        success:
          "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white hover:brightness-110 hover:-translate-y-0.5 shadow-sm",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
