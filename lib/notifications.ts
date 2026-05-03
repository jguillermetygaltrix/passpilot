/**
 * Local notifications wrapper — no-server study reminders that fire
 * on-device. Built around @capacitor/local-notifications which works
 * on iOS + Android natively, and silently no-ops on web.
 *
 * Reminder strategy (the heart of PassPilot retention):
 *
 *   1. Daily drill reminder
 *      Fires at user-chosen time (default 7 PM).
 *      Skipped if user already drilled today (lastActiveDate === today).
 *      Copy: "10 minutes for AZ-900 — your daily drill is ready."
 *
 *   2. Streak-at-risk alert
 *      Fires at 8:30 PM if user has an active streak >= 1 AND hasn't
 *      drilled today. One-shot per day, won't double-fire if already
 *      sent. Copy: "Your N-day streak ends tonight unless you drill."
 *
 *   3. Days-to-exam countdown
 *      Fires at 9 AM at T-7, T-3, T-1, and the morning OF the exam.
 *      Copy varies by milestone — calm at T-7, urgent at T-1.
 *
 *   4. Mock exam ready
 *      Fires when the cooldown clears (24h Pro / 7d Free) at 10 AM.
 *      Copy: "Your next mock exam is unlocked — 60 questions, 90 min."
 *
 * Permission flow:
 *   - First time the user enables notifications in Settings, we
 *     request permission via the OS sheet
 *   - If denied: we DON'T pester. Settings page shows "denied → enable
 *     in iOS Settings → PassPilot → Notifications"
 *   - If granted: we schedule the reminders immediately
 *
 * Notification IDs are deterministic per type so re-scheduling
 * cancels the previous occurrence (no duplicates piling up):
 *   1001 — daily drill
 *   1002 — streak-at-risk
 *   1010-1019 — days-to-exam (one slot per milestone)
 *   1020 — mock-ready
 */

const N_ID_DAILY = 1001;
const N_ID_STREAK = 1002;
const N_ID_EXAM_BASE = 1010; // +offset per milestone
const N_ID_MOCK = 1020;

export type NotificationPrefs = {
  enabled: boolean;
  dailyReminderTime: string; // "HH:MM" 24h, default "19:00"
};

export const DEFAULT_PREFS: NotificationPrefs = {
  enabled: false,
  dailyReminderTime: "19:00",
};

/** Request OS permission. Resolves to "granted" | "denied" | "default". */
export async function requestPermission(): Promise<
  "granted" | "denied" | "default"
> {
  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    const result = await LocalNotifications.requestPermissions();
    return result.display === "granted"
      ? "granted"
      : result.display === "denied"
        ? "denied"
        : "default";
  } catch {
    return "default";
  }
}

/** Check current permission status without prompting. */
export async function checkPermission(): Promise<
  "granted" | "denied" | "default"
> {
  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    const result = await LocalNotifications.checkPermissions();
    return result.display === "granted"
      ? "granted"
      : result.display === "denied"
        ? "denied"
        : "default";
  } catch {
    return "default";
  }
}

/** Cancel ALL PassPilot scheduled notifications (used on disable + before reschedule). */
export async function cancelAll(): Promise<void> {
  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map((n) => ({ id: n.id })),
      });
    }
  } catch {
    /* silent on web / pre-pod-install */
  }
}

/** Parse "HH:MM" string into a Date for the next occurrence. */
function nextOccurrence(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

/**
 * Schedule the full reminder pack for a given user state.
 * Caller invokes this whenever:
 *   - user enables notifications
 *   - user changes the reminder time
 *   - the profile.examDate changes (recompute T-7/T-3/T-1)
 *   - user completes a drill (push the daily reminder to TOMORROW so
 *     they don't get pinged at 7 PM after already drilling at 6 PM)
 */
export async function scheduleAll(args: {
  prefs: NotificationPrefs;
  examName: string;
  examDateISO: string; // YYYY-MM-DD
  streakDays: number;
  drilledToday: boolean;
}): Promise<void> {
  const { prefs, examName, examDateISO, streakDays, drilledToday } = args;

  if (!prefs.enabled) {
    await cancelAll();
    return;
  }

  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );

    // Recompute from a clean slate every time — simpler than diffing
    await cancelAll();

    const notifications: Array<{
      id: number;
      title: string;
      body: string;
      schedule: { at: Date; repeats?: boolean };
    }> = [];

    // 1) Daily drill reminder (repeats every day at user's chosen time)
    //    If the user already drilled today, push to tomorrow; otherwise
    //    use the next occurrence (today if still in the future).
    const dailyAt = drilledToday
      ? (() => {
          const t = nextOccurrence(prefs.dailyReminderTime);
          t.setDate(t.getDate() + 1);
          return t;
        })()
      : nextOccurrence(prefs.dailyReminderTime);
    notifications.push({
      id: N_ID_DAILY,
      title: `${examName}: 10 minutes`,
      body: "Your daily drill is ready. Keep the streak alive.",
      schedule: { at: dailyAt, repeats: true },
    });

    // 2) Streak-at-risk alert at 8:30 PM
    //    Only useful if user has an active streak. Repeats daily;
    //    if user drilled, the next-day reschedule on completion will
    //    cancel + reschedule properly.
    if (streakDays >= 1 && !drilledToday) {
      const streakAt = (() => {
        const t = nextOccurrence("20:30");
        return t;
      })();
      notifications.push({
        id: N_ID_STREAK,
        title: `Your ${streakDays}-day streak is at risk`,
        body: "5 minutes of practice tonight keeps it alive.",
        schedule: { at: streakAt, repeats: false },
      });
    }

    // 3) Days-to-exam countdown — T-7, T-3, T-1, T-0
    //    Only schedule milestones that are in the future.
    const examDate = new Date(examDateISO + "T09:00:00");
    const now = Date.now();
    const milestones: Array<{ daysOut: number; title: string; body: string }> =
      [
        {
          daysOut: 7,
          title: `${examName} in 7 days`,
          body: "You're entering the homestretch — here's what to focus on this week.",
        },
        {
          daysOut: 3,
          title: `${examName} in 3 days`,
          body: "Mock exam time. Lock in your weakest topics.",
        },
        {
          daysOut: 1,
          title: `${examName} TOMORROW`,
          body: "Rest, hydrate, and skim the cram sheet. You've got this.",
        },
        {
          daysOut: 0,
          title: `It's exam day — ${examName}`,
          body: "Take a breath. You prepared for this. Good luck.",
        },
      ];

    for (let i = 0; i < milestones.length; i++) {
      const { daysOut, title, body } = milestones[i];
      const at = new Date(examDate);
      at.setDate(at.getDate() - daysOut);
      if (at.getTime() > now) {
        notifications.push({
          id: N_ID_EXAM_BASE + i,
          title,
          body,
          schedule: { at, repeats: false },
        });
      }
    }

    // Schedule them all in one batch
    if (notifications.length > 0) {
      await LocalNotifications.schedule({
        notifications: notifications.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          schedule: n.schedule,
          smallIcon: "ic_stat_icon_config_sample", // android only
          autoCancel: true,
        })),
      });
    }
  } catch {
    /* silent on web / pre-pod-install */
  }
}

/**
 * Schedule a one-shot mock-ready notification at a specific time.
 * Called from the mock-exam completion handler with the cooldown end.
 */
export async function scheduleMockReady(
  cooldownEndsAt: number,
  examName: string
): Promise<void> {
  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    // Round to 10 AM the day the cooldown ends so user wakes up to it
    const at = new Date(cooldownEndsAt);
    at.setHours(10, 0, 0, 0);
    if (at.getTime() < cooldownEndsAt) at.setDate(at.getDate() + 1);

    await LocalNotifications.cancel({ notifications: [{ id: N_ID_MOCK }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: N_ID_MOCK,
          title: `Mock exam ready: ${examName}`,
          body: "60 questions · 90 minutes · full exam-day simulation.",
          schedule: { at },
          autoCancel: true,
        },
      ],
    });
  } catch {
    /* silent on web */
  }
}
