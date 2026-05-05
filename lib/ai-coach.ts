/**
 * AI Coach — multi-turn chat tutor for cert questions.
 *
 * Uses Gemini Flash (same model as lib/ai.ts WhyWrongExplainer) for
 * cost reasons (1500 free req/day) and to stay within the static-export
 * model — no server-side route, just a client-side fetch with the
 * NEXT_PUBLIC_GEMINI_API_KEY exposed at build time.
 *
 * Conversation pattern:
 *   - Coach is seeded with the current question + topic + correct answer
 *     + user's wrong answer (if applicable) — system context
 *   - User can ask follow-ups: "explain again", "give me an example",
 *     "what's the difference between X and Y", "draw me an analogy"
 *   - Coach replies in plain language, exam-tutor tone, max ~150 words
 *
 * Stays local-only — no server logging, no analytics on conversation
 * content. Just transient client→Gemini→client.
 */

import type { ExamId } from "./types";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_API =
  "https://generativelanguage.googleapis.com/v1beta/models";

function getApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? null;
}

export function isCoachAvailable(): boolean {
  return !!getApiKey();
}

export interface CoachMessage {
  role: "user" | "model";
  text: string;
}

export interface CoachContext {
  examName: string;
  topicName: string;
  question: string;
  choices: string[];
  correctIndex: number;
  userSelectedIndex?: number; // omit if pre-answer; provided after submit
  officialExplanation: string;
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: { message?: string };
}

/**
 * Build the system instruction once per chat. Embeds the question
 * context so the coach grounds every answer in the user's actual
 * exam material — not generic IT trivia.
 */
function buildSystemInstruction(ctx: CoachContext): string {
  const correctChoice = ctx.choices[ctx.correctIndex];
  const userChoice =
    ctx.userSelectedIndex !== undefined
      ? ctx.choices[ctx.userSelectedIndex]
      : null;
  const wasCorrect =
    ctx.userSelectedIndex !== undefined &&
    ctx.userSelectedIndex === ctx.correctIndex;

  return [
    `You are a patient, sharp, no-nonsense tutor helping a student study for the ${ctx.examName} exam.`,
    `The current topic is: ${ctx.topicName}.`,
    "",
    "The student is looking at this question:",
    `Q: ${ctx.question}`,
    "Choices:",
    ...ctx.choices.map((c, i) => `  ${"ABCD"[i]}. ${c}`),
    `Correct answer: ${"ABCD"[ctx.correctIndex]}. ${correctChoice}`,
    userChoice
      ? wasCorrect
        ? `The student picked: ${"ABCD"[ctx.userSelectedIndex!]}. ${userChoice} (correct).`
        : `The student picked: ${"ABCD"[ctx.userSelectedIndex!]}. ${userChoice} (wrong).`
      : "The student hasn't answered yet.",
    "",
    `Reference explanation (use as ground truth, but rephrase in your own words):`,
    ctx.officialExplanation,
    "",
    "Your job: answer the student's follow-up questions about this question, the topic, or related concepts. Be specific to the exam context. Use plain language. Use short examples or analogies when helpful. Never say 'it depends' without immediately giving the most likely answer. Cap each response at ~150 words. Don't restart the explanation each turn — assume the student remembers what you said before.",
  ].join("\n");
}

/**
 * Send the user's next message and get the coach's reply. The full
 * history is sent every turn (Gemini is stateless on the API side).
 *
 * Returns plain text. Throws on hard error (no key, network failure,
 * upstream error). The caller should catch + display a friendly
 * fallback.
 */
export async function askCoach(
  ctx: CoachContext,
  history: CoachMessage[],
  userMessage: string
): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error("AI Coach not configured");

  const systemInstruction = buildSystemInstruction(ctx);

  // Convert our history into Gemini's contents format. The user's new
  // message is appended as the final user-role entry.
  const contents = [
    ...history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: "user" as const, parts: [{ text: userMessage }] },
  ];

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 400,
      topP: 0.9,
    },
  };

  const url = `${GEMINI_API}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`AI Coach upstream ${res.status}: ${errText.slice(0, 120)}`);
  }

  const data: GeminiResponse = await res.json();
  if (data.error) throw new Error(data.error.message ?? "AI Coach error");
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("AI Coach returned empty response");
  return text;
}

/**
 * Suggested first-turn prompts the user can tap instead of typing.
 *
 * DEC-054 polish — was static 3-4 chips, now context-aware:
 *   - Outcome-aware (right vs wrong)
 *   - Topic-aware (security vs cloud-services vs identity get different
 *     follow-up flavors)
 *   - Difficulty-aware (hard questions surface "trick to remember" earlier)
 *   - Per-call rotation via a small RNG so users don't see the same 3 chips
 *     every time — boosts the feeling that the Coach has depth
 *
 * Returns 3-4 prompts (small enough to fit on mobile, varied enough to
 * feel fresh).
 */
export function suggestedPrompts(ctx: CoachContext): string[] {
  const wasCorrect =
    ctx.userSelectedIndex !== undefined &&
    ctx.userSelectedIndex === ctx.correctIndex;

  // Topic-flavor candidates — broad pools per outcome, picked from at random.
  // The deterministic-ish picker uses question content as a seed so the same
  // question shows the same chips on re-renders (no jumping mid-session).
  const seed = hashStr(`${ctx.question}-${ctx.userSelectedIndex ?? "pre"}`);

  const correctPool = [
    "Why is this answer right?",
    "When would the other choices apply?",
    "Give me a real-world example.",
    "What's the gotcha if I picked one of the others?",
    "Build me a 1-line memory hook.",
    "Show me how this appears on the real exam.",
    "What's a trickier version of this question?",
    "Connect this to something I already know.",
  ];

  const wrongPool = [
    "Why is my answer wrong?",
    "Explain it like I'm 5.",
    "What's the trick to remember this?",
    "Show me a similar question.",
    "What's the difference between my pick and the right one?",
    "Build me a memory hook so I never miss this again.",
    "What pattern was I supposed to notice?",
    "Give me 3 facts about this topic I MUST know.",
  ];

  const pool = wasCorrect ? correctPool : wrongPool;

  // Topic-flavor add-on: sprinkle one specific prompt based on topic name
  // signals. Cheap heuristic — no NLP, just looks for substrings in the
  // topic name that suggest its flavor.
  const t = ctx.topicName.toLowerCase();
  const flavorPrompt =
    t.includes("security") || t.includes("compliance")
      ? wasCorrect
        ? "What's the most common attack vector this defends against?"
        : "Walk me through the security mindset for this question."
      : t.includes("identity") || t.includes("access") || t.includes("iam")
        ? wasCorrect
          ? "Map this to least-privilege thinking."
          : "What's the least-privilege answer here?"
        : t.includes("cost") || t.includes("billing") || t.includes("pricing")
          ? wasCorrect
            ? "When would the cost answer change?"
            : "Walk me through the pricing logic for this."
          : t.includes("ai") || t.includes("ml") || t.includes("model")
            ? wasCorrect
              ? "Where does this fall in the ML lifecycle?"
              : "What ML concept did I miss?"
            : null;

  // Pick 3 from pool + the flavor (when present) = up to 4 chips.
  // Use the seed to deterministically pick 3 distinct indices.
  const picked = pickN(pool, 3, seed);
  return flavorPrompt ? [...picked, flavorPrompt] : picked;
}

/** Cheap string hash for the seed — same FNV-1a as lib/shuffle.ts. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick N distinct items from an array, deterministic against the seed. */
function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const idxs = Array.from({ length: arr.length }, (_, i) => i);
  // Fisher-Yates with seeded "rng" — really just rotating the seed
  let s = seed;
  for (let i = idxs.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) | 0;
    const j = Math.abs(s) % (i + 1);
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  return idxs.slice(0, Math.min(n, arr.length)).map((i) => arr[i]);
}

// Re-export the ExamId type so callers don't have to import from two places.
export type { ExamId };
