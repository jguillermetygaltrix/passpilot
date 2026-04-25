export type ExamId = "az-900" | "aws-ccp" | "ms-900" | "ai-900";

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

export interface UserProfile {
  examId: ExamId;
  examDate: string;
  confidence: ConfidenceLevel;
  hoursPerDay: number;
  targetOutcome: "pass" | "pass-comfortably" | "top-10";
  startedAt: string;
  streakDays: number;
  lastActiveDate: string;
}

export interface QuizAttempt {
  id: string;
  kind: "diagnostic" | "topic" | "mixed" | "incorrect-only" | "rescue";
  topicId?: string;
  startedAt: string;
  completedAt: string;
  answers: AnswerRecord[];
  scorePct: number;
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
  kind: "study" | "practice" | "review" | "cram" | "rest";
  topicId?: string;
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
