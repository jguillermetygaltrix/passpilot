import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: LucideIcon;
  tone?: "default" | "brand" | "emerald" | "amber" | "rose";
  className?: string;
}) {
  const toneBg =
    tone === "brand"
      ? "bg-brand-50 text-brand-700 border-brand-100"
      : tone === "emerald"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700 border-amber-100"
          : tone === "rose"
            ? "bg-rose-50 text-rose-700 border-rose-100"
            : "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <div
      className={cn(
        "card-surface p-5 hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 will-change-transform",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </div>
          <div className="text-2xl font-semibold mt-1.5 tabular-nums tracking-tight">
            {value}
          </div>
          {sub && (
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-full border flex items-center justify-center shrink-0",
              toneBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
