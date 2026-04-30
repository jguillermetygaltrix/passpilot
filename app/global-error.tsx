"use client";

/**
 * Global error boundary — catches errors in the root layout itself.
 *
 * Next.js 14 has TWO error boundaries:
 *   - app/error.tsx           → catches errors in routes (nested under layout)
 *   - app/global-error.tsx    → catches errors when the layout itself crashes
 *
 * `error.tsx` covers ~95% of cases. `global-error.tsx` is the last line of
 * defense for catastrophic root-layout failures — without it, a broken
 * layout would render Next.js's default ugly error page (or worse, a blank
 * screen with no recovery action).
 *
 * Important: this component MUST render its own <html> + <body> because
 * the layout that normally provides them is what crashed.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[PassPilot] global error (layout-level):", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#0B0D13",
          color: "#e8eaef",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            padding: "2rem",
            borderRadius: "1rem",
            background: "#13161e",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "0.75rem",
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: "0 0 0.5rem",
            }}
          >
            PassPilot crashed loading this page
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(232,234,239,0.7)",
              margin: "0 0 1.5rem",
              lineHeight: 1.55,
            }}
          >
            Your saved progress is safe — it lives on this device. Tap below to
            reload, or visit{" "}
            <a
              href="https://passpilot.app"
              style={{ color: "#7aa2ff", textDecoration: "underline" }}
            >
              passpilot.app
            </a>
            .
          </p>
          {error.digest ? (
            <p
              style={{
                fontSize: "0.6875rem",
                color: "rgba(232,234,239,0.45)",
                fontFamily: "ui-monospace, monospace",
                margin: "0 0 1.25rem",
              }}
            >
              ref: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#3D6EFF",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
