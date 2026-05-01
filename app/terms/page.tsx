import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service · PassPilot",
  description: "The agreement between you and PassPilot.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">1. What PassPilot is</h2>
          <p>
            PassPilot is a study aid for IT certification exams (Microsoft AZ-900, AWS Cloud
            Practitioner, Microsoft MS-900, and additional certifications added over time). PassPilot
            is independent and not affiliated with, endorsed, or sponsored by Microsoft, Amazon Web
            Services, Google, CompTIA, or any certification body. All trademarks belong to their respective owners.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">1.5 Eligibility</h2>
          <p>
            You must be at least 13 years old to use PassPilot. By creating an
            account or purchasing a license, you represent that you are 13 or
            older. We do not knowingly collect personal information from
            children under 13 [15 USC §6502]. If we learn an account belongs
            to a child under 13, we close it and delete the data per our{" "}
            <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>.
          </p>
          <p className="mt-3">
            If you are between 13 and 18 (or your jurisdiction&apos;s age of
            majority), you may use PassPilot only with parent or guardian
            permission. The parent or guardian is bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">2. No guarantee of exam results</h2>
          <p>
            PassPilot helps you prepare. We don&apos;t guarantee you&apos;ll pass any exam. Your
            actual exam performance depends on many factors outside our control. Use PassPilot
            alongside official study materials.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">3. Purchases &amp; refunds</h2>
          <ul className="space-y-2">
            <li>Purchases are processed by Lemon Squeezy, our payment processor.</li>
            <li>
              <strong>Refund policy:</strong> PassPilot ships under a Pass Guarantee.
              The full terms — eligibility, usage thresholds, claim window, and the
              EU Article 16(m) consent waiver for digital content — live at{" "}
              <a href="/refunds" className="text-cyan-400 hover:underline">
                passpilot.app/refunds
              </a>
              . The /refunds page is the binding policy. Email{" "}
              <a href="mailto:hello@passpilot.app" className="text-cyan-400 hover:underline">
                hello@passpilot.app
              </a>{" "}
              with your license key to file a claim.
            </li>
            <li>
              Subscriptions auto-renew unless cancelled. You can cancel any time from your Lemon
              Squeezy customer portal (link sent in your purchase email).
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-3">4. License keys</h2>
          <p>
            Your license key is personal and non-transferable. Sharing license keys may result in
            revocation without refund. Lost keys: email support with your purchase email and
            we&apos;ll resend.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">5. Acceptable use</h2>
          <p>
            Use PassPilot for your own cert prep. Don&apos;t share licenses, dump
            questions, automate against the app, or abuse the Pass Guarantee.
            The full rules are in our{" "}
            <a href="/aup" className="text-cyan-400 hover:underline">Acceptable Use Policy</a>
            . Violations can result in license revocation, account ban, or legal action.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">6. Content accuracy</h2>
          <p>
            Exam content and scoring are based on published exam blueprints as of the current year.
            Certification bodies update their exams periodically; we do our best to stay current but
            can&apos;t guarantee exact real-time alignment.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">7. Limitation of liability</h2>
          <p>
            PassPilot is provided &quot;as is.&quot; To the maximum extent allowed by law, we&apos;re
            not liable for any indirect, incidental, or consequential damages arising from use of the
            app, including failed exams or lost study time.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">8. Changes</h2>
          <p>
            We may update these terms. Significant changes will be announced in-app. Continued use
            after changes means you accept the updated terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-3">9. Contact</h2>
          <p>
            <a href="mailto:hello@passpilot.app" className="text-cyan-400 hover:underline">
              hello@passpilot.app
            </a>
          </p>
        </article>
      </Container>
    </main>
  );
}
