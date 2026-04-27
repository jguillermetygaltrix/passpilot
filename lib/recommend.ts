/**
 * Multi-cert recommender — surfaces the best NEXT cert based on the one
 * the user just engaged with.
 *
 * Why: every cert candidate eventually wonders "what's next?" The honest
 * answer is usually "the cert from the same vendor that builds on this
 * foundation" — but most users don't know that. This module hand-curates
 * those adjacencies + ships a cross-sell to the Multi-Cert tier.
 *
 * Adjacency table is hand-curated based on real exam-prep wisdom:
 *   - Same vendor stack: AZ-900 → AI-900 / MS-900 → AZ-900 / AWS CCP → AWS AIP
 *   - Cross-cloud AI story: AI-900 → AWS AIP (the "AI on every cloud" pair)
 *   - Multi-cloud trio: any cloud cert → GCP CDL completes the set
 *   - Security crossover: Sec+ → AZ-900 (security pros need cloud literacy)
 *
 * Days-to-pass estimate is derived from a baseline of 14 days for
 * fundamentals-level certs, adjusted by the diagnostic score the user
 * just earned (higher diagnostic = less time needed).
 */

import type { ExamId } from "./types";
import { EXAMS, getExamMeta } from "./data/exams";

export interface Recommendation {
  /** Cert to study next. */
  examId: ExamId;
  /** Marketing-quality rationale (shown on the results card). */
  rationale: string;
  /** Estimated days to pass given the user's current readiness. */
  estimatedDays: number;
  /** Confidence score 0-1; higher = stronger recommendation. */
  confidence: number;
}

/**
 * Adjacency table — for cert X, here are the curated next-best certs
 * along with the rationale text. Tuples are [targetExamId, rationale, baseConfidence].
 *
 * Order matters: first entry is the strongest pick.
 */
const ADJACENCIES: Record<ExamId, [ExamId, string, number][]> = {
  "az-900": [
    ["ai-900", "Same vendor stack — AI-900 reuses 60%+ of your Azure mental model. Fastest second cert in the catalog.", 0.95],
    ["ms-900", "Microsoft fundamentals trio. MS-900 covers Microsoft 365 instead of Azure infra — broadens your IT story.", 0.85],
    ["aws-ccp", "Cross-cloud literacy. Concepts mostly transfer; vocabulary's the only real cost.", 0.75],
  ],
  "ai-900": [
    ["aws-aip", "Cross-cloud AI story. AWS AIP = AI fundamentals on AWS — together with AI-900 you can talk AI on either cloud.", 0.95],
    ["az-900", "Azure foundation under your AI. Most AI-900 holders end up needing AZ-900 anyway for the infrastructure layer.", 0.85],
    ["gcp-cdl", "Complete the multi-cloud trio. GCP's AI/ML story (Vertex AI) is on every diagnostic now.", 0.70],
  ],
  "ms-900": [
    ["az-900", "Microsoft pair. AZ-900 is the natural progression — fundamentals → infra fundamentals.", 0.95],
    ["sec-plus", "Microsoft 365 admins increasingly need security baseline. Sec+ is the one that actually clears DoD/HR filters.", 0.75],
    ["ai-900", "Microsoft AI literacy. Pairs perfectly with M365 if your role is admin-side.", 0.70],
  ],
  "aws-ccp": [
    ["aws-aip", "AWS pair. AI Practitioner is the brand-new entry in the AWS catalog; same exam style, same vendor.", 0.95],
    ["az-900", "Cross-cloud literacy. Concepts mostly transfer — vocabulary's the only real cost.", 0.80],
    ["gcp-cdl", "Multi-cloud trio. AWS + Azure + GCP at the fundamentals level is a real differentiator on resumes.", 0.70],
  ],
  "aws-aip": [
    ["aws-ccp", "AWS foundation under your AI. Most AIF-C01 holders end up wanting CLF-C02 anyway for the infra layer.", 0.90],
    ["ai-900", "Multi-cloud AI story. AI-900 covers Azure AI — together you cover the two biggest AI platforms.", 0.90],
    ["sec-plus", "AI deployment touches security increasingly. Sec+ + AWS AIP is a hot combo for ML platform roles.", 0.65],
  ],
  "sec-plus": [
    ["az-900", "Security + cloud. Most SOC analyst roles now require cloud literacy. AZ-900 is the fastest path.", 0.85],
    ["aws-ccp", "Security on AWS. Same logic as Azure but for AWS shops.", 0.80],
    ["gcp-cdl", "Less common combo, but GCP's BeyondCorp / Zero Trust angle is the freshest security story in the catalog.", 0.65],
  ],
  "gcp-cdl": [
    ["aws-ccp", "Cross-cloud — AWS is the most common second cloud after Google. Concepts transfer.", 0.85],
    ["az-900", "Multi-cloud trio. Adding Azure completes the all-three-clouds story.", 0.85],
    ["ai-900", "GCP CDL touches Vertex AI; AI-900 is the natural deepen on AI specifically.", 0.70],
  ],
};

/**
 * Get the top N recommendations for a user who just engaged with `currentExamId`.
 *
 * `currentReadinessScore` (0-100) tunes the days-to-pass estimate. Users
 * with high readiness on the current cert tend to land the next one faster.
 */
export function getRecommendations(
  currentExamId: ExamId,
  currentReadinessScore: number = 50,
  limit: number = 2
): Recommendation[] {
  const adj = ADJACENCIES[currentExamId] ?? [];
  return adj.slice(0, limit).map(([examId, rationale, confidence]) => ({
    examId,
    rationale,
    confidence,
    estimatedDays: estimateDays(examId, currentReadinessScore),
  }));
}

/**
 * Days-to-pass heuristic. Baseline 14 days for fundamentals; harder certs
 * (Sec+) take longer. Stronger current readiness = faster on the next cert
 * (max 30% reduction).
 */
function estimateDays(targetExamId: ExamId, currentReadinessScore: number): number {
  const meta = getExamMeta(targetExamId);
  // Sec+ has higher question count + steeper content
  const baseline = targetExamId === "sec-plus" ? 28 : 14;
  // Strong current diagnostic shaves up to 30% off
  const readinessFactor = Math.max(0.7, 1 - (currentReadinessScore - 50) / 100);
  return Math.max(7, Math.round(baseline * readinessFactor));
}

/**
 * Convenience: build the marketing copy for the cross-sell CTA.
 * Shown alongside the recommendations.
 */
export function getMultiCertSavingsCopy(): string {
  const total = EXAMS.length;
  return `Multi-Cert unlocks all ${total} certs for a single $99 lifetime. You're 1 cert in — at 2 you're already saving vs single-cert pricing.`;
}
