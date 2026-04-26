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

export const metadata: Metadata = {
  title: "PassPilot — Pass your cert with the smart study plan",
  description:
    "AI-driven exam prep that finds your weak spots, measures pass-readiness, and tells you what to study today — not just more.",
  applicationName: "PassPilot",
  keywords: [
    "AZ-900",
    "certification",
    "cloud exam",
    "adaptive study",
    "pass readiness",
  ],
  openGraph: {
    title: "PassPilot — Don't just study more. Study what matters most.",
    description:
      "AI-driven pass-readiness for certifications. Diagnostic, daily plan, rescue mode.",
    type: "website",
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
