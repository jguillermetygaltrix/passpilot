"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const platform =
      (navigator as any).userAgentData?.platform ||
      navigator.platform ||
      navigator.userAgent;
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform));
  }, []);
  return isMac;
}

export function ModKey({ className }: { className?: string }) {
  const isMac = useIsMac();
  return (
    <span className={cn("font-mono", className)}>{isMac ? "⌘" : "Ctrl"}</span>
  );
}

export function ModK({ className }: { className?: string }) {
  const isMac = useIsMac();
  return (
    <span className={cn("font-mono", className)}>
      {isMac ? "⌘K" : "Ctrl K"}
    </span>
  );
}
