"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AnswerRecord,
  DailyDrillCount,
  License,
  QuizAttempt,
  StudyPlan,
  UserProfile,
} from "./types";
import { buildDailyPlan } from "./planner";
import { computePriority, computeTopicMastery, readinessScore } from "./scoring";
import { getTopicsForExam } from "./data/topics";
import { uid } from "./utils";
import { applyActivity, mergeStreakIntoProfile } from "./streak";
import type { NotificationPrefs } from "./notifications";
import { DEFAULT_PREFS as DEFAULT_NOTIFICATION_PREFS } from "./notifications";

interface AppState {
  hydrated: boolean;
  profile: UserProfile | null;
  attempts: QuizAttempt[];
  completedBlockIds: string[];
  completedLessonIds: string[];
  /**
   * Date stamp (YYYY-MM-DD) of the last plan generation. Paired with
   * `cachedPlan` to keep today's plan stable — without this, useDailyPlan
   * re-derived blocks on every render and the planner's "next un-completed
   * lesson" logic shifted block IDs out from under markBlockDone tracking
   * (DEC-052 follow-up: counter stayed at 0 even after completions).
   */
  lastPlanDate: string | null;
  /**
   * Today's plan, frozen at first generation. Cleared (set null) when
   * profile changes or resetAll() runs. Re-derived when lastPlanDate !== today.
   */
  cachedPlan: StudyPlan | null;
  license: License | null;
  dailyDrills: DailyDrillCount | null;
  notificationPrefs: NotificationPrefs;
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setNotificationPrefs: (prefs: NotificationPrefs) => void;
  recordAttempt: (
    kind: QuizAttempt["kind"],
    answers: AnswerRecord[],
    topicId?: string,
    mock?: QuizAttempt["mock"]
  ) => QuizAttempt;
  markBlockDone: (blockId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  /** Build today's plan if not cached (no-op if already cached for today). */
  ensurePlan: () => void;
  setLicense: (license: License | null) => void;
  incrementDrill: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = "passpilot.v1";

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: null,
      attempts: [],
      completedBlockIds: [],
      completedLessonIds: [],
      lastPlanDate: null,
      cachedPlan: null,
      license: null,
      dailyDrills: null,
      notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
      setProfile: (p) =>
        // Switching exam (or first-time profile set) invalidates today's
        // cached plan — different topic graph, different lessons.
        set({
          profile: p,
          lastPlanDate: null,
          cachedPlan: null,
        }),
      updateProfile: (patch) =>
        set((s) =>
          s.profile ? { profile: { ...s.profile, ...patch } } : s
        ),
      setNotificationPrefs: (prefs) => set({ notificationPrefs: prefs }),
      recordAttempt: (kind, answers, topicId, mock) => {
        const attempt: QuizAttempt = {
          id: uid("att"),
          kind,
          topicId,
          startedAt: new Date(
            Date.now() - answers.reduce((s, a) => s + a.timeMs, 0)
          ).toISOString(),
          completedAt: new Date().toISOString(),
          answers,
          scorePct: answers.length
            ? Math.round(
                (answers.filter((a) => a.correct).length / answers.length) *
                  100
              )
            : 0,
          mock,
        };
        set((s) => {
          const updatedProfile = s.profile
            ? mergeStreakIntoProfile(s.profile, applyActivity(s.profile))
            : s.profile;
          return {
            attempts: [...s.attempts, attempt],
            profile: updatedProfile,
          };
        });
        return attempt;
      },
      markBlockDone: (blockId) =>
        set((s) =>
          s.completedBlockIds.includes(blockId)
            ? s
            : { completedBlockIds: [...s.completedBlockIds, blockId] }
        ),
      markLessonComplete: (lessonId) =>
        set((s) => {
          if (s.completedLessonIds.includes(lessonId)) return s;
          const updatedProfile = s.profile
            ? mergeStreakIntoProfile(s.profile, applyActivity(s.profile))
            : s.profile;
          return {
            completedLessonIds: [...s.completedLessonIds, lessonId],
            profile: updatedProfile,
          };
        }),
      // DEC-052 follow-up — generate today's plan once, freeze it for the
      // day. Without this, useDailyPlan re-derived blocks on every render
      // and the planner's "next un-completed lesson" logic shifted block IDs
      // out from under markBlockDone tracking (Boss saw counter stuck at
      // 0/6 even after completing blocks). Idempotent — no-op if already
      // cached for today.
      ensurePlan: () => {
        const s = get();
        const today = new Date().toISOString().slice(0, 10);
        if (s.cachedPlan && s.lastPlanDate === today) return;
        if (!s.profile) return;
        const examTopics = getTopicsForExam(s.profile.examId);
        const baseMastery = computeTopicMastery(s.attempts, examTopics);
        const mastery = computePriority(
          baseMastery,
          daysLeft(s.profile.examDate),
          examTopics
        );
        const plan = buildDailyPlan(
          s.profile,
          mastery,
          s.attempts,
          s.completedLessonIds
        );
        set({ cachedPlan: plan, lastPlanDate: today });
      },
      setLicense: (license) => set({ license }),
      incrementDrill: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          const current =
            s.dailyDrills?.date === today ? s.dailyDrills.count : 0;
          return {
            dailyDrills: { date: today, count: current + 1 },
          };
        }),
      resetAll: () =>
        set({
          profile: null,
          attempts: [],
          completedBlockIds: [],
          completedLessonIds: [],
          lastPlanDate: null,
          cachedPlan: null,
          license: null,
          dailyDrills: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any)
      ),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export function useMasteryAndReadiness() {
  const { profile, attempts } = useApp();
  if (!profile) return null;
  const examTopics = getTopicsForExam(profile.examId);
  const examAttempts = attempts.filter((a) =>
    a.answers.every(
      (ans) => examTopics.some((t) => t.id === ans.topicId) || true
    )
  );
  const baseMastery = computeTopicMastery(examAttempts, examTopics);
  const mastery = computePriority(
    baseMastery,
    daysLeft(profile.examDate),
    examTopics
  );
  const readiness = readinessScore(mastery, examAttempts, profile, examTopics);
  return { mastery, readiness };
}

export function useDailyPlan(): StudyPlan | null {
  // DEC-052 follow-up — read from cachedPlan instead of re-deriving on every
  // render. ensurePlan() builds + freezes today's plan on first access (and
  // again at date rollover). This stabilizes block IDs so completion
  // tracking via completedBlockIds works correctly across render cycles.
  const profile = useApp((s) => s.profile);
  const cachedPlan = useApp((s) => s.cachedPlan);
  const lastPlanDate = useApp((s) => s.lastPlanDate);
  const ensurePlan = useApp((s) => s.ensurePlan);

  const today = new Date().toISOString().slice(0, 10);

  // Trigger plan build if missing or stale (date rolled over).
  // useEffect runs after render so the first paint may show null briefly,
  // but the very next render after ensurePlan's set() will have it.
  useEffect(() => {
    if (!profile) return;
    if (cachedPlan && lastPlanDate === today) return;
    ensurePlan();
  }, [profile, cachedPlan, lastPlanDate, today, ensurePlan]);

  if (!profile) return null;
  if (lastPlanDate === today && cachedPlan) return cachedPlan;
  return null;
}

function daysLeft(iso: string): number {
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, diff);
}
