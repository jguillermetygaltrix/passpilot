"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  className,
  color = "rgba(99, 102, 241, 0.18)",
  size = 480,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const parent = el.parentElement as HTMLElement | null;
    if (!parent) return;

    const style = getComputedStyle(parent);
    if (style.position === "static") {
      parent.style.position = "relative";
    }

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0",
        className
      )}
      style={{
        background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 70%)`,
      }}
    />
  );
}
