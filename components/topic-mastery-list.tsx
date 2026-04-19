"use client";

import Link from "next/link";
import { TOPIC_MAP } from "@/lib/data/topics";
import type { TopicMastery } from "@/lib/types";
import { ProgressBar } from "./ui/progress";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function TopicMasteryList({
  mastery,
  onTopicClick,
  showLink = true,
}: {
  mastery: TopicMastery[];
  onTopicClick?: (topicId: string) => void;
  showLink?: boolean;
}) {
  const sorted = [...mastery].sort((a, b) => b.priority - a.priority);

  return (
    <ul className="divide-y-soft">
      {sorted.map((m) => {
        const topic = TOPIC_MAP[m.topicId];
        if (!topic) return null;
        const pct = m.attempts
          ? Math.round(m.accuracy * 100)
          : null;
        const tone =
          pct === null
            ? "brand"
            : pct >= 80
              ? "emerald"
              : pct >= 65
                ? "brand"
                : pct >= 50
                  ? "amber"
                  : "rose";

        const content = (
          <div className="flex items-center gap-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="min-w-0">
                  <div className="font-medium text-sm text-foreground truncate">
                    {topic.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {m.attempts > 0
                      ? `${m.correct}/${m.attempts} correct · weight ${Math.round(topic.weight * 100)}%`
                      : `Not tested yet · weight ${Math.round(topic.weight * 100)}%`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      pct === null
                        ? "text-muted-foreground"
                        : pct >= 80
                          ? "text-emerald-600"
                          : pct >= 65
                            ? "text-brand-600"
                            : pct >= 50
                              ? "text-amber-600"
                              : "text-rose-600"
                    )}
                  >
                    {pct === null ? "—" : `${pct}%`}
                  </div>
                </div>
              </div>
              <ProgressBar value={pct ?? 0} tone={tone as any} />
            </div>
            {showLink && (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        );

        if (onTopicClick) {
          return (
            <li key={topic.id}>
              <button
                onClick={() => onTopicClick(topic.id)}
                className="w-full text-left hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
              >
                {content}
              </button>
            </li>
          );
        }

        if (showLink) {
          return (
            <li key={topic.id}>
              <Link
                href={`/practice?topic=${topic.id}`}
                className="block hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
              >
                {content}
              </Link>
            </li>
          );
        }

        return <li key={topic.id}>{content}</li>;
      })}
    </ul>
  );
}
