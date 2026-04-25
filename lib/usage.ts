/**
 * PassPilot Usage Tracker
 *
 * Records user activity to defend against "buy → screenshot → refund" abuse.
 *
 * Events tracked:
 *   - diagnostic.completed
 *   - drill.started
 *   - drill.completed (with score + questions count)
 *   - question.viewed (distinct question IDs)
 *   - question.answered (distinct question IDs, correct/incorrect)
 *   - ai.explanation_requested (costs us $ — weighted heavier)
 *   - content.exported  (future: when user exports PDF, counts as consumption)
 *
 * Storage: localStorage as append-only event log + cached aggregates.
 *
 * Why client-side (for now):
 *   PassPilot is LS-first, no backend. Phase 2 will mirror events to a server
 *   via webhook so we have tamper-proof records. For now, the log is enough
 *   to have a paper trail the user themselves can export when filing a
 *   refund request ("here's my usage, refund me").
 *
 * Refund rules (enforced in UI + policy, checked manually on dispute):
 *   - 0% consumed      → full refund (obviously)
 *   - 1-25% consumed   → case-by-case
 *   - >25% consumed    → no refund
 *   - >10 AI calls     → no refund (AI is metered cost)
 *   - Content exported → no refund
 */

export type UsageEventType =
  | "diagnostic.completed"
  | "drill.started"
  | "drill.completed"
  | "question.viewed"
  | "question.answered"
  | "ai.explanation_requested"
  | "content.exported";

export interface UsageEvent {
  id: string;
  type: UsageEventType;
  timestamp: string;
  examId?: string;
  questionId?: string;
  meta?: Record<string, unknown>;
}

export interface UsageSummary {
  firstEventAt: string | null;
  lastEventAt: string | null;
  totalEvents: number;
  drillsStarted: number;
  drillsCompleted: number;
  questionsAnswered: number;        // distinct questions
  questionsAnsweredCorrectly: number;
  questionsViewed: number;          // distinct questions
  aiExplanationsRequested: number;
  exports: number;
  diagnosticsCompleted: number;
  studyMinutes: number;
  consumptionPct: number;           // primary refund metric (0-100)
  refundEligibility: "eligible" | "case-by-case" | "ineligible";
}

const STORAGE_KEY = "passpilot.usage-log";
const TOTAL_QUESTIONS_PER_EXAM = 400; // approximation; actual count loaded at runtime

// Event log — append-only in localStorage
export function logEvent(type: UsageEventType, meta: {
  examId?: string;
  questionId?: string;
  meta?: Record<string, unknown>;
} = {}): UsageEvent {
  const event: UsageEvent = {
    id: (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    timestamp: new Date().toISOString(),
    examId: meta.examId,
    questionId: meta.questionId,
    meta: meta.meta,
  };
  if (typeof window === "undefined") return event;
  try {
    const existing: UsageEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(event);
    // 🛡️  LEGION HARDENING (2026-04-24, HIGH):
    // Trim by AGE (90 days), not by count. Count-based trim (slice(-5000)) is
    // exploitable: an abuser logs 5000 fake `question.viewed` events in
    // localStorage to push real consumption events out of the array, then
    // claims "I never used the product, refund please." Age-based trim
    // preserves the chronological refund-eligibility evidence.
    // Also cap absolute size at 50k as a memory-safety belt-and-suspenders.
    const cutoffMs = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const trimmed = existing
      .filter((e) => {
        const t = new Date(e.timestamp).getTime();
        return !isNaN(t) && t >= cutoffMs;
      })
      .slice(-50000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
  return event;
}

export function getEvents(): UsageEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearEvents(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// Aggregate computation
export function computeSummary(totalQuestionsPerExam?: number): UsageSummary {
  const events = getEvents();
  const total = totalQuestionsPerExam ?? TOTAL_QUESTIONS_PER_EXAM;

  if (!events.length) {
    return {
      firstEventAt: null,
      lastEventAt: null,
      totalEvents: 0,
      drillsStarted: 0,
      drillsCompleted: 0,
      questionsAnswered: 0,
      questionsAnsweredCorrectly: 0,
      questionsViewed: 0,
      aiExplanationsRequested: 0,
      exports: 0,
      diagnosticsCompleted: 0,
      studyMinutes: 0,
      consumptionPct: 0,
      refundEligibility: "eligible",
    };
  }

  const viewedIds = new Set<string>();
  const answeredIds = new Set<string>();
  const correctIds = new Set<string>();
  let drillsStarted = 0;
  let drillsCompleted = 0;
  let aiExplanationsRequested = 0;
  let exports = 0;
  let diagnosticsCompleted = 0;
  let studyMinutesEstimate = 0;

  for (const e of events) {
    switch (e.type) {
      case "drill.started":            drillsStarted++; break;
      case "drill.completed":          drillsCompleted++;
                                       studyMinutesEstimate += Number((e.meta as { minutes?: number })?.minutes ?? 0);
                                       break;
      case "question.viewed":          if (e.questionId) viewedIds.add(e.questionId); break;
      case "question.answered":        if (e.questionId) {
                                         answeredIds.add(e.questionId);
                                         if ((e.meta as { correct?: boolean })?.correct) correctIds.add(e.questionId);
                                       }
                                       break;
      case "ai.explanation_requested": aiExplanationsRequested++; break;
      case "content.exported":         exports++; break;
      case "diagnostic.completed":     diagnosticsCompleted++; break;
    }
  }

  // Consumption: use MAX of viewed + answered (a screenshotter may view without answering)
  const viewedPct = (viewedIds.size / total) * 100;
  const answeredPct = (answeredIds.size / total) * 100;
  const consumptionPct = Math.min(100, Math.max(viewedPct, answeredPct));

  let refundEligibility: UsageSummary["refundEligibility"] = "eligible";
  if (consumptionPct === 0 && exports === 0 && aiExplanationsRequested === 0) {
    refundEligibility = "eligible";
  } else if (consumptionPct > 25 || aiExplanationsRequested > 10 || exports > 0) {
    refundEligibility = "ineligible";
  } else {
    refundEligibility = "case-by-case";
  }

  return {
    firstEventAt: events[0].timestamp,
    lastEventAt: events[events.length - 1].timestamp,
    totalEvents: events.length,
    drillsStarted,
    drillsCompleted,
    questionsAnswered: answeredIds.size,
    questionsAnsweredCorrectly: correctIds.size,
    questionsViewed: viewedIds.size,
    aiExplanationsRequested,
    exports,
    diagnosticsCompleted,
    studyMinutes: Math.round(studyMinutesEstimate),
    consumptionPct: Math.round(consumptionPct * 10) / 10,
    refundEligibility,
  };
}

// Export entire usage report as JSON (for user to send with refund request)
export function exportUsageReport(): string {
  const summary = computeSummary();
  const events = getEvents();
  const report = {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    summary,
    events,
  };
  return JSON.stringify(report, null, 2);
}

// Convenience tracker methods — used by components
export const track = {
  diagnosticCompleted: (examId?: string) =>
    logEvent("diagnostic.completed", { examId }),

  drillStarted: (examId?: string, kind?: string) =>
    logEvent("drill.started", { examId, meta: { kind } }),

  drillCompleted: (examId: string, opts: { questionCount: number; correctCount: number; minutes: number; kind: string }) =>
    logEvent("drill.completed", { examId, meta: opts }),

  questionViewed: (questionId: string, examId?: string) =>
    logEvent("question.viewed", { examId, questionId }),

  questionAnswered: (questionId: string, correct: boolean, examId?: string) =>
    logEvent("question.answered", { examId, questionId, meta: { correct } }),

  aiExplanationRequested: (questionId: string, examId?: string) =>
    logEvent("ai.explanation_requested", { examId, questionId }),

  contentExported: (kind: string) =>
    logEvent("content.exported", { meta: { kind } }),
};
