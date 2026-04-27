import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { NativeBootstrap } from "@/components/native-bootstrap";
import { DeviceRegistry } from "@/components/device-registry";
import { BadgeToastHost } from "@/components/badge-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const OG_IMAGE = "/og-cover.png"; // 1200×630, drop a file at public/og-cover.png

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
      "Diagnostic + daily plan + spaced-repetition + voice-mode + mock exams. 7 certs across Microsoft, AWS, GCP, CompTIA. $19.99 one-time.",
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
      "AI-driven cert prep — diagnostic, daily plan, spaced repetition, voice mode, mock exams. 7 certs, $19.99 one-time.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // honor iOS notch/home-indicator via env(safe-area-inset-*)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans">
        <NativeBootstrap />
        <DeviceRegistry />
        {children}
        <CommandPalette />
        <BadgeToastHost />
      </body>
    </html>
  );
}
