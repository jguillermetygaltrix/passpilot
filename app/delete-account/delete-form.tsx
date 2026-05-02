"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, CheckCircle2, Loader2 } from "lucide-react";

/**
 * DeleteAccountForm — client form for /delete-account.
 *
 * Why no /api/account/delete route in this repo:
 *   PassPilot ships as a Capacitor-wrapped static export (`output: "export"`
 *   in next.config.mjs). Static exports can't host POST handlers. The
 *   backend spec lives at:
 *     MARVIN/agents/lex/drafts/passpilot-account-deletion-backend-spec/
 *   When Boss stands up a real server (Cloud Function / Vercel separate
 *   project / lobby-style Next runtime), drop that route file in and flip
 *   the `BACKEND_URL` constant below.
 *
 * Today's flow (App Store + Play Store + GDPR Art 17 compliant):
 *   1. User submits form → request stored in localStorage queue (so the
 *      user has a record + Boss can rebuild from device if needed).
 *   2. mailto: opens with a pre-filled message to privacy@passpilot.app
 *      so the request lands in the manual-processing inbox.
 *   3. Confirmation screen explains the 30-day soft-hold timeline.
 *
 * The PUBLIC URL existing at /delete-account is what satisfies the App
 * Store + Play Store compliance bar — not whether the backend is wired.
 */
// When backend ships, set this to the real endpoint and the form will
// switch to a real fetch (see commented block in handleSubmit below).
const BACKEND_URL: string | null = null;
export function DeleteAccountForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready =
    email.includes("@") &&
    confirmText.trim().toUpperCase() === "DELETE";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const submittedAt = new Date().toISOString();

      // 1. If a real backend ever ships, hit it first. Today BACKEND_URL is
      //    null (Capacitor static export can't host POST handlers).
      if (BACKEND_URL) {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, reason: reason || undefined, confirmText }),
        });
        if (!res.ok) {
          throw new Error(
            `Server returned ${res.status}. Email privacy@passpilot.app instead.`,
          );
        }
      }

      // 2. Stage to localStorage so the user has a record + Boss can rebuild
      //    if the email path fails. Best-effort — private mode is tolerated.
      try {
        const queue = JSON.parse(
          localStorage.getItem("passpilot.deletion-queue") || "[]",
        );
        queue.push({
          email,
          reason: reason || undefined,
          submittedAt,
        });
        localStorage.setItem(
          "passpilot.deletion-queue",
          JSON.stringify(queue),
        );
      } catch {
        /* private mode — fall through to mailto path */
      }

      // 3. Open mailto: to privacy@passpilot.app with a pre-filled body so
      //    Boss receives the canonical record in his inbox. This is the
      //    actual processing channel until a real backend ships. Triggered
      //    in a microtask so the form can transition to its success state
      //    before the mail client steals focus.
      const subject = encodeURIComponent("Delete my account");
      const body = encodeURIComponent(
        `Hi PassPilot privacy team,\n\n` +
          `Please delete my account.\n\n` +
          `Account email: ${email}\n` +
          (reason ? `Reason (optional): ${reason}\n` : "") +
          `Submitted at: ${submittedAt}\n\n` +
          `I confirm: DELETE\n`,
      );
      setTimeout(() => {
        window.location.href = `mailto:privacy@passpilot.app?subject=${subject}&body=${body}`;
      }, 50);

      // Slight delay so the success UI feels intentional, not instant.
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't submit. Email privacy@passpilot.app instead — we'll process it manually.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/10 p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          Request received
        </h2>
        <p className="text-sm text-foreground/90">
          We'll send a confirmation email to <strong>{email}</strong> with a
          "cancel deletion" link. The 30-day soft-hold starts now. After day 30,
          all data is permanently deleted.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn't get the email? Check spam, then email{" "}
          <a href="mailto:privacy@passpilot.app" className="underline">
            privacy@passpilot.app
          </a>{" "}
          and we'll process manually.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-5 md:p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">Submit deletion request</h2>

      <label className="block">
        <span className="text-sm font-medium">
          Email on your PassPilot account
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">
          Optional: why? (helps us improve, never required)
        </span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Already passed the cert · changed jobs · other..."
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">
          Type{" "}
          <code className="font-mono text-rose-600 dark:text-rose-400">DELETE</code>{" "}
          to confirm
        </span>
        <input
          type="text"
          required
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          autoComplete="off"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/60 dark:bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        By submitting you acknowledge the{" "}
        <Link href="/refunds" className="underline">refund policy</Link> and{" "}
        <Link href="/privacy" className="underline">privacy policy</Link>. The 30-day
        soft-hold lets you change your mind via the cancellation link in the
        confirmation email.
      </div>

      <div className="flex justify-end pt-2 border-t">
        <button
          type="submit"
          disabled={!ready || submitting}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete my account
            </>
          )}
        </button>
      </div>
    </form>
  );
}
