"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getLessonsForExam } from "@/lib/data/lessons";
import { getTopicsForExam } from "@/lib/data/topics";
import { EXAMS } from "@/lib/data/exams";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Command,
  Compass,
  Dumbbell,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  PlayCircle,
  Search,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";

type Item = {
  id: string;
  label: string;
  sub?: string;
  icon: typeof Compass;
  href: string;
  group: "Navigate" | "Learn" | "Practice" | "Manage";
  tone?: "brand" | "rose" | "emerald" | "violet";
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { profile } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const items: Item[] = useMemo(() => {
    const base: Item[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        sub: "Your pass-readiness home",
        icon: LayoutDashboard,
        href: "/dashboard",
        group: "Navigate",
        tone: "brand",
      },
      {
        id: "plan",
        label: "Today's study plan",
        sub: "The blocks you should hit today",
        icon: Calendar,
        href: "/plan",
        group: "Navigate",
      },
      {
        id: "practice",
        label: "Practice drills",
        sub: "Mixed, topic, or incorrect-only",
        icon: Dumbbell,
        href: "/practice",
        group: "Practice",
      },
      {
        id: "mixed",
        label: "Start mixed drill",
        sub: "10 random questions across domains",
        icon: PlayCircle,
        href: "/practice?mode=mixed",
        group: "Practice",
      },
      {
        id: "review",
        label: "Review incorrect answers",
        sub: "Re-face questions you've missed",
        icon: PlayCircle,
        href: "/practice?mode=incorrect-only",
        group: "Practice",
      },
      {
        id: "guide",
        label: "Open study guide",
        sub: "Chapter lessons and deep reviews",
        icon: BookOpen,
        href: "/guide",
        group: "Learn",
      },
      {
        id: "weakness",
        label: "Weakness review",
        sub: "What's dragging your readiness down",
        icon: AlertTriangle,
        href: "/weakness",
        group: "Practice",
        tone: "rose",
      },
      {
        id: "rescue",
        label: "Rescue mode",
        sub: "Condensed plan for the final days",
        icon: LifeBuoy,
        href: "/rescue",
        group: "Practice",
        tone: "rose",
      },
      {
        id: "diagnostic",
        label: "Take the diagnostic",
        sub: "Recalibrate your readiness",
        icon: Sparkles,
        href: "/diagnostic",
        group: "Practice",
        tone: "violet",
      },
      {
        id: "settings",
        label: "Settings",
        sub: "Exam, schedule, preferences",
        icon: Settings,
        href: "/settings",
        group: "Manage",
      },
    ];

    if (profile) {
      const lessons = getLessonsForExam(profile.examId);
      lessons.slice(0, 6).forEach((l) => {
        base.push({
          id: `lesson-${l.id}`,
          label: `Lesson: ${l.title}`,
          sub: `${l.minutes} min · open chapter`,
          icon: GraduationCap,
          href: `/guide/${l.topicId}/${l.id}`,
          group: "Learn",
          tone: "violet",
        });
      });

      const topics = getTopicsForExam(profile.examId);
      topics.forEach((t) => {
        base.push({
          id: `topic-${t.id}`,
          label: `Drill: ${t.name}`,
          sub: `Weight ${Math.round(t.weight * 100)}% · topic practice`,
          icon: Target,
          href: `/practice?topic=${t.id}`,
          group: "Practice",
        });
      });

      EXAMS.forEach((e) => {
        if (e.id !== profile.examId) {
          base.push({
            id: `switch-${e.id}`,
            label: `Switch to ${e.name}`,
            sub: `${e.fullTitle}`,
            icon: Compass,
            href: "/settings",
            group: "Manage",
          });
        }
      });
    }

    return base;
  }, [profile]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.sub?.toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    filtered.forEach((it) => {
      (groups[it.group] ||= []).push(it);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${activeIndex}"]`
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) {
        router.push(target.href);
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh] animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-brand-500/70 via-violet2-500/70 to-cyan-500/70 shadow-pop">
          <div className="rounded-[14px] bg-white overflow-hidden">
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search or jump to anywhere in PassPilot…"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 px-2 rounded-md bg-slate-100 text-[11px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Nothing matches "{query}".
                </div>
              ) : (
                Object.entries(grouped).map(([group, groupItems]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">
                      {group}
                    </div>
                    {groupItems.map((it) => {
                      const globalIdx = filtered.findIndex((f) => f.id === it.id);
                      const isActive = globalIdx === activeIndex;
                      const Icon = it.icon;
                      const toneBg =
                        it.tone === "rose"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : it.tone === "emerald"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : it.tone === "violet"
                              ? "bg-violet2-50 text-violet2-700 border-violet2-100"
                              : "bg-brand-50 text-brand-700 border-brand-100";
                      return (
                        <button
                          key={it.id}
                          data-idx={globalIdx}
                          onMouseMove={() => setActiveIndex(globalIdx)}
                          onClick={() => {
                            router.push(it.href);
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                            isActive
                              ? "bg-brand-50"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                              toneBg
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {it.label}
                            </div>
                            {it.sub && (
                              <div className="text-xs text-muted-foreground truncate">
                                {it.sub}
                              </div>
                            )}
                          </div>
                          {isActive && (
                            <ArrowRight className="h-4 w-4 text-brand-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border px-4 h-11 flex items-center justify-between text-[11px] text-muted-foreground bg-slate-50/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="h-5 px-1.5 rounded bg-white border border-border font-mono">
                    ↑
                  </kbd>
                  <kbd className="h-5 px-1.5 rounded bg-white border border-border font-mono">
                    ↓
                  </kbd>
                  move
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="h-5 px-1.5 rounded bg-white border border-border font-mono">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Command className="h-3 w-3" />
                <span className="font-medium text-foreground">PassPilot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
