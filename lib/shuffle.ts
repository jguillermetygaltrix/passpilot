/**
 * Choice shuffle — fixes a critical bias in the question pool (DEC-053).
 *
 * Audit at 2026-05-04 found correctIndex distribution across all 228
 * questions was 6.6% A · 58.8% B · 31.6% C · 3.1% D. A real cert exam
 * distributes ~25% per option. Without shuffling, users could pass our
 * diagnostic by spamming "B" — the readiness score was mathematically
 * lying.
 *
 * Strategy: don't rewrite the source data. Instead, shuffle each
 * question's choices array at drill-mount time using a deterministic
 * per-question seed derived from a session-random base. Same content,
 * shuffled presentation, ~25% distribution naturally.
 *
 * Determinism within a drill matters because questions can re-render
 * (state updates, react strict mode double-renders, etc.) — without a
 * stable seed the choices would jump around mid-question and break
 * the user's selection.
 */

import type { Question } from "./types";

/**
 * Deterministic 32-bit hash of a string. FNV-1a variant — fast, no deps,
 * good distribution for small inputs like `${questionId}-${sessionSeed}`.
 */
function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG seeded from the hash. Returns 0..1.
 */
function rng(seed: number): () => number {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle of [0..n-1] using the supplied PRNG. Returns the
 * permutation array — i.e., `permutation[newIndex] = oldIndex`.
 */
function permutation(n: number, rand: () => number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns a NEW Question with `choices` shuffled and `correctIndex`
 * remapped to track the correct answer's new position. The original
 * question object is not mutated.
 *
 * `seed` should be stable for the lifetime of one drill — e.g.,
 * `${question.id}-${drillSeed}` where `drillSeed` is set once at
 * QuestionRunner mount.
 */
export function shuffleQuestionChoices(q: Question, seed: string): Question {
  const perm = permutation(q.choices.length, rng(hash32(seed)));
  const newChoices = perm.map((oldIdx) => q.choices[oldIdx]);
  const newCorrectIndex = perm.indexOf(q.correctIndex);
  return {
    ...q,
    choices: newChoices,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Convenience: shuffle every question in an array. The drillSeed should
 * be a string unique per drill instance; questions inside the same drill
 * are deterministic relative to it.
 *
 * Generate `drillSeed` once at drill mount (e.g., via `newDrillSeed()`)
 * and pass it through, so re-renders don't re-shuffle.
 */
export function shuffleQuestions(
  questions: Question[],
  drillSeed: string
): Question[] {
  return questions.map((q) =>
    shuffleQuestionChoices(q, `${q.id}-${drillSeed}`)
  );
}

/**
 * Generate a fresh per-drill seed. Combines high-resolution time with
 * a small random component so two drills started in the same millisecond
 * still differ. Stable as a string for hashing.
 */
export function newDrillSeed(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
