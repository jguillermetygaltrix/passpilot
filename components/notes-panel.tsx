"use client";

/**
 * NotesPanel — drop-in component for a topic page or any surface that
 * needs a "your notes" widget. Self-contained: handles add / edit /
 * delete / pin all in localStorage via lib/notes.ts.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Pin,
  PinOff,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  StickyNote,
} from "lucide-react";
import {
  getNotesForTopic,
  addNote,
  updateNote,
  deleteNote,
  NOTE_TONES,
  type Note,
} from "@/lib/notes";

interface Props {
  topicId: string;
  examId: string;
  /** Optional title override (defaults to "Your notes"). */
  title?: string;
  /** Compact mode — single column, smaller cards. Default: full grid. */
  compact?: boolean;
}

export function NotesPanel({ topicId, examId, title = "Your notes", compact = false }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setNotes(getNotesForTopic(topicId));
  }, [topicId, version]);

  const handleAdd = () => {
    if (!draft.trim()) return;
    addNote({ topicId, examId, body: draft });
    setDraft("");
    setVersion((v) => v + 1);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateNote(editingId, { body: editingBody });
    setEditingId(null);
    setEditingBody("");
    setVersion((v) => v + 1);
  };

  const handlePin = (id: string, currentlyPinned: boolean) => {
    updateNote(id, { pinned: !currentlyPinned });
    setVersion((v) => v + 1);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this note? This can't be undone.")) return;
    deleteNote(id);
    setVersion((v) => v + 1);
  };

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-amber-600" />
          <span className="font-semibold text-sm">{title}</span>
          {notes.length > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              · {notes.length}
            </span>
          )}
        </div>
      </div>

      {/* Compose */}
      <div className="mb-4 flex gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Capture a thought, mnemonic, or 'wait, what does that mean?' moment…"
          rows={2}
          maxLength={1000}
          className="flex-1 resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-muted-foreground/60"
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter to save
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-muted-foreground text-white px-3 py-2 text-sm font-medium inline-flex items-center gap-1.5 transition-colors shrink-0 self-start"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          No notes yet — capture your first one above.
        </div>
      ) : (
        <div className={compact ? "space-y-2" : "grid sm:grid-cols-2 gap-2.5"}>
          {notes.map((n) => {
            const tone = NOTE_TONES[n.toneIndex] ?? NOTE_TONES[0];
            const isEditing = editingId === n.id;
            return (
              <div
                key={n.id}
                className={`relative rounded-xl border p-3.5 ${tone.bg} ${tone.border} ${tone.text} group transition-all hover:shadow-soft`}
              >
                {n.pinned && (
                  <Pin className="absolute top-2 right-2 h-3 w-3 fill-current opacity-60" />
                )}
                {isEditing ? (
                  <>
                    <textarea
                      value={editingBody}
                      onChange={(e) => setEditingBody(e.target.value)}
                      rows={3}
                      maxLength={1000}
                      autoFocus
                      className="w-full resize-none rounded-md border border-current/20 bg-white/70 px-2 py-1.5 text-sm focus:outline-none"
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-xs font-medium inline-flex items-center gap-1 px-2 py-1 rounded-md bg-current/10 hover:bg-current/20"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingBody("");
                        }}
                        className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-current/10 opacity-70"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap pr-5">
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] opacity-70">
                      <span className="tabular-nums">
                        {timeAgo(n.updatedAt)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handlePin(n.id, n.pinned)}
                          className="p-1 rounded-md hover:bg-current/10"
                          aria-label={n.pinned ? "Unpin" : "Pin"}
                        >
                          {n.pinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(n.id);
                            setEditingBody(n.body);
                          }}
                          className="p-1 rounded-md hover:bg-current/10"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="p-1 rounded-md hover:bg-rose-200/40"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
