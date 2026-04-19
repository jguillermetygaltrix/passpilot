"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Dumbbell,
  LayoutDashboard,
  LifeBuoy,
  BookOpen,
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/plan", label: "Plan", icon: Calendar },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/weakness", label: "Weak", icon: AlertTriangle },
  { href: "/guide", label: "Guide", icon: BookOpen },
];

export function AppNav() {
  const pathname = usePathname();
  const { profile } = useApp();

  const daysLeft = profile?.examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(profile.examDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:block sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="container flex items-center h-16 gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <Logo />
            <span className="font-semibold text-[15px] tracking-tight">
              PassPilot
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {items.map((it) => {
              const active = pathname?.startsWith(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 h-9 rounded-full text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {daysLeft !== null && (
              <Link
                href="/rescue"
                className={cn(
                  "chip border bg-white text-foreground",
                  daysLeft <= 7
                    ? "border-rose-200 text-rose-700 bg-rose-50"
                    : "border-border"
                )}
              >
                <LifeBuoy className="h-3.5 w-3.5" />
                {daysLeft === 0 ? "Exam today" : `${daysLeft} days left`}
              </Link>
            )}
            <Link
              href="/settings"
              className="h-9 w-9 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {items.map((it) => {
            const active = pathname?.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium",
                  active
                    ? "text-brand-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-pop",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21l6-6" />
        <path d="M21 3L9 15l-3-3L21 3z" />
        <path d="M17 7l-4 4" />
      </svg>
    </div>
  );
}
