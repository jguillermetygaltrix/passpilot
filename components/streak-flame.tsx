"use client";

/**
 * <StreakFlame /> — DEC-054 polish. The flame visual that grows with
 * the user's streak length. Replaces a flat lucide Flame icon everywhere
 * a streak number is shown.
 *
 * Tier ladder (Duolingo-tested + nudged up the cult-feel ladder):
 *
 *   Days 0      → gray ash flame ("not lit")
 *   Days 1-2    → orange ember (small, no glow)
 *   Days 3-6    → orange flame (medium, soft warm glow)
 *   Days 7-13   → red-orange torch (large, pulsing warm glow)
 *   Days 14-29  → red bonfire (large, strong red glow)
 *   Days 30-59  → cyan-blue flame (peak fire, blue-white glow)
 *   Days 60+    → violet-blue plasma (cosmic — the user is mythical)
 *
 * The growth is psychologically engineered: each tier crossing feels
 * like a level-up, and the visual jump is BIGGER at later tiers so the
 * marginal motivation per streak day stays high.
 */

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type StreakTier =
  | "ash"
  | "ember"
  | "flame"
  | "torch"
  | "bonfire"
  | "blue"
  | "plasma";

export function streakTier(days: number): StreakTier {
  if (days <= 0) return "ash";
  if (days < 3) return "ember";
  if (days < 7) return "flame";
  if (days < 14) return "torch";
  if (days < 30) return "bonfire";
  if (days < 60) return "blue";
  return "plasma";
}

export function streakTierLabel(tier: StreakTier): string {
  switch (tier) {
    case "ash":
      return "Not lit yet";
    case "ember":
      return "Just sparked";
    case "flame":
      return "Burning";
    case "torch":
      return "Torch lit";
    case "bonfire":
      return "Bonfire";
    case "blue":
      return "Blue flame";
    case "plasma":
      return "Plasma — mythical";
  }
}

interface FlameStyle {
  /** Tailwind classes for the icon color/fill */
  iconClass: string;
  /** Tailwind classes for the glow halo behind the icon (or empty for none) */
  glowClass: string;
  /** Whether to apply the pulse animation (mid+ tiers feel "alive") */
  pulse: boolean;
  /** Icon size multiplier (relative to the requested base size). Higher tiers
   *  are visually larger to make level-ups feel earned. */
  scale: number;
}

function styleForTier(tier: StreakTier): FlameStyle {
  switch (tier) {
    case "ash":
      return { iconClass: "text-slate-400 dark:text-slate-500", glowClass: "", pulse: false, scale: 0.85 };
    case "ember":
      return { iconClass: "text-orange-400", glowClass: "", pulse: false, scale: 0.9 };
    case "flame":
      return {
        iconClass: "text-orange-500",
        glowClass: "bg-orange-400/30 blur-md",
        pulse: false,
        scale: 1.0,
      };
    case "torch":
      return {
        iconClass: "text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.55)]",
        glowClass: "bg-orange-500/40 blur-lg",
        pulse: true,
        scale: 1.1,
      };
    case "bonfire":
      return {
        iconClass: "text-rose-600 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]",
        glowClass: "bg-rose-500/45 blur-xl",
        pulse: true,
        scale: 1.2,
      };
    case "blue":
      return {
        iconClass: "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]",
        glowClass: "bg-cyan-400/50 blur-xl",
        pulse: true,
        scale: 1.3,
      };
    case "plasma":
      return {
        iconClass:
          "text-violet-400 drop-shadow-[0_0_16px_rgba(167,139,250,0.85)]",
        glowClass:
          "bg-gradient-to-tr from-violet-500/60 to-cyan-400/50 blur-2xl",
        pulse: true,
        scale: 1.4,
      };
  }
}

/**
 * Render a streak-aware flame. `size` is the BASE pixel size; tier scaling
 * multiplies it. Glow renders behind via an absolutely-positioned blur layer
 * — caller's container should be `relative` for the glow to anchor properly,
 * but we wrap in our own relative span for safety.
 */
export function StreakFlame({
  days,
  size = 16,
  className,
  showGlow = true,
}: {
  days: number;
  /** Base icon size in px. Tier scaling applied multiplicatively. */
  size?: number;
  className?: string;
  /** Disable the blur halo (useful inside chips where glow would smear). */
  showGlow?: boolean;
}) {
  const tier = streakTier(days);
  const style = styleForTier(tier);
  const finalSize = Math.round(size * style.scale);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center shrink-0",
        className
      )}
      style={{ width: finalSize, height: finalSize }}
    >
      {showGlow && style.glowClass && (
        <span
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none",
            style.glowClass,
            style.pulse && "animate-pulse"
          )}
          aria-hidden
        />
      )}
      <Flame
        className={cn("relative", style.iconClass, style.pulse && "animate-flame-flicker")}
        style={{ width: finalSize, height: finalSize }}
        strokeWidth={2.25}
      />
    </span>
  );
}
