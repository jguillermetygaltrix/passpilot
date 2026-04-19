"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AnswerRecord,
  QuizAttempt,
  StudyPlan,
  UserProfile,
} from "./types";
import { buildDailyPlan } from "./planner";
import { computePriority, computeTopicMastery, readinessScore } from "./scoring";
import { getTopicsForExam } from "./data/topics";
import { uid } from "./utils";

interface AppState {
  hydrated: boolean;
  profile: UserProfile | null;
  attempts: QuizAttempt[];
  completedBlockIds: string[];
  completedLessonIds: string[];
  lastPlanDate: string | null;
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  recordAttempt: (
    kind: QuizAttempt["kind"],
    answers: AnswerRecord[],
    topicId?: string
  ) => QuizAttempt;
  markBlockDone: (blockId: string) => void;
  markLessonComplete: (lessonId: string) => void;
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
      setProfile: (p) =>
        set({
          profile: p,
          lastPlanDate: null,
        }),
      updateProfile: (patch) =>
        set((s) =>
          s.profile ? { profile: { ...s.profile, ...patch } } : s
        ),
      recordAttempt: (kind, answers, topicId) => {
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
        };
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          const last = s.profile?.lastActiveDate?.slice(0, 10);
          let streak = s.profile?.streakDays ?? 0;
          if (last !== today) {
            const yesterday = new Date(Date.now() - 86400000)
              .toISOString()
              .slice(0, 10);
            streak = last === yesterday ? streak + 1 : 1;
          }
          return {
            attempts: [...s.attempts, attempt],
            profile: s.profile
              ? {
                  ...s.profile,
                  streakDays: streak,
                  lastActiveDate: new Date().toISOString(),
                }
              : s.profile,
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
          const today = new Date().toISOString().slice(0, 10);
          const last = s.profile?.lastActiveDate?.slice(0, 10);
          let streak = s.profile?.streakDays ?? 0;
          if (last !== today) {
            const yesterday = new Date(Date.now() - 86400000)
              .toISOString()
              .slice(0, 10);
            streak = last === yesterday ? streak + 1 : 1;
          }
          return {
            completedLessonIds: [...s.completedLessonIds, lessonId],
            profile: s.profile
              ? {
                  ...s.profile,
                  streakDays: streak,
                  lastActiveDate: new Date().toISOString(),
                }
              : s.profile,
          };
        }),
      resetAll: () =>
        set({
          profile: null,
          attempts: [],
          completedBlockIds: [],
          completedLessonIds: [],
          lastPlanDate: null,
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
  const { profile, attempts } = useApp();
  if (!profile) return null;
  const examTopics = getTopicsForExam(profile.examId);
  const baseMastery = computeTopicMastery(attempts, examTopics);
  const mastery = computePriority(
    baseMastery,
    daysLeft(profile.examDate),
    examTopics
  );
  return buildDailyPlan(profile, mastery, attempts);
}

function daysLeft(iso: string): number {
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, diff);
}
