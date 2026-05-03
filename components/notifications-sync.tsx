"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { scheduleAll, checkPermission } from "@/lib/notifications";
import { getExamMeta } from "@/lib/data/exams";

/**
 * NotificationsSync — invisible global effect that keeps native local
 * notifications in sync with the user's current state.
 *
 * Runs whenever any of these change:
 *   - notificationPrefs.enabled / dailyReminderTime
 *   - profile.examId / profile.examDate (countdown milestones)
 *   - profile.streakDays / profile.lastActiveDate (streak-at-risk hook)
 *
 * Why this lives in app/layout.tsx (not in Zustand setters):
 *   - Zustand setters should stay synchronous + side-effect-free
 *   - Settings page's NotificationsSection already calls scheduleAll
 *     on toggle/time-change, but a drill-completion path doesn't —
 *     this fills the gap so finishing a drill at 6 PM correctly pushes
 *     the daily reminder to TOMORROW (instead of pinging at 7 PM after
 *     the user already drilled)
 *
 * Silent on web — scheduleAll() no-ops if @capacitor/local-notifications
 * isn't available.
 */
export function NotificationsSync() {
  const profile = useApp((s) => s.profile);
  const notificationPrefs = useApp((s) => s.notificationPrefs);
  const lastSync = useRef<string>("");

  useEffect(() => {
    if (!profile) return;
    if (!notificationPrefs.enabled) return;

    // Cheap dedupe — re-scheduling on every render would burn the
    // native scheduler. Build a fingerprint of the inputs that matter.
    const today = new Date().toISOString().slice(0, 10);
    const lastActive = profile.lastActiveDate?.slice(0, 10) ?? "";
    const fingerprint = [
      notificationPrefs.dailyReminderTime,
      profile.examId,
      profile.examDate,
      profile.streakDays ?? 0,
      lastActive,
      today, // include today so a date-rollover triggers re-schedule
    ].join("|");
    if (fingerprint === lastSync.current) return;
    lastSync.current = fingerprint;

    // Verify permission before bothering the OS — if user denied or
    // never granted, scheduleAll would silent-fail anyway, but this
    // also avoids touching the plugin when web build doesn't have it.
    (async () => {
      const perm = await checkPermission();
      if (perm !== "granted") return;

      const examMeta = getExamMeta(profile.examId);
      const drilledToday = lastActive === today;

      await scheduleAll({
        prefs: notificationPrefs,
        examName: examMeta.name,
        examDateISO: profile.examDate,
        streakDays: profile.streakDays ?? 0,
        drilledToday,
      });
    })();
  }, [
    profile,
    notificationPrefs,
  ]);

  return null;
}
