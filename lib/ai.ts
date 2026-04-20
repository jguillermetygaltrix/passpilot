/**
 * AI helpers — Gemini Flash (free tier, 1500 req/day)
 *
 * Uses direct fetch (no SDK dependency) so we stay under our static-export
 * bundle budget and zero new deps.
 *
 * API key should be set in env as NEXT_PUBLIC_GEMINI_API_KEY at build time.
 * We expose the key to the client since:
 *   a) Gemini Flash has generous free tier (1500/day)
 *   b) Our abuse risk is low (no user accounts to hijack)
 *   c) Server routing would break the static export model
 *
 * For production, rotate the key periodically and monitor usage.
 */

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_API =
  "https://generativelanguage.googleapis.com/v1beta/models";

function getApiKey(): string | null {
  // Exposed at build time; safe to ship in client bundle for free-tier usage
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? null;
}

export function isAIAvailable(): boolean {
  return !!getApiKey();
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: { message?: string };
}

export interface AIExplainInput {
  examName: string;
  topicName: string;
  question: string;
  choices: string[];
  correctIndex: number;
  userSelectedIndex: number;
  officialExplanation: string;
}

/**
 * Explain why the user's answer was wrong, in plain language,
 * tailored to the exam context. Falls back to the official
 * explanation if AI is unavailable.
 */
export async function explainWrongAnswer(
  input: AIExplainInput
): Promise<string> {
  const key = getApiKey();
  if (!key) return input.officialExplanation;

  const prompt = `You are a patient IT certification tutor helping someone study for the ${input.examName} exam.

They just got a question wrong on the topic: ${input.topicName}.

QUESTION:
${input.question}

CHOICES:
${input.choices.map((c, i) => `${String.fromCharCode(65 + i)}. ${c}${i === input.correctIndex ? "  ← correct" : ""}${i === input.userSelectedIndex ? "  ← they picked this" : ""}`).join("\n")}

OFFICIAL EXPLANATION:
${input.officialExplanation}

Write a 3-4 sentence personalized explanation that:
1. Acknowledges what they likely thought (why their choice seemed right)
2. Shows the key distinction they missed
3. Gives a concrete memory anchor so they won't miss it again

Plain English, no jargon without explaining it, no headings, no bullets. Just a short paragraph like you're a friend walking them through it.`;

  try {
    const res = await fetch(
      `${GEMINI_API}/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 300 },
        }),
      }
    );
    if (!res.ok) return input.officialExplanation;
    const data = (await res.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || input.officialExplanation;
  } catch {
    return input.officialExplanation;
  }
}

export interface AIConceptInput {
  examName: string;
  topicName: string;
  question: string;
}

/**
 * Ask PassPilot — open-ended concept clarification.
 * Pro-only feature (caller should gate).
 */
export async function askConceptQuestion(
  input: AIConceptInput
): Promise<string> {
  const key = getApiKey();
  if (!key)
    return "AI features aren't configured right now. Tap the lesson for this topic instead — it covers this concept in detail.";

  const prompt = `You are a patient IT certification tutor for the ${input.examName} exam. The student is on the topic: ${input.topicName}.

They asked: "${input.question}"

Answer in 4-6 sentences. Plain English. If the question is off-topic, politely redirect them. If it's exam-relevant, give a crisp answer that connects to how it's likely to appear on the exam. No headings, no bullet lists — just a tight paragraph.`;

  try {
    const res = await fetch(
      `${GEMINI_API}/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = (await res.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return (
      text ||
      "I couldn't generate an answer right now. Try the lesson for this topic in /guide."
    );
  } catch {
    return "I couldn't reach the AI service right now. Check your connection and try again.";
  }
}
