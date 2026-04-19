import type { RiskLevel } from "@/lib/types";
import { riskLabel, riskBg } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, Target, Zap } from "lucide-react";

export function RiskBadge({
  risk,
  className,
}: {
  risk: RiskLevel;
  className?: string;
}) {
  const Icon =
    risk === "strong"
      ? ShieldCheck
      : risk === "safer"
        ? Target
        : risk === "borderline"
          ? Zap
          : AlertTriangle;

  return (
    <span
      className={cn(
        "chip border",
        riskBg(risk),
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {riskLabel(risk)}
    </span>
  );
}
