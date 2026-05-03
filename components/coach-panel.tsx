"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import {
  askCoach,
  isCoachAvailable,
  suggestedPrompts,
  type CoachContext,
  type CoachMessage,
} from "@/lib/ai-coach";
import { tap, success } from "@/lib/haptics";
import { cn } from "@/lib/utils";

/**
 * <CoachPanel /> — slide-up bottom sheet that opens an AI tutor chat
 * scoped to the current question. The user can ask follow-ups
 * ("explain again", "why is the other choice wrong", "give me an
 * analogy") and the coach replies grounded in the question + topic.
 *
 * Conversation is in-memory only — closes on `onClose`, history is
 * lost. Intentional: each question gets a fresh coach session, no
 * cross-talk pollution.
 *
 * UX:
 *   - Bottom-sheet style (fixed inset-x-0 bottom-0, slides up)
 *   - Tap suggested-prompt chips OR type a custom question
 *   - Coach replies appear with a subtle haptic success buzz
 *   - Loading skeleton while waiting
 *   - Backdrop tap or X button closes
 */
export function CoachPanel({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: CoachContext;
}) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when the panel re-opens for a different question
  useEffect(() => {
    if (open) {
      setMessages([]);
      setInput("");
      setError(null);
    }
  }, [open, context.question]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  if (!open || !isCoachAvailable()) return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    tap();
    const nextHistory = [
      ...messages,
      { role: "user" as const, text: trimmed },
    ];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const reply = await askCoach(context, messages, trimmed);
      success();
      setMessages([
        ...nextHistory,
        { role: "model" as const, text: reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.slice(0, 140)
          : "Coach hit a snag. Try again in a sec."
      );
    } finally {
      setBusy(false);
    }
  };

  const prompts = suggestedPrompts(context);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-ink-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-[81] bg-white dark:bg-card rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coach-title"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div className="pt-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center shadow-pop">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div id="coach-title" className="font-semibold text-sm">
                Ask the coach
              </div>
              <div className="text-xs text-muted-foreground">
                {context.topicName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages scroll area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0"
        >
          {messages.length === 0 && !busy && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground text-center">
                Tap a suggestion or ask anything about this question.
              </div>
              <div className="flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="text-xs font-medium px-3 py-2 rounded-full border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/25 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-slate-100 dark:bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-muted rounded-2xl rounded-bl-sm px-4 py-3 inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Coach is thinking…
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs p-3">
              {error}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the coach…"
            disabled={busy}
            className="flex-1 h-11 rounded-full border border-border bg-white dark:bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="h-11 w-11 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
