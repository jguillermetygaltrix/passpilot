export type ExamId = "az-900" | "aws-ccp" | "ms-900" | "ai-900" | "sec-plus" | "aws-aip" | "gcp-cdl";

export type LicenseTier = "free" | "pro" | "multi";

export interface License {
  key: string;
  tier: Exclude<LicenseTier, "free">;
  unlockedExams: ExamId[];
  verifiedAt: string;
  email?: string;
}

export interface DailyDrillCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export type ConfidenceLevel = "new" | "some" | "solid" | "confident";

export type RiskLevel = "high" | "borderline" | "safer" | "strong";

export interface Exam {
  id: ExamId;
  name: string;
  vendor: string;
  fullTitle: string;
  passScore: number;
  totalDomains: number;
  description: string;
  domains: Topic[];
}

export interface Topic {
  id: string;
  examId: ExamId;
  name: string;
  shortName: string;
  weight: number;
  summary: string;
  keyFacts: string[];
  cramSheet: string[];
  subtopics: string[];
  review: TopicReview;
}

export interface TopicReview {
  examWeight: string;
  overview: string;
  sections: ReviewSection[];
  gotchas: Gotcha[];
  examTips: string[];
}

export interface ReviewSection {
  heading: string;
  body?: string;
  bullets?: string[];
  table?: ReviewTable;
}

export interface ReviewTable {
  columns: string[];
  rows: ReviewTableRow[];
}

export interface ReviewTableRow {
  label: string;
  cells: string[];
}

export interface Gotcha {
  confusion: string;
  explanation: string;
}

export type LessonCardKind =
  | "intro"
  | "concept"
  | "comparison"
  | "example"
  | "tip"
  | "recap";

export interface LessonCard {
  kind: LessonCardKind;
  title: string;
  body?: string;
  bullets?: string[];
  table?: ReviewTable;
  highlight?: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  cards: LessonCard[];
}

export interface Question {
  id: string;
  examId: ExamId;
  topicId: string;
  subtopic?: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export type WhyKind =
  | "career-switch"      // breaking into tech / cloud
  | "job-mandate"        // employer requires it for promotion / role / contract
  | "curiosity"          // self-driven exploration
  | "school-credit";     // college / certificate program credit

export interface UserProfile {
  examId: ExamId;
  examDate: string;
  confidence: ConfidenceLevel;
  hoursPerDay: number;
  targetOutcome: "pass" | "pass-comfortably" | "top-10";
  /** Why are you here — drives plan tone + dashboard greetings + email cadence. Optional for back-compat. */
  why?: WhyKind;
  startedAt: string;
  streakDays: number;
  lastActiveDate: string;
  /** Banked streak shields (Duolingo-style). Earn one per 7-day streak milestone, cap 3. Optional for back-compat. */
  streakShields?: number;
  /** Bookkeeping: which streak lengths have already granted a shield. Prevents double-granting. */
  shieldsEarnedAtStreaks?: number[];
}

export interface QuizAttempt {
  id: string;
  kind: "diagnostic" | "topic" | "mixed" | "incorrect-only" | "rescue" | "mock" | "sr-review";
  topicId?: string;
  startedAt: string;
  completedAt: string;
  answers: AnswerRecord[];
  scorePct: number;
  // Mock-exam-only metadata (undefined for other kinds)
  mock?: {
    examId: ExamId;
    durationSec: number;          // total time allowed
    elapsedSec: number;           // actual time used
    questionCount: number;
    passScore: number;            // % needed (from EXAMS catalog)
    passed: boolean;
    flaggedQuestionIds: string[]; // questions user flagged for review
    autoSubmittedOnTimeout: boolean;
  };
}

export interface AnswerRecord {
  questionId: string;
  topicId: string;
  selectedIndex: number;
  correct: boolean;
  timeMs: number;
}

export interface TopicMastery {
  topicId: string;
  attempts: number;
  correct: number;
  accuracy: number;
  mistakes: number;
  lastSeen: string | null;
  priority: number;
}

export interface StudyPlanBlock {
  id: string;
  /**
   * "lesson" — guided micro-loop: read one lesson, then a 3-Q mini-quiz on
   *   that topic (DEC-052). Carries `lessonId` + `topicId`.
   * "study" — legacy generic "go read this topic" block. Still emitted as a
   *   fallback when a topic has no remaining un-completed lessons.
   * "practice" / "review" / "cram" / "rest" — existing block kinds.
   */
  kind: "lesson" | "study" | "practice" | "review" | "cram" | "rest";
  topicId?: string;
  /** Only set for kind === "lesson". Identifies the lesson to read inside the block flow. */
  lessonId?: string;
  title: string;
  description: string;
  minutes: number;
  done: boolean;
}

export interface StudyPlan {
  date: string;
  totalMinutes: number;
  blocks: StudyPlanBlock[];
  mission: string;
  aiInsight: string;
}

export interface ReadinessSnapshot {
  score: number;
  risk: RiskLevel;
  asOf: string;
  daysLeft: number;
  breakdown: {
    topicId: string;
    score: number;
    weight: number;
  }[];
  trend: { date: string; score: number }[];
}
