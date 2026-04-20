import Link from "next/link";
import { Container } from "@/components/container";
import { ArrowLeft, Mail, MessageCircle, Key, Bug } from "lucide-react";

export const metadata = {
  title: "Support · PassPilot",
  description: "Get help with PassPilot.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <Container className="py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to PassPilot
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-2">Support</h1>
          <p className="text-gray-400 mb-10">We answer every email within 24 hours.</p>

          <div className="grid gap-4">
            <SupportCard
              icon={<Mail className="w-5 h-5 text-cyan-400" />}
              title="Email us"
              body="Fastest way to reach a human. Include your license key if the issue relates to a paid account."
              action={{ label: "hello@passpilot.app", href: "mailto:hello@passpilot.app" }}
            />

            <SupportCard
              icon={<Key className="w-5 h-5 text-emerald-400" />}
              title="Lost your license key?"
              body="Email us with the address you used at checkout and we'll resend."
              action={{ label: "Request resend", href: "mailto:hello@passpilot.app?subject=Lost%20license%20key" }}
            />

            <SupportCard
              icon={<MessageCircle className="w-5 h-5 text-amber-400" />}
              title="Refund request"
              body="Full refund within 14 days if you haven't used the license."
              action={{ label: "Request refund", href: "mailto:hello@passpilot.app?subject=Refund%20request" }}
            />

            <SupportCard
              icon={<Bug className="w-5 h-5 text-red-400" />}
              title="Found a bug?"
              body="Send us the device + browser + what you were doing. Screenshots help."
              action={{ label: "Report a bug", href: "mailto:hello@passpilot.app?subject=Bug%20report" }}
            />
          </div>

          <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold mb-3">Common questions</h3>
            <div className="space-y-4 text-sm">
              <FAQ
                q="Why don't I see all my progress on a new device?"
                a="PassPilot stores your progress on the device you studied on. We don't have cloud sync yet. Redeeming your license key on a new device unlocks paid features, but study history stays per-device."
              />
              <FAQ
                q="Can I switch which exam I'm studying?"
                a="Yes. Settings → change exam. Multi-Cert license holders can switch freely. Pro license holders are tied to the exam they purchased for."
              />
              <FAQ
                q="Is there a mobile app?"
                a="Web version is live. iOS and Android apps are coming soon — same license key will unlock both."
              />
              <FAQ
                q="Do I need internet to use PassPilot?"
                a="Mostly no. Questions and lessons work offline once loaded. License validation and optional AI features need a connection."
              />
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span className="mx-2">·</span>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

function SupportCard({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-white/5 p-2">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-400 mb-3">{body}</p>
          <a href={action.href} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            {action.label} →
          </a>
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer font-medium text-white flex items-center justify-between list-none">
        <span>{q}</span>
        <span className="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <p className="mt-2 text-gray-400 leading-relaxed">{a}</p>
    </details>
  );
}
