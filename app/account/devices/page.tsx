"use client";

import { useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Laptop, Smartphone, Tablet, Monitor, CheckCircle2, XCircle,
  Clock, Shield, Info,
} from "lucide-react";
import { useDevices, revokeDevice, MAX_DEVICES, REVOKE_COOLDOWN_HOURS, type DeviceRecord } from "@/lib/device-binding";

export default function DevicesPage() {
  const { devices, currentId, cooldown, refresh } = useDevices();
  const [error, setError] = useState<string | null>(null);

  const handleRevoke = (deviceId: string, label: string) => {
    if (!confirm(`Revoke "${label}"? This device will lose access immediately. You won't be able to revoke another for ${REVOKE_COOLDOWN_HOURS} hours.`)) return;
    const result = revokeDevice(deviceId);
    if (!result.ok) {
      setError(
        result.reason === "cooldown" ? `Cooldown active. Try again in ${cooldown.waitHours} hours.`
      : result.reason === "self"     ? "You can't revoke the device you're currently using. Use sign-out instead."
      : result.reason === "not_found"? "Device not found — may already be revoked."
      :                                 "Revocation failed."
      );
      setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    refresh();
  };

  return (
    <>
      <AppNav />
      <AppShell className="max-w-2xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Shield className="h-7 w-7 text-brand-600" /> Your Devices
            </h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              One PassPilot license works on up to <strong>{MAX_DEVICES}</strong> devices.
              Manage which ones are active below.
            </p>
          </header>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-800 flex gap-2">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Cooldown indicator */}
          {!cooldown.ok && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/10 p-4 text-sm flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-700 dark:text-amber-300 mt-0.5 shrink-0" />
              <div>
                <strong className="text-amber-900 dark:text-amber-200">Revocation cooldown active.</strong>
                <span className="text-amber-800 dark:text-amber-300">
                  {" "}You can revoke another device in <strong>{cooldown.waitHours}</strong> {cooldown.waitHours === 1 ? "hour" : "hours"}.
                  This prevents account sharing.
                </span>
              </div>
            </div>
          )}

          {/* Device list */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Active devices ({devices.length} / {MAX_DEVICES})
            </h2>

            {devices.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No devices registered yet. Your current device will be added automatically when you use PassPilot Pro.
              </div>
            ) : (
              <div className="space-y-3">
                {devices.map((d) => (
                  <DeviceCard
                    key={d.id}
                    device={d}
                    canRevoke={cooldown.ok}
                    onRevoke={() => handleRevoke(d.id, d.nickname)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* How it works */}
          <section className="rounded-2xl border bg-muted/20 p-5 text-sm">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" /> How device limits work
            </h3>
            <ul className="mt-3 space-y-2 text-foreground/80 leading-relaxed">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>You can use PassPilot Pro on up to <strong>{MAX_DEVICES}</strong> devices simultaneously.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>A <strong>{REVOKE_COOLDOWN_HOURS}-hour cooldown</strong> between revocations prevents password sharing ("let me check in real quick" for N friends).</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>You can always sign out of your current device — that's not subject to the cooldown.</span>
              </li>
              <li className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span>Clearing your browser data counts as a revoke. Re-registering fresh costs you one of the 2 slots.</span>
              </li>
            </ul>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function DeviceCard({ device, canRevoke, onRevoke }: {
  device: DeviceRecord;
  canRevoke: boolean;
  onRevoke: () => void;
}) {
  const Icon =
    /iPhone|Android/.test(device.nickname) ? Smartphone
  : /iPad|Tablet/.test(device.nickname)    ? Tablet
  : /Windows|Mac|Linux/.test(device.nickname) ? Laptop
  :                                             Monitor;

  return (
    <div className={`rounded-xl border p-4 ${device.isCurrent ? "border-brand-200 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/15/30" : "bg-card"}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${device.isCurrent ? "bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">{device.nickname}</h3>
            {device.isCurrent && (
              <span className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-[10px]">
                This device
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            First seen {new Date(device.firstSeenAt).toLocaleString()}
            {" · "}
            Last active {relativeTime(device.lastSeenAt)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/80 font-mono">
            {device.screenSize} · {device.timezone} · fp:{device.fingerprint.slice(0, 8)}
          </p>
        </div>
        {!device.isCurrent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRevoke}
            disabled={!canRevoke}
            className="shrink-0 text-red-600 hover:bg-red-50 dark:bg-red-500/10 disabled:text-muted-foreground"
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)  return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
