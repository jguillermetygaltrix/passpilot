"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[PassPilot] route error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="card-surface max-w-md w-full p-8 text-center">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went sideways</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          PassPilot hit an unexpected error on this page. Your progress is safe — it lives on this device.
        </p>
        {error.digest && (
          <p className="text-[11px] text-muted-foreground/70 font-mono mb-6">ref: {error.digest}</p>
        )}
        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-border text-sm font-medium hover:bg-slate-50 dark:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
