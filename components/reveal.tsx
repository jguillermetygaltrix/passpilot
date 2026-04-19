"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, once]);

  const offset =
    direction === "up"
      ? "translate-y-6"
      : direction === "down"
        ? "-translate-y-6"
        : direction === "left"
          ? "translate-x-6"
          : direction === "right"
            ? "-translate-x-6"
            : "translate-y-0";

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[900ms] ease-out will-change-transform",
        shown ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${offset}`,
        className
      )}
    >
      {children}
    </div>
  );
}
