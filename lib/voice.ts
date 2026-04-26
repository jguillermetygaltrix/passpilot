/**
 * Voice / Commute Mode engine — Web Speech API wrapper.
 *
 * Two halves:
 *   1. TTS (SpeechSynthesis) — narrate lessons, questions, choices
 *   2. STT (SpeechRecognition) — capture spoken answers ("A", "B", "C", "D")
 *
 * Why: cert candidates study during commute / chores / walking. Reading +
 * tapping is impossible there. Voice mode is the wide-open category nobody
 * else owns — flashcard apps don't read aloud + can't capture spoken answers.
 *
 * Browser support:
 *   - SpeechSynthesis: all modern browsers + iOS Safari + Android WebView
 *   - SpeechRecognition: Chrome/Edge + Capacitor Android. iOS Safari has it
 *     prefixed but flaky — we feature-gate gracefully.
 *
 * Capacitor: works in WebView. For a deeper iOS native experience, we'd
 * swap to AVSpeechSynthesizer via a native plugin; SpeechSynthesis works
 * fine for v1.
 */

export type VoiceCapability = {
  ttsAvailable: boolean;
  sttAvailable: boolean;
  voices: SpeechSynthesisVoice[];
};

export function getCapability(): VoiceCapability {
  if (typeof window === "undefined") {
    return { ttsAvailable: false, sttAvailable: false, voices: [] };
  }
  const ttsAvailable = "speechSynthesis" in window;
  const sttAvailable =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const voices = ttsAvailable ? window.speechSynthesis.getVoices() : [];
  return { ttsAvailable, sttAvailable, voices };
}

/* ──────────────────────────────────────────────────────────
 * TTS
 * ────────────────────────────────────────────────────────── */

export interface SpeakOptions {
  rate?: number;     // 0.5 - 2.0 (default 1.0)
  pitch?: number;    // 0.0 - 2.0 (default 1.0)
  voice?: SpeechSynthesisVoice | string; // voice or name
  volume?: number;   // 0.0 - 1.0
  lang?: string;     // "en-US" default
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak a string. Resolves when speech ends (or rejects on error / cancel).
 * Cancels any in-flight speech first.
 */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.reject(new Error("TTS not available"));
  }
  return new Promise((resolve, reject) => {
    try {
      window.speechSynthesis.cancel(); // hard reset any prior queue
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate ?? 1.0;
      u.pitch = opts.pitch ?? 1.0;
      u.volume = opts.volume ?? 1.0;
      u.lang = opts.lang ?? "en-US";
      if (opts.voice) {
        if (typeof opts.voice === "string") {
          const found = window.speechSynthesis
            .getVoices()
            .find((v) => v.name === opts.voice);
          if (found) u.voice = found;
        } else {
          u.voice = opts.voice;
        }
      }
      u.onend = () => {
        if (activeUtterance === u) activeUtterance = null;
        resolve();
      };
      u.onerror = (e) => {
        if (activeUtterance === u) activeUtterance = null;
        // SpeechSynthesisErrorEvent.error is "canceled" when stop() is called;
        // surface as a soft resolve rather than a hard reject.
        if ((e as SpeechSynthesisErrorEvent).error === "canceled") {
          resolve();
        } else {
          reject(new Error((e as SpeechSynthesisErrorEvent).error || "tts error"));
        }
      };
      activeUtterance = u;
      window.speechSynthesis.speak(u);
    } catch (err) {
      reject(err as Error);
    }
  });
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window
    ? window.speechSynthesis.speaking
    : false;
}

export function pauseSpeaking(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) window.speechSynthesis.pause();
}

export function resumeSpeaking(): void {
  if (typeof window === "undefined") return;
  if ("speechSynthesis" in window) window.speechSynthesis.resume();
}

/* ──────────────────────────────────────────────────────────
 * STT — captures a single spoken letter (A/B/C/D)
 * ────────────────────────────────────────────────────────── */

export interface ListenOptions {
  lang?: string;
  timeoutMs?: number; // auto-cancel after this many ms (default 7000)
}

/**
 * Listen for a single short utterance and return the recognized text.
 * Designed for capturing letter-answers. Caller normalizes the result
 * (e.g. "alpha" / "ay" / "a" → 0).
 */
export function listenOnce(opts: ListenOptions = {}): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("STT not available"));
  }
  const Ctor =
    (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: any })
      .webkitSpeechRecognition;
  if (!Ctor) return Promise.reject(new Error("STT not available"));

  return new Promise((resolve, reject) => {
    const rec = new Ctor();
    rec.lang = opts.lang ?? "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.continuous = false;

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
        reject(new Error("timeout"));
      }
    }, opts.timeoutMs ?? 7000);

    rec.onresult = (e: any) => {
      if (resolved) return;
      const result = e.results?.[0];
      // Prefer the highest-confidence alternative
      const alt = result?.[0];
      if (alt?.transcript) {
        resolved = true;
        clearTimeout(timeout);
        resolve(String(alt.transcript).trim().toLowerCase());
      }
    };
    rec.onerror = (e: any) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      reject(new Error(e?.error || "stt error"));
    };
    rec.onend = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      reject(new Error("no-input"));
    };
    try {
      rec.start();
    } catch (err) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(err as Error);
      }
    }
  });
}

/**
 * Map a spoken transcript to a choice index (0..n-1) or -1 if unmatched.
 *
 * Handles common variations:
 *   - "a" / "ay" / "alpha" / "letter a" / "the answer is a" → 0
 *   - same for B/C/D/E
 *   - "first" / "one" / "1" → 0
 *   - "second" / "two" / "2" → 1
 *   - etc.
 */
export function transcriptToChoiceIndex(
  transcript: string,
  choiceCount: number
): number {
  const t = transcript.toLowerCase().trim();

  // Letter mappings
  const letterMaps: Array<[RegExp, number]> = [
    [/\b(a|ay|alpha|first|one|1st|number\s*1|number\s*one)\b/, 0],
    [/\b(b|bee|bravo|second|two|2nd|number\s*2|number\s*two)\b/, 1],
    [/\b(c|see|sea|charlie|third|three|3rd|number\s*3|number\s*three)\b/, 2],
    [/\b(d|dee|delta|fourth|four|4th|number\s*4|number\s*four)\b/, 3],
    [/\b(e|ee|echo|fifth|five|5th|number\s*5|number\s*five)\b/, 4],
  ];

  for (const [re, idx] of letterMaps) {
    if (idx < choiceCount && re.test(t)) return idx;
  }

  return -1;
}

/* ──────────────────────────────────────────────────────────
 * Helpers — clean text for TTS pronunciation
 * ────────────────────────────────────────────────────────── */

/**
 * Clean question/lesson text for pronunciation.
 *   - "AZ-900" → "A Z dash 900" (preserve identifier)
 *   - "AWS S3" → "A W S S 3"
 *   - Strip markdown markers (*, _, `)
 *   - Expand common service abbreviations the TTS engine mangles
 */
export function ttsClean(text: string): string {
  let out = text
    .replace(/[`*_~]/g, "")
    .replace(/\bAZ-(\d+)\b/g, "A Z dash $1")
    .replace(/\bMS-(\d+)\b/g, "M S dash $1")
    .replace(/\bAI-(\d+)\b/g, "A I dash $1")
    .replace(/\bSY0-(\d+)\b/g, "S Y zero dash $1")
    .replace(/\bCLF-(\w+)\b/g, "C L F dash $1")
    .replace(/\bAIF-(\w+)\b/g, "A I F dash $1")
    .replace(/\bIAM\b/g, "I A M")
    .replace(/\bRBAC\b/g, "R B A C")
    .replace(/\bMFA\b/g, "M F A")
    .replace(/\bAWS\b/g, "A W S")
    .replace(/\bGCP\b/g, "G C P")
    .replace(/\bSaaS\b/g, "Saas")
    .replace(/\bPaaS\b/g, "Paas")
    .replace(/\bIaaS\b/g, "I a a S")
    .replace(/\bVNet\b/g, "V net")
    .replace(/\bvCPU\b/g, "v C P U")
    // Preserve sentence pacing — add a small pause at periods/colons
    .replace(/([.:?!])(\s|$)/g, "$1 $2");
  return out;
}
