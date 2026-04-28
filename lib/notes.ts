/**
 * Smart Notes — user-generated sticky notes scoped to a topic.
 *
 * Why: cert prep generates a TON of "wait, what does that mean again?"
 * moments. Users currently have nowhere to capture those — they end up
 * scribbling in a separate app or losing the thought. Notes scoped to
 * topics turn the existing topic guides into a personal study book.
 *
 * Storage: localStorage. Each note keyed by id, indexed by topicId for
 * fast lookup on the topic page. No server round-trip for v1.
 *
 * Composition:
 *   - Topic guide pages → "Add note" sticky button
 *   - Voice mode → spoken capture (TODO future: STT-driven note creation)
 *   - Cram sheet → optionally include notes for selected topics
 */

export interface Note {
  id: string;
  topicId: string;
  examId: string;
  body: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  /** Color tone (sticky-note vibe). 0..3 cycles palette. */
  toneIndex: number;
  /** Whether the user has marked this note as "important". Pinned notes show first. */
  pinned: boolean;
}

const STORAGE_KEY = "passpilot.notes.v1";

// 1KB body cap × 2000 ≈ 2MB worst case, comfortably under Safari's ~5MB
// LS quota even with SR cards + usage events stored alongside.
const MAX_NOTES = 2000;

function loadAll(): Record<string, Note> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(state: Record<string, Note>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota — tolerate */
  }
}

// Drop oldest unpinned notes when over MAX_NOTES. Pinned notes are preserved
// even past the cap (the user explicitly marked them important).
function trimNotes(state: Record<string, Note>): Record<string, Note> {
  const entries = Object.values(state);
  if (entries.length <= MAX_NOTES) return state;
  const unpinned = entries
    .filter((n) => !n.pinned)
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  const overflow = entries.length - MAX_NOTES;
  const toEvict = unpinned.slice(0, overflow);
  const next = { ...state };
  for (const note of toEvict) delete next[note.id];
  return next;
}

function uid(): string {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? `note_${crypto.randomUUID().slice(0, 8)}`
    : `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function getNotesForTopic(topicId: string): Note[] {
  const all = loadAll();
  return Object.values(all)
    .filter((n) => n.topicId === topicId)
    .sort((a, b) => {
      // Pinned first, then most recent updated
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function getAllNotes(examId?: string): Note[] {
  const all = Object.values(loadAll());
  return (examId ? all.filter((n) => n.examId === examId) : all)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function addNote(opts: {
  topicId: string;
  examId: string;
  body: string;
}): Note {
  const all = loadAll();
  const existingForTopic = Object.values(all).filter(
    (n) => n.topicId === opts.topicId
  );
  const nextTone = existingForTopic.length % 4;
  const now = new Date().toISOString();
  const note: Note = {
    id: uid(),
    topicId: opts.topicId,
    examId: opts.examId,
    body: opts.body.trim().slice(0, 1000), // cap length, prevent abuse
    createdAt: now,
    updatedAt: now,
    toneIndex: nextTone,
    pinned: false,
  };
  all[note.id] = note;
  saveAll(trimNotes(all));
  return note;
}

export function updateNote(id: string, patch: Partial<Pick<Note, "body" | "pinned">>): Note | null {
  const all = loadAll();
  const existing = all[id];
  if (!existing) return null;
  const updated: Note = {
    ...existing,
    ...patch,
    body: patch.body !== undefined ? patch.body.trim().slice(0, 1000) : existing.body,
    updatedAt: new Date().toISOString(),
  };
  all[id] = updated;
  saveAll(all);
  return updated;
}

export function deleteNote(id: string): void {
  const all = loadAll();
  if (!all[id]) return;
  delete all[id];
  saveAll(all);
}

export function getNoteCount(examId?: string): number {
  return getAllNotes(examId).length;
}

/** For testing / settings — wipe all notes. */
export function clearAllNotes(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Sticky-note color palette. 4 tones, cycled per-topic so adjacent notes
 * are visually distinct.
 */
export const NOTE_TONES = [
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-900" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-900" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900" },
] as const;
