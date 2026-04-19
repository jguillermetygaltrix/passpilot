import { cn } from "@/lib/utils";
import * as React from "react";

interface GradientBorderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  radius?: string;
  innerClassName?: string;
  thickness?: number;
}

export function GradientBorder({
  gradient = "linear-gradient(135deg, #3d60ff 0%, #8250f5 50%, #06b6d4 100%)",
  radius = "20px",
  innerClassName,
  thickness = 1.5,
  className,
  children,
  ...props
}: GradientBorderProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        borderRadius: radius,
        background: gradient,
        padding: thickness,
      }}
      {...props}
    >
      <div
        className={cn("bg-white relative", innerClassName)}
        style={{
          borderRadius: `calc(${radius} - ${thickness}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
