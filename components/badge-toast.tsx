"use client";

/**
 * Badge unlock toast — celebratory notification when a new badge fires.
 *
 * Why a custom toast (not a generic library):
 *   - Zero dependencies — keeps the bundle lean
 *   - Brand-tuned animation (slide-up + scale-in + glow ring)
 *   - Stacks if multiple badges unlock simultaneously (e.g. first mock pass
 *     can fire Mock Champion + Game Day Rehearsal + Renaissance Pilot all at once)
 *   - Click-to-dismiss + auto-dismiss after 5s
 *
 * Usage:
 *   1. <BadgeToastHost /> mounted once at the app root (in layout.tsx)
 *   2. Anywhere a badge unlock should celebrate, call:
 *        import { fireBadgeUnlocks } from "@/components/badge-toast";
 *        fireBadgeUnlocks(newlyUnlockedBadges);
 *   3. The host listens via a CustomEvent on window — no Zustand
 *      coupling needed, works from any context.
 */

import { useEffect, useState } from "react";
import { Sparkles, X, Trophy } from "lucide-react";
import type { BadgeDef } from "@/lib/achievements";

const EVENT_NAME = "passpilot:badge-unlock";
const AUTO_DISMISS_MS = 5000;

type ToastItem = BadgeDef & { _key: string };

export function fireBadgeUnlocks(badges: BadgeDef[]): void {
  if (typeof window === "undefined" || !badges.length) return;
  window.dispatchEvent(
    new CustomEvent<BadgeDef[]>(EVENT_NAME, { detail: badges })
  );
}

export function BadgeToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<BadgeDef[]>).detail;
      if (!Array.isArray(detail) || !detail.length) return;
      setItems((prev) => [
        ...prev,
        ...detail.map((b, i) => ({
          ...b,
          _key: `${Date.now()}-${i}-${b.id}`,
        })),
      ]);
    };
    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () =>
      window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!items.length) return;
    const oldest = items[0];
    const t = setTimeout(() => {
      setItems((prev) => prev.filter((i) => i._key !== oldest._key));
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [items]);

  if (!items.length) return null;

  const dismiss = (key: string) => {
    setItems((prev) => prev.filter((i) => i._key !== key));
  };

  return (
    <div
      className="fixed top-20 right-4 z-[80] flex flex-col gap-2 max-w-sm pointer-events-none print:hidden"
      aria-live="polite"
    >
      {items.map((b) => {
        const tone = rarityTone(b.rarity);
        return (
          <div
            key={b._key}
            className={`pointer-events-auto rounded-2xl border-2 backdrop-blur-md shadow-pop animate-slide-up cursor-pointer overflow-hidden relative ${tone.border} ${tone.bg}`}
            onClick={() => dismiss(b._key)}
            role="status"
          >
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-50 ${tone.glow}`}
            />
            <div className="relative p-4 flex items-start gap-3">
              <div className="text-4xl shrink-0 leading-none mt-0.5">
                {b.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Trophy className={`h-3 w-3 ${tone.text}`} />
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold ${tone.text}`}
                  >
                    Badge unlocked · {b.rarity}
                  </span>
                </div>
                <div className="text-sm font-semibold leading-snug">
                  {b.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {b.unlockedDescription || b.description}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss(b._key);
                }}
                className="h-6 w-6 shrink-0 rounded-md hover:bg-black/5 flex items-center justify-center text-muted-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="relative px-4 pb-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Sparkles className="h-2.5 w-2.5" />
              Tap to view all badges
            </div>
          </div>
        );
      })}
    </div>
  );
}

function rarityTone(r: BadgeDef["rarity"]): {
  border: string;
  bg: string;
  glow: string;
  text: string;
} {
  switch (r) {
    case "legendary":
      return {
        border: "border-amber-400",
        bg: "bg-gradient-to-br from-amber-50 via-white to-amber-50/50",
        glow: "bg-amber-300",
        text: "text-amber-700",
      };
    case "epic":
      return {
        border: "border-violet-400",
        bg: "bg-gradient-to-br from-violet-50 via-white to-violet-50/50",
        glow: "bg-violet-300",
        text: "text-violet-700",
      };
    case "rare":
      return {
        border: "border-cyan-400",
        bg: "bg-gradient-to-br from-cyan-50 via-white to-cyan-50/50",
        glow: "bg-cyan-300",
        text: "text-cyan-700",
      };
    default:
      return {
        border: "border-slate-300",
        bg: "bg-white",
        glow: "bg-slate-200",
        text: "text-slate-600",
      };
  }
}
