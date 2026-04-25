/**
 * Device Binding — Layer 5 of the abuse-defense stack.
 *
 * Limits active devices per license to prevent password/account sharing.
 *   - Max 2 active devices
 *   - 24-hour cooldown between device removals
 *   - Stable-ish device fingerprint (no PII, no tracking)
 *
 * Who it applies to:
 *   - Pro / Multi tier only
 *   - Free tier: unlimited devices (they're gated by daily drill cap anyway)
 *
 * Storage:
 *   localStorage key `passpilot.devices` — array of DeviceRecord
 *   Also a field `lastDeviceRevokedAt` for the 24h cooldown
 *
 * Security model (honest):
 *   Client-side device binding is defeatable by determined attackers
 *   (clear localStorage, use incognito, spoof fingerprint). It's NOT about
 *   stopping 100% of sharing — it's about making casual credential-sharing
 *   annoying enough that most users don't bother. Combined with layers 1-4,
 *   this significantly raises the cost of abuse.
 */

"use client";

import { useEffect, useState } from "react";

export const MAX_DEVICES = 2;
export const REVOKE_COOLDOWN_HOURS = 24;

const DEVICES_KEY = "passpilot.devices";
const COOLDOWN_KEY = "passpilot.last-device-revoked-at";
const THIS_DEVICE_KEY = "passpilot.this-device-id";

export interface DeviceRecord {
  id: string;
  fingerprint: string;
  firstSeenAt: string;
  lastSeenAt: string;
  userAgent: string;
  screenSize: string;
  timezone: string;
  nickname: string;
  isCurrent?: boolean; // computed at read-time
}

// ─── Fingerprinting ────────────────────────────────────────────────
// Not a security-grade fingerprint — intentionally. Stable enough for
// legit users, easy enough to read that we don't need canvas/WebGL tricks.

function makeFingerprint(): string {
  if (typeof window === "undefined") return "ssr";
  const ua = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language;
  const raw = [ua, screen, tz, lang].join("|");
  // Simple hash (djb2) — stable, readable, no deps
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) hash = ((hash << 5) + hash) + raw.charCodeAt(i);
  return Math.abs(hash).toString(36).padStart(8, "0").slice(0, 12);
}

function niceName(ua: string): string {
  // Cheap device labeling for the user-facing UI
  const isWin     = /Windows/i.test(ua);
  const isMac     = /Macintosh|Mac OS X/i.test(ua);
  const isIPhone  = /iPhone/i.test(ua);
  const isIPad    = /iPad/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isLinux   = /Linux/i.test(ua) && !isAndroid;
  const isChrome  = /Chrome\/\d/i.test(ua) && !/Edg\//i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isSafari  = /Safari/i.test(ua) && !isChrome;
  const isEdge    = /Edg\//i.test(ua);

  const os =
    isIPhone  ? "iPhone"
  : isIPad    ? "iPad"
  : isAndroid ? "Android"
  : isWin     ? "Windows"
  : isMac     ? "Mac"
  : isLinux   ? "Linux"
  :             "Unknown device";

  const browser =
    isChrome  ? "Chrome"
  : isEdge    ? "Edge"
  : isFirefox ? "Firefox"
  : isSafari  ? "Safari"
  :             "Browser";

  return `${os} · ${browser}`;
}

// ─── Storage ───────────────────────────────────────────────────────

function readDevices(): DeviceRecord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DEVICES_KEY) || "[]"); }
  catch { return []; }
}

function writeDevices(devices: DeviceRecord[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(DEVICES_KEY, JSON.stringify(devices)); } catch {}
}

function getThisDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(THIS_DEVICE_KEY);
  if (!id) {
    id = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    try { localStorage.setItem(THIS_DEVICE_KEY, id); } catch {}
  }
  return id;
}

// ─── Cooldown ──────────────────────────────────────────────────────

export function canRevokeNow(): { ok: boolean; waitHours: number } {
  if (typeof window === "undefined") return { ok: false, waitHours: 0 };
  const lastStr = localStorage.getItem(COOLDOWN_KEY);
  if (!lastStr) return { ok: true, waitHours: 0 };
  const last = new Date(lastStr).getTime();
  if (isNaN(last)) return { ok: true, waitHours: 0 };
  const hoursSince = (Date.now() - last) / (1000 * 60 * 60);
  if (hoursSince >= REVOKE_COOLDOWN_HOURS) return { ok: true, waitHours: 0 };
  return { ok: false, waitHours: Math.ceil(REVOKE_COOLDOWN_HOURS - hoursSince) };
}

function markRevoked(): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(COOLDOWN_KEY, new Date().toISOString()); } catch {}
}

// ─── Public API ────────────────────────────────────────────────────

/**
 * Register THIS device if it's not already registered.
 * Returns:
 *   - `{ ok: true }` — device registered (or was already there)
 *   - `{ ok: false, reason: "limit" }` — max devices hit; this device is not in the list
 */
export function registerThisDevice(): { ok: boolean; reason?: "limit" } {
  if (typeof window === "undefined") return { ok: true };
  const devices = readDevices();
  const thisId = getThisDeviceId();
  const fingerprint = makeFingerprint();
  const ua = navigator.userAgent;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const now = new Date().toISOString();
  const existing = devices.find(d => d.id === thisId || d.fingerprint === fingerprint);
  if (existing) {
    // Refresh last-seen, fingerprint may have shifted slightly (ok)
    existing.lastSeenAt = now;
    existing.fingerprint = fingerprint;
    writeDevices(devices);
    return { ok: true };
  }

  if (devices.length >= MAX_DEVICES) return { ok: false, reason: "limit" };

  devices.push({
    id: thisId,
    fingerprint,
    firstSeenAt: now,
    lastSeenAt: now,
    userAgent: ua,
    screenSize,
    timezone: tz,
    nickname: niceName(ua),
  });
  writeDevices(devices);
  return { ok: true };
}

export function listDevices(): DeviceRecord[] {
  const devices = readDevices();
  const thisId = getThisDeviceId();
  return devices.map(d => ({ ...d, isCurrent: d.id === thisId }));
}

/**
 * Revoke a specific device. Respects the 24h cooldown.
 * Cannot revoke the current device via this path — use signOut for that.
 */
export function revokeDevice(deviceId: string): { ok: boolean; reason?: "cooldown" | "not_found" | "self" } {
  const thisId = getThisDeviceId();
  if (deviceId === thisId) return { ok: false, reason: "self" };
  const cd = canRevokeNow();
  if (!cd.ok) return { ok: false, reason: "cooldown" };
  const devices = readDevices();
  const before = devices.length;
  const filtered = devices.filter(d => d.id !== deviceId);
  if (filtered.length === before) return { ok: false, reason: "not_found" };
  writeDevices(filtered);
  markRevoked();
  return { ok: true };
}

/**
 * Force-remove this device (sign-out). No cooldown — user should always be
 * able to log themselves out. The 24h cooldown only applies to revoking
 * OTHER devices.
 */
export function removeThisDevice(): void {
  const thisId = getThisDeviceId();
  const devices = readDevices().filter(d => d.id !== thisId);
  writeDevices(devices);
}

// ─── React hooks ───────────────────────────────────────────────────

export function useDevices(): {
  devices: DeviceRecord[];
  currentId: string;
  cooldown: { ok: boolean; waitHours: number };
  refresh: () => void;
} {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [currentId, setCurrentId] = useState("");
  const [cooldown, setCooldown] = useState<{ ok: boolean; waitHours: number }>({ ok: true, waitHours: 0 });

  const refresh = () => {
    setDevices(listDevices());
    setCurrentId(getThisDeviceId());
    setCooldown(canRevokeNow());
  };

  useEffect(() => { refresh(); }, []);

  return { devices, currentId, cooldown, refresh };
}

/**
 * Boot-time hook — registers the current device on first mount.
 * Returns a boolean `limited` flag when the license's device limit is hit
 * and this device isn't one of the registered ones.
 *
 * Usage (in a layout or top-level client component):
 *   const { limited } = useDeviceBinding(ent.hasPro);
 *   if (limited) return <DeviceLimitWall />;
 */
export function useDeviceBinding(enforce: boolean): { limited: boolean; registered: boolean } {
  const [state, setState] = useState<{ limited: boolean; registered: boolean }>({
    limited: false,
    registered: false,
  });

  useEffect(() => {
    if (!enforce) { setState({ limited: false, registered: true }); return; }
    const result = registerThisDevice();
    setState({
      limited: !result.ok && result.reason === "limit",
      registered: result.ok,
    });
  }, [enforce]);

  return state;
}
