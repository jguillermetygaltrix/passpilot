/**
 * Plan-tone forks based on the user's `why` segment captured at onboarding.
 *
 * Why this exists: a career-switcher hears "your job is on the line" hits
 * different from "let's nail this for the school project". One nudge
 * lands as ambition, the other lands as anxiety. The tone fork makes the
 * daily messaging feel personally written for the user's situation.
 *
 * v1 ships with stub copy MARVIN wrote — Quill is drafting deeper variants
 * in her queue (segmentation copy P1) and will replace this module wholesale.
 */

import type { WhyKind, UserProfile } from "./types";

interface WhyTone {
  /** First-person identifier: shown alongside the dashboard greeting. */
  identity: string;
  /** Daily-plan opening line tone. */
  dailyOpener: string;
  /** Streak-broken language. */
  streakLost: string;
  /** Mock-failed encouragement. */
  mockMissed: string;
  /** Pre-exam reassurance language. */
  examWindow: string;
  /** Empty-state push when user hasn't drilled in 3+ days. */
  reEngage: string;
}

const TONES: Record<WhyKind, WhyTone> = {
  "career-switch": {
    identity: "future cloud engineer",
    dailyOpener:
      "This is a career-changing cert. Today's plan ladders straight to that.",
    streakLost:
      "Streak's gone — but the job offer doesn't care about streaks. It cares whether you pass. Get back on it.",
    mockMissed:
      "Pass mocks aren't pass exams. You're calibrating, not failing. Ship the next drill.",
    examWindow:
      "You're 7 days out. Hiring managers want this cert in your signature line — let's lock it in.",
    reEngage:
      "Three days off. Career pivot doesn't fund itself — even 20 minutes today moves you closer.",
  },
  "job-mandate": {
    identity: "promotion-track candidate",
    dailyOpener:
      "Your team's counting on this cert clearing. Today's plan keeps you on schedule.",
    streakLost:
      "Streak broke. Don't let it become a trend — your manager's watching the calendar too.",
    mockMissed:
      "Mock score below pass — better here than test day. Your boss wants you to pass once, not twice.",
    examWindow:
      "Exam window opens soon. The promotion / contract / role change is on the other side. Let's earn it.",
    reEngage:
      "Three days quiet. The deadline's still real — drop in for 15 min and we get you back on pace.",
  },
  curiosity: {
    identity: "self-directed learner",
    dailyOpener:
      "You're here because you want to be. Today's plan gives that curiosity a path.",
    streakLost:
      "Streak slipped — no boss yelling. Just you and the question of whether you actually wanted to know this. Pick it up when you're ready.",
    mockMissed:
      "Below pass — that's the answer to 'do I actually understand this?' Now we close the gap.",
    examWindow:
      "You picked the date. Let's ship it — you'll have the cert AND the actual knowledge.",
    reEngage:
      "Three days off. Curiosity's only worth what you do with it — let's keep going.",
  },
  "school-credit": {
    identity: "credit-stacker",
    dailyOpener:
      "Class deadline + cert in one. Today's plan balances both pressures.",
    streakLost:
      "Streak gone. The grade still ticks down. Five-minute session beats a zero today.",
    mockMissed:
      "Below pass — exactly when you'd want to know. The professor reads test scores, not effort. Drill back up.",
    examWindow:
      "Exam soon — the credit hours don't show up unless the cert does. Let's land it.",
    reEngage:
      "Three days dark. Syllabus hasn't moved. Step back in for one drill — momentum returns fast.",
  },
};

const DEFAULT_TONE = TONES["career-switch"];

export function getWhyTone(profile: UserProfile | null): WhyTone {
  if (!profile?.why) return DEFAULT_TONE;
  return TONES[profile.why] ?? DEFAULT_TONE;
}

export function getWhyLabel(why?: WhyKind): string {
  switch (why) {
    case "career-switch":
      return "Career switcher";
    case "job-mandate":
      return "Promotion track";
    case "curiosity":
      return "Self-directed";
    case "school-credit":
      return "School credit";
    default:
      return "";
  }
}
