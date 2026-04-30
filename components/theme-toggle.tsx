"use client";

/**
 * Theme toggle — flips <html class="dark"> for Tailwind's class-based dark mode.
 *
 * Behavior:
 *   - On mount: reads user's saved preference (`passpilot.theme`) or falls
 *     back to the OS `prefers-color-scheme: dark` query. The no-flash <script>
 *     in layout.tsx already applied the right class before React hydrated;
 *     this component just syncs the React state to it.
 *   - On click: toggles between "light" and "dark", writes localStorage,
 *     dispatches a `passpilot:theme-change` CustomEvent so any other component
 *     can react (e.g. chart libs that don't auto-flip with CSS vars).
 *   - Renders a sun (light mode) / moon (dark mode) icon swap.
 *
 * Storage key matches the no-flash script in layout.tsx — keep them in sync.
 */

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "passpilot.theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  // Match what the no-flash script in layout.tsx already applied.
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode / quota — tolerate */
  }
  try {
    window.dispatchEvent(
      new CustomEvent("passpilot:theme-change", { detail: { theme } }),
    );
  } catch {
    /* */
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  // Listen for OS preference changes — only react if user hasn't explicitly chosen.
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const stored = (() => {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch {
          return null;
        }
      })();
      if (stored) return; // user has an explicit pref, don't override
      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  // Avoid SSR hydration flash — render a transparent placeholder until mounted.
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          "h-9 w-9 rounded-full border border-border bg-background opacity-0",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "h-9 w-9 rounded-full border border-border bg-card text-muted-foreground",
        "flex items-center justify-center transition-all duration-200",
        "hover:text-foreground hover:bg-muted hover:scale-105 active:scale-95",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
