import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy · PassPilot",
  description: "How PassPilot handles your data. Spoiler: we don't collect any.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <Container className="py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to PassPilot
        </Link>

        <article className="prose prose-invert max-w-2xl">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 mb-8">
            <p className="text-emerald-200 font-semibold mb-1">TL;DR</p>
            <p className="text-emerald-200/90 text-sm m-0">
              PassPilot stores your study progress on your device only. We don&apos;t collect, track,
              sell, or share personal data. No ads. No analytics trackers. No third-party sign-ins.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-3">What PassPilot stores</h2>
          <p>
            PassPilot saves your study progress—exam selection, diagnostic results, question history,
            readiness score, streak, and preferences—in your device&apos;s local storage
            (<code className="text-cyan-400">localStorage</code> on web, equivalent on-device storage
            on mobile). This data never leaves your device unless you explicitly trigger an action
            that requires it (e.g., redeeming a license key).
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3">What we don&apos;t collect</h2>
          <ul className="space-y-2">
            <li>No personal identifiers (name, phone, address)</li>
            <li>No device identifiers for advertising</li>
            <li>No location data</li>
            <li>No contact list, photos, microphone, or camera access</li>
            <li>No behavior tracking across other apps or websites</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-3">Payments &amp; license keys</h2>
          <p>
            Purchases are processed by{" "}
            <a
              href="https://www.lemonsqueezy.com/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Lemon Squeezy
            </a>
            , our payment processor. When you purchase, Lemon Squeezy collects the minimum data
            required to complete the transaction (email, payment info, billing address). See
            Lemon Squeezy&apos;s{" "}
            <a
              href="https://www.lemonsqueezy.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              privacy policy
            </a>{" "}
            for details. PassPilot itself only stores the resulting license key (entered by you on the
            Redeem screen) locally on your device.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3">AI features (optional)</h2>
          <p>
            PassPilot&apos;s optional AI features (e.g., &quot;explain this answer&quot;) send the
            specific question and answer to Google&apos;s Gemini API for generation. No identifying
            information is attached. You can use the app without triggering any AI calls.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3">Your rights</h2>
          <p>Because we don&apos;t have a server-side account for you, there&apos;s nothing to delete from our systems. To clear your data:</p>
          <ul className="space-y-2">
            <li>
              <strong>On web:</strong> open your browser&apos;s site settings and clear site data for
              PassPilot, or use the &quot;Reset app&quot; option in Settings.
            </li>
            <li>
              <strong>On mobile:</strong> uninstall the app, or use &quot;Reset app&quot; in Settings.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-3">Who can use PassPilot</h2>
          <p>
            PassPilot is intended for users 13 and older. We do not knowingly
            collect personal information from children under 13.
          </p>
          <p className="mt-3">
            If you&apos;re a parent or guardian and believe your child under 13 has
            created a PassPilot account, email{" "}
            <a href="mailto:privacy@passpilot.app" className="text-cyan-400 hover:underline">
              privacy@passpilot.app
            </a>
            . We will:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Close the account within 24 hours</li>
            <li>Delete all associated data within 7 days</li>
            <li>Refund any purchases regardless of usage</li>
            <li>Confirm completion in writing</li>
          </ul>
          <p className="mt-3">
            This complies with the Children&apos;s Online Privacy Protection Act
            (COPPA) [15 USC §6502] and the FTC COPPA Rule [16 CFR Part 312].
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            EU/UK users: under GDPR-K [GDPR Art 8 + UK ICO Children&apos;s Code], the
            minimum age in some jurisdictions is 16. PassPilot&apos;s 13+ policy may
            not satisfy your local rules. EU/UK users under 16 should use PassPilot
            only with parent/guardian permission. See our{" "}
            <a href="/aup#age-requirement" className="text-cyan-400 hover:underline">
              Acceptable Use Policy
            </a>{" "}
            for the full age-requirement framework.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3">Changes to this policy</h2>
          <p>
            If we ever change how PassPilot handles data (e.g., adding accounts or server-side sync),
            we&apos;ll update this page and notify users in-app before the change takes effect.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-3">Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:hello@passpilot.app" className="text-cyan-400 hover:underline">
              hello@passpilot.app
            </a>
            .
          </p>
        </article>
      </Container>
    </main>
  );
}
