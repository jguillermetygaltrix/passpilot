"use client";

import { useEffect } from "react";
import { registerThisDevice } from "@/lib/device-binding";
import { useApp } from "@/lib/store";

/**
 * DeviceRegistry — silent boot-time device registration.
 *
 * Runs on app mount. Only registers when the user has a Pro/Multi license.
 * If the device limit is already hit, the registration silently fails —
 * pages that gate Pro content (e.g. /practice) show the DeviceLimitWall.
 *
 * Free-tier users: no-op.
 */
export function DeviceRegistry() {
  const { license } = useApp();
  const hasPro = license?.tier === "pro" || license?.tier === "multi";

  useEffect(() => {
    if (!hasPro) return;
    registerThisDevice();
  }, [hasPro]);

  return null;
}
