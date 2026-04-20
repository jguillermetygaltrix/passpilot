"use client";

import { useState, useRef } from "react";
import { Share2, Check, Download, Copy } from "lucide-react";
import type { ExamId, RiskLevel } from "@/lib/types";

interface Props {
  examId: ExamId;
  examName: string;
  readinessScore: number;
  daysToExam: number;
  risk: RiskLevel;
}

/**
 * Shareable readiness card — generates a PNG the user can post to
 * Instagram / LinkedIn / Twitter / Discord / WhatsApp.
 *
 * This is the viral loop: every user can broadcast their progress
 * back to their network, pulling new signups in via the PassPilot
 * watermark + URL.
 *
 * Strategy lifted from: Strava kudos cards, Peloton milestones,
 * Duolingo streak screenshots, Spotify Wrapped.
 */
export function ShareableReadiness({
  examId,
  examName,
  readinessScore,
  daysToExam,
  risk,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [copied, setCopied] = useState(false);

  const riskLabel = {
    high: "building",
    borderline: "warming up",
    safer: "on track",
    strong: "exam-ready",
  }[risk];

  const riskColor = {
    high: "#ef4444",
    borderline: "#f59e0b",
    safer: "#06b6d4",
    strong: "#10b981",
  }[risk];

  const generateCard = async (): Promise<string | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const w = 1080;
    const h = 1080;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#0B0D13");
    bg.addColorStop(1, "#111827");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Glow halo
    const glow = ctx.createRadialGradient(w / 2, h / 2 - 50, 50, w / 2, h / 2 - 50, 500);
    glow.addColorStop(0, `${riskColor}33`);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // PassPilot brand mark (top)
    ctx.fillStyle = "#06b6d4";
    ctx.font = "700 44px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PassPilot", w / 2, 120);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "400 22px -apple-system, system-ui, sans-serif";
    ctx.fillText("Cert readiness, measured", w / 2, 160);

    // Big score ring
    const cx = w / 2;
    const cy = h / 2 + 30;
    const r = 220;

    // Ring track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 24;
    ctx.stroke();

    // Ring progress
    const pct = Math.max(0, Math.min(100, readinessScore)) / 100;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = riskColor;
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.stroke();

    // Score number in center
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 160px -apple-system, system-ui, sans-serif";
    ctx.fillText(`${Math.round(readinessScore)}%`, cx, cy + 40);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 28px -apple-system, system-ui, sans-serif";
    ctx.fillText("READINESS", cx, cy + 80);

    // Exam chip
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    const chipW = 360;
    const chipH = 60;
    const chipX = (w - chipW) / 2;
    const chipY = cy + 180;
    roundRect(ctx, chipX, chipY, chipW, chipH, 16);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 28px -apple-system, system-ui, sans-serif";
    ctx.fillText(examName, w / 2, chipY + 40);

    // Status line
    ctx.fillStyle = riskColor;
    ctx.font = "600 32px -apple-system, system-ui, sans-serif";
    ctx.fillText(`I'm ${riskLabel}`, w / 2, cy + 310);

    // Days to exam
    if (daysToExam > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "400 24px -apple-system, system-ui, sans-serif";
      ctx.fillText(
        `${daysToExam} day${daysToExam === 1 ? "" : "s"} until exam`,
        w / 2,
        cy + 355
      );
    }

    // URL footer
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "500 26px -apple-system, system-ui, sans-serif";
    ctx.fillText("passpilot.app", w / 2, h - 60);

    return canvas.toDataURL("image/png");
  };

  const handleShare = async () => {
    setStatus("generating");
    const dataUrl = await generateCard();
    if (!dataUrl) {
      setStatus("idle");
      return;
    }

    // Try native share with file first (mobile), fall back to download
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `passpilot-${examId}-readiness.png`, {
        type: "image/png",
      });
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "My PassPilot readiness",
          text: `I'm ${Math.round(readinessScore)}% ready for ${examName}. Beat me.`,
        });
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }
    } catch {
      // user cancelled or not supported — fall through to download
    }

    // Fallback: trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `passpilot-${examId}-readiness.png`;
    link.click();
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const handleCopyText = async () => {
    const text = `I'm ${Math.round(readinessScore)}% ready for ${examName}. Beat me. passpilot.app`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-white">Share your readiness</div>
          <div className="text-xs text-gray-400">Brag a little. Bring a friend.</div>
        </div>
        <Share2 className="w-5 h-5 text-cyan-400" />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          disabled={status === "generating"}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          {status === "generating" ? (
            "Generating..."
          ) : status === "done" ? (
            <>
              <Check className="w-4 h-4" />
              Shared
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download card
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopyText}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy text"}
        </button>
      </div>

      {/* Hidden canvas used for PNG generation */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
