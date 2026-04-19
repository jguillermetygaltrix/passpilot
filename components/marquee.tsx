import { cn } from "@/lib/utils";

export function Marquee({
  children,
  speed = 40,
  direction = "left",
  className,
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        pauseOnHover && "group",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div
        className={cn(
          "flex gap-8 whitespace-nowrap will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <div className="flex gap-8 shrink-0">{children}</div>
        <div className="flex gap-8 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
