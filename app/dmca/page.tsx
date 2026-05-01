import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import { Mail, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "DMCA / Copyright Policy · PassPilot",
  description:
    "How to report copyrighted material on PassPilot, file a counter-notice, or appeal a takedown.",
};

export default function DmcaPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              DMCA / Copyright Policy
            </h1>
            <p className="mt-2 text-muted-foreground">
              We respect copyright. Send a takedown notice and we act on it within 10 business days.
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
              PassPilot respects copyright. If your work is on this site without
              permission, send a takedown notice and we'll act on it within 10 business days.
              If your content was removed and you think we got it wrong, send a
              counter-notice. Repeat infringers get banned. We comply with [DMCA 17 USC §512].
            </p>
          </div>

          {/* Audience */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Who this policy is for</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
              <li>
                <strong>Rightsholders</strong> — exam vendors, certification bodies, authors,
                or anyone who believes their copyrighted material appears in PassPilot's
                question bank, study guides, AI explanations, or other content without authorization.
              </li>
              <li>
                <strong>PassPilot users</strong> — anyone whose content was removed in
                response to a DMCA notice and believes the removal was wrong.
              </li>
            </ol>
            <p className="text-sm text-foreground/90">
              PassPilot stores almost no user-generated content (study notes are
              local-storage only, never uploaded). Most DMCA traffic on this site will be
              inbound takedown notices from rightsholders aimed at our question bank or
              explanations — not outbound takedowns of user content.
            </p>
          </section>

          {/* Filing a takedown */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" /> Filing a takedown notice (rightsholders)
            </h2>
            <p className="text-sm text-muted-foreground">
              Per [DMCA 17 USC §512(c)(3)], a valid takedown notice must include all of the
              following. Notices missing any element are non-compliant and may be ignored.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
              <li><strong>Identification of the copyrighted work.</strong> Description of the work claimed infringed. If multiple works, a representative list is acceptable.</li>
              <li><strong>Identification of the infringing material.</strong> Specific URL(s), question ID(s), or page references on PassPilot. Be specific — "your whole question bank" is not actionable.</li>
              <li><strong>Your contact information.</strong> Full legal name, mailing address, telephone, email.</li>
              <li><strong>Good-faith statement.</strong> A statement that you have a good-faith belief the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
              <li><strong>Accuracy statement under penalty of perjury.</strong> A statement that the information is accurate, and under penalty of perjury, that you are the copyright owner or authorized to act on the owner's behalf.</li>
              <li><strong>Signature.</strong> Physical or electronic signature of the copyright owner or authorized agent.</li>
            </ol>

            <div className="rounded-xl border bg-card p-4 text-sm">
              <p className="font-semibold mb-2">Send to PassPilot's DMCA agent:</p>
              <div className="font-mono text-xs leading-relaxed text-foreground/80">
                Galtrix LLC, Attn: DMCA Agent
                <br />
                {`{Address Line 1}`}
                <br />
                San Juan, PR 00xxx
                <br />
                Email: <a href="mailto:dmca@passpilot.app" className="underline">dmca@passpilot.app</a>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              ⚠️ DMCA agent registration with the US Copyright Office at dmca.copyright.gov is required for §512 safe-harbor protection ($6/yr renewal). This page is binding once agent registration completes.
            </p>
          </section>

          {/* What happens next */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">What happens after we receive a notice</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
              <li><strong>Acknowledgment within 5 business days</strong> — we confirm receipt and start review.</li>
              <li><strong>Review for compliance</strong> with [§512(c)(3)] — if any required element is missing, we reply asking for it. The clock pauses until we receive the complete notice.</li>
              <li><strong>Action within 10 business days</strong> of a compliant notice — if the claim is facially valid, we remove or disable access to the identified material and notify the user/contributor (if any).</li>
              <li><strong>Counter-notification window</strong> — if the user disputes via counter-notice, we restore the material in 10–14 business days unless the rightsholder files suit.</li>
            </ol>
          </section>

          {/* Counter-notice */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Filing a counter-notification (users)</h2>
            <p className="text-sm text-foreground/90">
              If your content was removed and you believe the takedown was a mistake or
              misidentification, you may file a counter-notice per [DMCA 17 USC §512(g)].
              A valid counter-notice must include:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground/90">
              <li><strong>Identification of the removed material</strong> and where it appeared before removal.</li>
              <li><strong>Statement under penalty of perjury</strong> that you have a good-faith belief the material was removed by mistake or misidentification.</li>
              <li><strong>Your contact information</strong> — name, address, phone, email.</li>
              <li><strong>Consent to jurisdiction</strong> — a statement consenting to the federal district court where you reside (or, if outside the US, the District of Puerto Rico), and that you will accept service of process from the rightsholder.</li>
              <li><strong>Signature</strong> — physical or electronic.</li>
            </ol>
            <p className="text-sm text-foreground/90">
              Send counter-notices to the same DMCA agent address above. We forward them
              to the original complainant. If they don't file suit within 10–14 business
              days, we restore the material. We don't decide who's right — the courts do.
            </p>
          </section>

          {/* Repeat infringer */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Repeat-infringer policy</h2>
            <p className="text-sm text-foreground/90">
              Per [DMCA 17 USC §512(i)], we maintain a policy to terminate accounts of
              users who are repeat infringers. PassPilot's threshold:
            </p>
            <div className="rounded-xl border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Strike</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="p-3 font-medium">Strike 1</td><td className="p-3">Warning + content removed</td></tr>
                  <tr><td className="p-3 font-medium">Strike 2</td><td className="p-3">30-day account suspension + content removed</td></tr>
                  <tr><td className="p-3 font-medium text-rose-700 dark:text-rose-300">Strike 3</td><td className="p-3">Permanent account termination, no refund. Repeat license-key purchases under new emails are also terminated when identified.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic">
              A "verified" takedown means a takedown notice we acted on AND was not
              successfully reversed by counter-notice within the statutory window.
              Bad-faith or fraudulent takedown notices (per §512(f)) do not count as strikes.
            </p>
          </section>

          {/* Bad faith notices */}
          <section className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/10 p-5 text-sm space-y-2">
            <h2 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" /> Bad-faith / fraudulent notices
            </h2>
            <p className="text-foreground/90">
              Per [DMCA 17 USC §512(f)], anyone who knowingly materially misrepresents
              that material is infringing (in a takedown notice) or that material was
              removed by mistake (in a counter-notice) is liable for damages, including
              attorneys' fees.
            </p>
            <p className="text-foreground/90">
              We will pursue §512(f) liability against parties who file fraudulent
              takedown notices to suppress legitimate content (e.g. competitors filing
              fake notices to disrupt PassPilot's question bank).
            </p>
          </section>

          {/* What's covered */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">What's covered</h2>
            <p className="text-sm text-foreground/90">DMCA notices about PassPilot may concern:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/90">
              <li><strong>Question bank content</strong> — if you are a certification vendor (Microsoft, AWS, Google, CompTIA, Cisco, etc.) and believe a PassPilot question copies your proprietary exam content verbatim. PassPilot writes original questions targeting the same skills measured by certification exams; verbatim copying is forbidden by our internal content process.</li>
              <li><strong>AI-generated explanations</strong> — generated "why this is wrong" content is generative output. If a generated explanation reproduces a specific copyrighted passage, file a notice.</li>
              <li><strong>Marketing / homepage content</strong> — screenshots, copy, or imagery alleged to copy your work.</li>
              <li><strong>User notes</strong> — minimal scope; PassPilot stores user notes only in device local storage. Most DMCA notices targeting "user content" will be unactionable for technical reasons.</li>
            </ul>
          </section>

          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">What this doesn't cover</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Trademark complaints</strong> — separate process. Email <a href="mailto:legal@passpilot.app" className="underline">legal@passpilot.app</a>.</li>
              <li><strong>Right-of-publicity / defamation</strong> — separate process; not DMCA. Same contact.</li>
              <li><strong>Disputes about ideas, facts, or methods</strong> — copyright protects expression, not ideas. Teaching the same concepts as a vendor's exam is not actionable; copying expression is.</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Contact
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              DMCA notices: <a href="mailto:dmca@passpilot.app" className="underline">dmca@passpilot.app</a>
              {" · "}
              Trademark/general legal: <a href="mailto:legal@passpilot.app" className="underline">legal@passpilot.app</a>
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}
