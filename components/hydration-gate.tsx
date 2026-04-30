"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";

export function HydrationGate({
  children,
  requireProfile = true,
}: {
  children: React.ReactNode;
  requireProfile?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { profile } = useApp();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && requireProfile && !profile) {
      router.replace("/onboarding");
    }
  }, [mounted, profile, requireProfile, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-brand-200 dark:border-brand-500/40 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (requireProfile && !profile) return null;

  return <>{children}</>;
}
