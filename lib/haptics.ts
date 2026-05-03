/**
 * Haptic feedback wrapper — silent no-op on web, real iOS Taptic Engine
 * + Android vibration on native. Gives the app a "real native" feel
 * during high-frequency interactions like answering questions or
 * picking certs.
 *
 * Three intensity tiers:
 *   - tap()      Light/selection feedback — chip/card/option taps
 *   - confirm()  Medium impact — Continue, Submit, Auto-advance
 *   - success()  Notification-success — Correct answer, badge unlock
 *   - error()    Notification-error — Wrong answer, validation fail
 *
 * Dynamic import keeps the @capacitor/haptics plugin out of the web
 * bundle entirely. Errors are swallowed — haptics are nice-to-have,
 * never block UX.
 *
 * Usage:
 *   import { tap, confirm, success, error } from "@/lib/haptics";
 *   await tap();
 */

type ImpactStyle = "Light" | "Medium" | "Heavy";
type NotificationType = "Success" | "Warning" | "Error";

async function impact(style: ImpactStyle): Promise<void> {
  try {
    const mod = await import("@capacitor/haptics");
    const styleEnum = mod.ImpactStyle[style];
    await mod.Haptics.impact({ style: styleEnum });
  } catch {
    // Plugin unavailable on web or pre-pod-install — silent no-op.
  }
}

async function notify(type: NotificationType): Promise<void> {
  try {
    const mod = await import("@capacitor/haptics");
    const typeEnum = mod.NotificationType[type];
    await mod.Haptics.notification({ type: typeEnum });
  } catch {
    /* same */
  }
}

async function selection(): Promise<void> {
  try {
    const mod = await import("@capacitor/haptics");
    await mod.Haptics.selectionStart();
    await mod.Haptics.selectionChanged();
    await mod.Haptics.selectionEnd();
  } catch {
    /* same */
  }
}

/** Light tap — option pick, chip select, card focus. ~10ms iOS Taptic */
export const tap = () => selection();

/** Medium impact — Continue, Submit, Next. ~20ms iOS Taptic */
export const confirm = () => impact("Medium");

/** Strong success — Correct answer, badge unlock, milestone. iOS notification. */
export const success = () => notify("Success");

/** Strong error — Wrong answer, validation fail, locked content. iOS notification. */
export const error = () => notify("Error");

/** Subtle "tick" — Toggle, switch, time-tick. ~5ms iOS Taptic */
export const tick = () => impact("Light");
