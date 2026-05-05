"use client";

/**
 * <TopicConstellation /> — DEC-054 D-tier polish.
 *
 * A Destiny-style hex-node visualization of every topic in the user's exam,
 * arranged in a flower / cluster pattern. Each hex:
 *   - SIZE scales with topic.weight (high-weight topics get bigger nodes,
 *     visually surfacing exam priority at a glance)
 *   - FILL TONE tracks mastery (rose <50, amber 50-65, brand 65-80, emerald 80+;
 *     gray for "no attempts yet")
 *   - GLOW intensity tracks accuracy — high-mastery hexes feel lit, weak ones dim
 *   - TAP navigates to /practice?topic=<id> for a focused drill
 *   - LABEL shows shortName below + accuracy %
 *
 * Layout: deterministic flower — first topic at center, the rest arranged
 * around it on a hex ring. Stable for any topic count 1-9. For >9 topics,
 * the algorithm wraps to a second ring (rare for cert exams which are
 * typically 4-7 topics).
 *
 * SVG-based for crisp rendering at any resolution. No animations on
 * mount (the hover/tap interactions provide the dynamic feel; mount-time
 * animation would clash with the dashboard's other ones).
 */

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TOPIC_MAP } from "@/lib/data/topics";
import type { TopicMastery, Topic } from "@/lib/types";
import { tap as hapticTap } from "@/lib/haptics";

interface NodeData {
  topic: Topic;
  mastery: TopicMastery | null;
  cx: number;
  cy: number;
  radius: number;
  toneFill: string;
  toneStroke: string;
  toneGlow: string;
  glowOpacity: number;
  accLabel: string;
}

function regularHexPath(cx: number, cy: number, r: number): string {
  // Pointy-top hex (classic Destiny tile orientation): 6 points starting top.
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") + " Z";
}

function toneFor(accuracy: number | null): {
  fill: string;
  stroke: string;
  glow: string;
} {
  if (accuracy === null) {
    return { fill: "#475569", stroke: "#64748b", glow: "#94a3b8" }; // slate
  }
  if (accuracy >= 0.8)
    return { fill: "#10b981", stroke: "#34d399", glow: "#6ee7b7" }; // emerald
  if (accuracy >= 0.65)
    return { fill: "#6366f1", stroke: "#818cf8", glow: "#a5b4fc" }; // brand-ish
  if (accuracy >= 0.5)
    return { fill: "#f59e0b", stroke: "#fbbf24", glow: "#fcd34d" }; // amber
  return { fill: "#f43f5e", stroke: "#fb7185", glow: "#fda4af" }; // rose
}

/**
 * Layout topics in a flower: first at center, rest on a ring at angle steps.
 * For 1 topic → just center. 2-7 → center + ring of n-1. 8-9 → center + 6 + 2-3 outer.
 */
function layoutTopics(
  topics: Topic[],
  width: number,
  height: number
): { cx: number; cy: number; radius: number }[] {
  const center = { x: width / 2, y: height / 2 };
  const baseR = Math.min(width, height) * 0.13;
  // Ring radius — distance from center to neighboring hex centers.
  const ringR = Math.min(width, height) * 0.3;
  // Sort by weight descending so the most important topic anchors the center.
  const sorted = [...topics].sort((a, b) => b.weight - a.weight);

  return sorted.map((t, i) => {
    // Hex size scaled by topic.weight (0.05 → 0.4 typical range), capped to
    // [0.85, 1.4] of baseR so even tiny topics are tappable on mobile.
    const sizeMult = 0.85 + Math.min(0.55, t.weight * 1.4);
    const radius = baseR * sizeMult;

    if (i === 0) {
      return { cx: center.x, cy: center.y, radius };
    }
    // Place on first ring (slots 1-6); spill over to a second ring after 7.
    if (i <= 6) {
      const angle = ((i - 1) * 60 - 90) * (Math.PI / 180);
      return {
        cx: center.x + ringR * Math.cos(angle),
        cy: center.y + ringR * Math.sin(angle),
        radius,
      };
    }
    // Second ring (rare — only for exams with 8+ topics)
    const idx2 = i - 7;
    const angle = (idx2 * 90 - 45) * (Math.PI / 180);
    return {
      cx: center.x + ringR * 1.7 * Math.cos(angle),
      cy: center.y + ringR * 1.7 * Math.sin(angle),
      radius,
    };
  });
}

export function TopicConstellation({
  topics,
  mastery,
  width = 360,
  height = 320,
  className,
}: {
  topics: Topic[];
  mastery: TopicMastery[];
  width?: number;
  height?: number;
  className?: string;
}) {
  const router = useRouter();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const nodes: NodeData[] = useMemo(() => {
    if (!topics.length) return [];
    const positions = layoutTopics(topics, width, height);
    // Re-sort topics in the same order layoutTopics uses (by weight desc) so
    // index alignment is correct.
    const sorted = [...topics].sort((a, b) => b.weight - a.weight);
    return sorted.map((topic, i) => {
      const m = mastery.find((mm) => mm.topicId === topic.id) ?? null;
      const acc = m && m.attempts > 0 ? m.accuracy : null;
      const tone = toneFor(acc);
      const accLabel = acc === null ? "—" : `${Math.round(acc * 100)}%`;
      return {
        topic,
        mastery: m,
        cx: positions[i].cx,
        cy: positions[i].cy,
        radius: positions[i].radius,
        toneFill: tone.fill,
        toneStroke: tone.stroke,
        toneGlow: tone.glow,
        // Glow opacity scales with accuracy: untouched topics are dim,
        // mastered ones lit. Floor at 0.15 so even unattempted hexes
        // are visible.
        glowOpacity: acc === null ? 0.18 : 0.25 + acc * 0.55,
        accLabel,
      };
    });
  }, [topics, mastery, width, height]);

  const handleTap = (topicId: string) => {
    hapticTap();
    router.push(`/practice?topic=${encodeURIComponent(topicId)}`);
  };

  const hovered = hoverId ? nodes.find((n) => n.topic.id === hoverId) : null;

  return (
    <div className={className} style={{ width: "100%", maxWidth: width }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Topic mastery map. Tap a hex to drill that topic."
      >
        {/* Constellation links — subtle lines from center to each ring node.
            Renders behind nodes so the hex art sits on top. */}
        {nodes.length > 1 && (
          <g aria-hidden>
            {nodes.slice(1).map((n) => (
              <line
                key={`link-${n.topic.id}`}
                x1={nodes[0].cx}
                y1={nodes[0].cy}
                x2={n.cx}
                y2={n.cy}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
                className="text-foreground"
              />
            ))}
          </g>
        )}

        {/* Glow halos behind each hex */}
        {nodes.map((n) => (
          <circle
            key={`glow-${n.topic.id}`}
            cx={n.cx}
            cy={n.cy}
            r={n.radius * 1.7}
            fill={n.toneGlow}
            opacity={n.glowOpacity * 0.5}
            style={{ filter: "blur(12px)" }}
            aria-hidden
          />
        ))}

        {/* Hex tiles */}
        {nodes.map((n) => {
          const isHover = hoverId === n.topic.id;
          return (
            <g
              key={n.topic.id}
              style={{ cursor: "pointer", transition: "transform 200ms" }}
              transform={isHover ? `translate(0 -2)` : ""}
              onMouseEnter={() => setHoverId(n.topic.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => handleTap(n.topic.id)}
            >
              <path
                d={regularHexPath(n.cx, n.cy, n.radius)}
                fill={n.toneFill}
                fillOpacity={n.mastery && n.mastery.attempts > 0 ? 0.85 : 0.4}
                stroke={n.toneStroke}
                strokeWidth={isHover ? 2.5 : 1.5}
                style={{ transition: "all 200ms" }}
              />
              {/* Inner chamfer — second hex slightly smaller, brighter stroke. */}
              <path
                d={regularHexPath(n.cx, n.cy, n.radius * 0.78)}
                fill="none"
                stroke="white"
                strokeOpacity={0.18}
                strokeWidth={1}
              />
              {/* Accuracy % center label */}
              <text
                x={n.cx}
                y={n.cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={n.radius * 0.42}
                fontWeight={700}
                style={{ pointerEvents: "none", letterSpacing: "-0.02em" }}
              >
                {n.accLabel}
              </text>
              {/* shortName label below the hex */}
              <text
                x={n.cx}
                y={n.cy + n.radius + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                className="text-foreground"
                fontSize={10}
                fontWeight={600}
                style={{ pointerEvents: "none" }}
              >
                {n.topic.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover/tap details — keeps mobile users informed even when SVG hover
          isn't ideal. On mobile, the click navigates immediately so this
          mainly helps desktop users decide which to drill. */}
      {hovered && (
        <div className="mt-3 rounded-xl border border-border bg-white/80 dark:bg-card/80 backdrop-blur-sm p-3 text-sm animate-fade-in">
          <div className="font-semibold">{hovered.topic.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {hovered.mastery && hovered.mastery.attempts > 0
              ? `${Math.round(hovered.mastery.accuracy * 100)}% accuracy across ${hovered.mastery.attempts} attempts · ${Math.round(hovered.topic.weight * 100)}% of exam`
              : `Not drilled yet · worth ~${Math.round(hovered.topic.weight * 100)}% of exam`}
          </div>
          <div className="text-[11px] text-brand-600 dark:text-brand-300 mt-1 font-medium">
            Tap to drill →
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export TOPIC_MAP for convenience if dashboard needs it inline.
export { TOPIC_MAP };
