/**
 * Quota-aware localStorage writer.
 *
 * Safari iOS silently drops `setItem` at ~5MB total per origin. PassPilot
 * stores SR cards + notes + usage events + onboarding state + voice
 * preferences all under that single budget — when ONE of those grows
 * past the cap, future writes for ALL of them start failing without any
 * user-visible signal. The user loses progress they thought was saved.
 *
 * What this helper does:
 *   1. Try the normal write.
 *   2. If quota error → call the caller's `trim` function to shrink the
 *      payload, then retry. Up to `maxRetries` (default 3) shrink cycles.
 *   3. If still failing → fire a `window` CustomEvent (`passpilot:storage-quota-exceeded`)
 *      so a UI component can listen and show a toast, and log to console.
 *
 * Each LS-backed module (sr.ts, notes.ts) supplies its own `trim` reducer
 * since eviction order is domain-specific (SR evicts mature cards first,
 * notes evict oldest unpinned first).
 *
 * Reasoning for not just clearing the whole key on failure: a half-saved
 * dataset is better than nothing. The trim reducer halves; we don't wipe.
 */

export const STORAGE_QUOTA_EVENT_NAME = "passpilot:storage-quota-exceeded";

export interface SafeSetItemResult {
  /** Whether the data was ultimately persisted. */
  ok: boolean;
  /** Whether trimming was applied to fit. The caller may want to refresh state. */
  trimmed: boolean;
  /** How many trim cycles ran. 0 if the first write succeeded. */
  trimCycles: number;
}

interface SafeSetItemOpts<T> {
  key: string;
  value: T;
  /**
   * Reducer called when a write fails with a quota error. Should return a
   * smaller version of `current`. Called repeatedly (up to maxRetries times)
   * until either the write succeeds or we give up.
   */
  trim: (current: T) => T;
  maxRetries?: number;
}

/**
 * Persist `value` at `key` with quota-aware retry.
 *
 * Returns synchronously. Safe to call during user-driven mutations
 * (gradeCard, addNote, etc.).
 */
export function safeSetItem<T>(opts: SafeSetItemOpts<T>): SafeSetItemResult {
  if (typeof window === "undefined") {
    return { ok: false, trimmed: false, trimCycles: 0 };
  }

  const maxRetries = opts.maxRetries ?? 3;
  let current = opts.value;
  let trimCycles = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      localStorage.setItem(opts.key, JSON.stringify(current));
      return { ok: true, trimmed: trimCycles > 0, trimCycles };
    } catch (e) {
      const isQuota = isQuotaError(e);
      if (!isQuota || attempt === maxRetries) {
        // Non-quota error or last retry — surface it.
        notifyQuotaExceeded(opts.key, isQuota, e);
        return { ok: false, trimmed: trimCycles > 0, trimCycles };
      }
      // Quota error — shrink and retry.
      current = opts.trim(current);
      trimCycles++;
    }
  }

  return { ok: false, trimmed: trimCycles > 0, trimCycles };
}

/**
 * Heuristic — different browsers throw different errors for full quota.
 */
function isQuotaError(e: unknown): boolean {
  if (e instanceof DOMException) {
    return (
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      e.code === 22 || // legacy WebKit
      e.code === 1014 // legacy Firefox
    );
  }
  if (e instanceof Error) {
    const msg = e.message.toLowerCase();
    return msg.includes("quota") || msg.includes("storage full");
  }
  return false;
}

function notifyQuotaExceeded(key: string, isQuota: boolean, err: unknown): void {
  if (typeof console !== "undefined") {
    const tag = isQuota ? "quota" : "error";
    // eslint-disable-next-line no-console
    console.error(
      `[passpilot/safe-storage] write failed (${tag}) for "${key}":`,
      err,
    );
  }
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent(STORAGE_QUOTA_EVENT_NAME, {
          detail: { key, isQuota, message: (err as Error)?.message ?? "unknown" },
        }),
      );
    } catch {
      /* event dispatch failures are silent on purpose */
    }
  }
}

/**
 * Estimate of the bytes used by a single LS key, in bytes.
 * Useful for /settings or /founder dashboards to surface "you're using X / 5MB."
 */
export function getStorageUsageBytes(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Blob([raw]).size : 0;
  } catch {
    return 0;
  }
}

/**
 * Total bytes used by ALL passpilot.* keys. Approximate — counts UTF-16
 * char width as 2 bytes (browser actuals vary).
 */
export function getTotalPassPilotStorageBytes(): number {
  if (typeof window === "undefined") return 0;
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("passpilot.")) continue;
      const raw = localStorage.getItem(key);
      if (raw) total += new Blob([raw]).size;
    }
    return total;
  } catch {
    return 0;
  }
}
