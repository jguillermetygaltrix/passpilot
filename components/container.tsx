import { cn } from "@/lib/utils";

/**
 * AppShell — the universal page-content wrapper used by every authenticated
 * route in PassPilot.
 *
 * DEC-057 (2026-05-05) — added `pt-[env(safe-area-inset-top)]` so iPhone
 * notch/Dynamic Island clearance is handled at the content level instead
 * of via body padding. The body used to pad-top + pad-bottom, which combined
 * with pages using `min-h-screen` made every page 84px taller than its
 * container → the whole app scrolled into empty space ("felt like a web
 * page" per Boss's TestFlight report).
 *
 * The `pb-24` (96px) is kept to clear the fixed bottom nav (which itself
 * adds `pb-[env(safe-area-inset-bottom)]` for the home indicator).
 */
export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "container pt-6 pb-24 md:pt-10 md:pb-12 max-w-5xl min-w-0",
        // iPhone notch / Dynamic Island clearance for content top.
        // Resolves to 0 on Android / web / desktop where no inset exists.
        "pt-[max(1.5rem,env(safe-area-inset-top))]",
        className
      )}
    >
      {children}
    </div>
  );
}

export { AppShell as Container };
