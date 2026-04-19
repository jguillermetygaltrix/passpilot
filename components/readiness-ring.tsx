"use client";

import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

interface Props {
  score: number;
  risk: RiskLevel;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ReadinessRing({
  score,
  risk,
  size = 160,
  strokeWidth = 12,
  className,
  label = "Readiness",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference;

  const colors =
    risk === "strong"
      ? { from: "#10b981", to: "#059669", glow: "rgba(16, 185, 129, 0.35)" }
      : risk === "safer"
        ? { from: "#5d85ff", to: "#1d31db", glow: "rgba(61, 96, 255, 0.35)" }
        : risk === "borderline"
          ? { from: "#fbbf24", to: "#d97706", glow: "rgba(251, 191, 36, 0.35)" }
          : { from: "#fb7185", to: "#be123c", glow: "rgba(225, 29, 72, 0.35)" };

  const gradId = `grad-${risk}`;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-2 rounded-full blur-2xl pointer-events-none opacity-60"
        style={{ background: colors.glow }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.to} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eef2f7"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-4xl font-semibold text-foreground tabular-nums">
          {score}
        </span>
        <span className="text-[11px] text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}
