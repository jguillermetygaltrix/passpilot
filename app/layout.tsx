import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { NativeBootstrap } from "@/components/native-bootstrap";
import { DeviceRegistry } from "@/components/device-registry";
import { BadgeToastHost } from "@/components/badge-toast";
import { CookieBanner } from "@/components/cookie-banner";
import { SplashKiller } from "@/components/splash-killer";
import { EXAMS } from "@/lib/data/exams";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const OG_IMAGE = "/og-cover.png"; // 1200×630, drop a file at public/og-cover.png

// Catalog-driven so cert count + vendor list never drift when Boss adds an exam.
const CERT_COUNT = EXAMS.length;
const VENDOR_LIST = Array.from(new Set(EXAMS.map((e) => e.vendor))).join(", ");
// Pricing copy — kept short so OG cards don't truncate.
// Real tiers wired in lib/licensing.ts: Pro per-cert $19.99 · Multi-Cert (all 7) $39.
// Keep this in sync with PRICES in lib/licensing.ts so OG / Twitter cards
// never claim a price the checkout doesn't honor.
const PRICE_LINE = "$19.99 per cert · $39 for all 7";

export const metadata: Metadata = {
  metadataBase: new URL("https://passpilot.app"),
  title: "PassPilot — Pass your cert with the smart study plan",
  description:
    "AI-driven exam prep that finds your weak spots, measures pass-readiness, and tells you what to study today — not just more.",
  applicationName: "PassPilot",
  keywords: [
    "AZ-900",
    "AWS CCP",
    "MS-900",
    "AI-900",
    "Security+",
    "AWS AIP",
    "GCP CDL",
    "certification",
    "cloud exam",
    "adaptive study",
    "pass readiness",
    "spaced repetition",
    "mock exam",
  ],
  openGraph: {
    title: "PassPilot — Pass your cert. Actually pass it.",
    description:
      `Diagnostic + daily plan + spaced-repetition + voice-mode + mock exams. ${CERT_COUNT} certs across ${VENDOR_LIST}. ${PRICE_LINE}.`,
    type: "website",
    siteName: "PassPilot",
    url: "https://passpilot.app",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "PassPilot — pass-readiness for cert prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PassPilot — Pass your cert. Actually pass it.",
    description:
      `AI-driven cert prep — diagnostic, daily plan, spaced repetition, voice mode, mock exams. ${CERT_COUNT} certs, ${PRICE_LINE}.`,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // honor iOS notch/home-indicator via env(safe-area-inset-*)
};

// No-flash dark-mode script — runs in <head> BEFORE React hydrates, so the
// page paints with the right theme on first frame (no FOUC). The toggle
// component (ThemeToggle) syncs React state to whatever this set.
const NO_FLASH_THEME_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('passpilot.theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (!stored && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* dangerouslySetInnerHTML is intentional — this script must run
            synchronously before paint to avoid a light-flash on dark-mode users. */}
        <script
          dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }}
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <SplashKiller />
        <NativeBootstrap />
        <DeviceRegistry />
        {children}
        <CommandPalette />
        <BadgeToastHost />
        <CookieBanner />
      </body>
    </html>
  );
}
