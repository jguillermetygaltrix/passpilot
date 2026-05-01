import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import { Cookie, ShieldCheck, Mail, Smartphone } from "lucide-react";

export const metadata = {
  title: "Cookie Policy · PassPilot",
  description:
    "What cookies PassPilot uses, why, and how to control them. Short list, no surveillance.",
};

interface CookieDef {
  name: string;
  purpose: string;
  retention: string;
  consent: "Required" | "Not required";
}

const necessaryCookies: CookieDef[] = [
  { name: "passpilot.theme", purpose: "Remember your light/dark mode preference.", retention: "1 year", consent: "Not required" },
];
const functionalCookies: CookieDef[] = [
  { name: "passpilot.cookie-consent", purpose: "Record your cookie banner choice so we don't ask again.", retention: "1 year", consent: "Not required" },
];

export default function CookiesPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Cookie Policy
            </h1>
            <p className="mt-2 text-muted-foreground">
              Short list. No surveillance. Most things stay on your device.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-30 · Version 1.0
            </p>
          </header>

          {/* Short version */}
          <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 dark:border-emerald-500/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Short version
            </h2>
            <p className="mt-3 text-sm text-foreground/90">
              PassPilot uses very few cookies — the minimum needed to keep the
              app working. No advertising trackers, no behavior surveillance,
              no third-party analytics. We comply with [GDPR Art 6 + ePrivacy Directive].
            </p>
          </div>

          {/* What's a cookie */}
          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Cookie className="h-5 w-5" /> What's a cookie
            </h2>
            <p>
              A cookie is a small text file a website saves on your browser. We use
              "cookie" loosely to also include <em>localStorage</em> entries (similar
              concept; different storage). PassPilot relies almost entirely on
              localStorage for your study progress — that's why this list is short.
            </p>
          </section>

          {/* Categories */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Categories we use</h2>

            <CategoryBlock
              title="Strictly necessary"
              consent="Always on"
              consentTone="emerald"
              description="Required for PassPilot to function. We don't ask consent for these because the app literally won't work without them. [ePrivacy Directive Art 5(3) exemption]"
              cookies={necessaryCookies}
            />
            <CategoryBlock
              title="Functional"
              consent="Always on"
              consentTone="emerald"
              description="Remember preferences across visits — e.g. your accepted cookie banner choice. Not strictly required, but breaks UX without them."
              cookies={functionalCookies}
            />
            <CategoryBlock
              title="Performance"
              consent="None today"
              consentTone="muted"
              description="No performance / analytics cookies. PassPilot ships with zero analytics trackers as of 2026-04-30. If we ever add any, you'll see them here + a banner asking consent."
              cookies={[]}
            />
            <CategoryBlock
              title="Marketing"
              consent="None — ever"
              consentTone="rose"
              description="No marketing cookies. No advertising IDs. No Facebook Pixel, no Google Ads. We don't want them, and you didn't ask for them."
              cookies={[]}
            />
          </section>

          {/* Control */}
          <section className="space-y-3 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">How to control cookies</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Accept / reject</strong> — use the cookie banner shown on first
                visit to choose. Your choice persists for 1 year.
              </li>
              <li>
                <strong>Change your mind later</strong> — click "Cookie preferences" in
                the footer (when shipped) to re-open the banner.
              </li>
              <li>
                <strong>Browser settings</strong> — every modern browser lets you block or
                clear cookies + localStorage. Doing so will reset your PassPilot
                preferences (theme, study state) since those live there.
              </li>
            </ul>
          </section>

          {/* Mobile */}
          <section className="rounded-xl border bg-card p-5 text-sm space-y-2">
            <h2 className="font-semibold flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Mobile apps
            </h2>
            <p className="text-foreground/90">
              The PassPilot iOS and Android apps don't use HTTP cookies — they store the
              same data using each platform's local storage (UserDefaults on iOS,
              SharedPreferences on Android). Same purposes, same retention. No tracking SDKs.
            </p>
          </section>

          {/* Changes */}
          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Changes</h2>
            <p>
              If we ever add a new cookie, we'll update this page at least 30 days
              before the change goes live and re-prompt for consent if it falls into
              Performance or Marketing.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Privacy contact
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a>
              {" · "}
              <Link href="/privacy" className="underline">Full Privacy Policy</Link>
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function CategoryBlock({
  title,
  consent,
  consentTone,
  description,
  cookies,
}: {
  title: string;
  consent: string;
  consentTone: "emerald" | "rose" | "muted";
  description: string;
  cookies: CookieDef[];
}) {
  const toneClass =
    consentTone === "emerald"
      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
      : consentTone === "rose"
        ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
        : "bg-muted text-muted-foreground border-border";
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-semibold">{title}</h3>
        <span className={`chip border ${toneClass}`}>{consent}</span>
      </div>
      <p className="text-sm text-foreground/90">{description}</p>
      {cookies.length > 0 && (
        <table className="w-full text-xs border-t pt-2">
          <thead className="text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="text-left py-1">Name</th>
              <th className="text-left py-1">Purpose</th>
              <th className="text-left py-1">Retention</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cookies.map((c) => (
              <tr key={c.name}>
                <td className="py-2 font-mono text-[11px]">{c.name}</td>
                <td className="py-2">{c.purpose}</td>
                <td className="py-2">{c.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
