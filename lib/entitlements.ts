"use client";

import { useApp } from "./store";
import { getTopicLessons } from "./data/lessons";
import { getTopicsForExam } from "./data/topics";
import type { ExamId, LicenseTier } from "./types";

export const FREE_DAILY_DRILL_LIMIT = 3;

export interface Entitlements {
  tier: LicenseTier;
  hasPro: boolean;
  hasMulti: boolean;
  unlockedExams: ExamId[];
  canAccessExam: (examId: ExamId) => boolean;
  canAccessLesson: (lessonId: string) => boolean;
  canAccessAllLessons: boolean;
  canAccessRescue: boolean;
  canAccessMistakeSheet: boolean;
  canAccessCramAndKeyFacts: boolean;
  canSwitchExams: boolean;
  drillsLeftToday: number;
  canStartDrill: boolean;
  drillLimitReached: boolean;
}

export function useEntitlements(): Entitlements {
  const { license, dailyDrills, profile } = useApp();
  const today = new Date().toISOString().slice(0, 10);

  const tier: LicenseTier = license?.tier ?? "free";
  const hasPro = tier === "pro" || tier === "multi";
  const hasMulti = tier === "multi";
  const unlockedExams = license?.unlockedExams ?? [];

  const todayCount =
    dailyDrills?.date === today ? dailyDrills.count : 0;
  const drillsLeftToday = hasPro
    ? Infinity
    : Math.max(0, FREE_DAILY_DRILL_LIMIT - todayCount);
  const canStartDrill = hasPro || drillsLeftToday > 0;
  const drillLimitReached = !hasPro && drillsLeftToday === 0;

  const canAccessExam = (examId: ExamId) => {
    if (hasMulti) return true;
    if (hasPro) return unlockedExams.includes(examId);
    // free tier: user's currently-selected exam only
    return profile?.examId === examId;
  };

  return {
    tier,
    hasPro,
    hasMulti,
    unlockedExams,
    canAccessExam,
    canAccessLesson: (lessonId: string) => {
      if (hasPro && profile && canAccessExam(profile.examId)) return true;
      // free tier: the first lesson of each topic within their active exam
      if (!profile) return false;
      const topics = getTopicsForExam(profile.examId);
      return topics.some((t) => {
        const first = getTopicLessons(t.id)[0];
        return first?.id === lessonId;
      });
    },
    canAccessAllLessons: hasPro,
    canAccessRescue: hasPro,
    canAccessMistakeSheet: hasPro,
    canAccessCramAndKeyFacts: hasPro,
    canSwitchExams: hasMulti,
    drillsLeftToday,
    canStartDrill,
    drillLimitReached,
  };
}
