#!/usr/bin/env node
/**
 * generate-brand-assets.mjs
 *
 * Renders the PassPilot brand mark to source PNGs for @capacitor/assets to
 * derive all the iOS/Android icon + splash sizes.
 *
 * Inputs (none — SVG is inlined here, kept in sync with components/app-nav.tsx
 *          Logo component):
 *   - Gradient: brand-500 (#3d60ff) → brand-700 (#1d31db), top-left to bottom-right
 *   - Pencil icon: Lucide pencil (3 white stroke paths in 24x24 viewBox)
 *   - Background for splash: #0B0D13 (Galtrix dark navy)
 *
 * Outputs:
 *   - assets/icon.png        1024×1024  — full-bleed gradient + pencil (no rounded
 *                                          corners — iOS adds them at runtime)
 *   - assets/icon-only.png   1024×1024  — same as icon.png (for android adaptive)
 *   - assets/splash.png      2732×2732  — logo (~720px) centered on dark navy
 *   - assets/splash-dark.png 2732×2732  — same as splash.png (already dark)
 *
 * Usage:
 *   node scripts/generate-brand-assets.mjs
 *   npx capacitor-assets generate --ios
 *   npx cap sync ios
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS_DIR = join(ROOT, "assets");

// Pencil paths from Lucide (matches components/app-nav.tsx Logo)
const PENCIL_PATHS = `
  <path d="M3 21l6-6" />
  <path d="M21 3L9 15l-3-3L21 3z" />
  <path d="M17 7l-4 4" />
`;

/**
 * SVG for the icon — full-bleed gradient square with a pencil icon centered.
 * iOS will mask the corners on the home-screen icon automatically.
 */
function iconSvg(size) {
  // Pencil scales with size — ~50% of canvas
  const pencilSize = Math.round(size * 0.5);
  const pencilOffset = Math.round((size - pencilSize) / 2);
  // Stroke scales too — keep proportionally chunky
  const strokeWidth = Math.max(2.4, (24 / pencilSize) * size * 0.04);

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3d60ff" />
          <stop offset="100%" stop-color="#1d31db" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#brand)" />
      <g transform="translate(${pencilOffset}, ${pencilOffset})">
        <svg width="${pencilSize}" height="${pencilSize}" viewBox="0 0 24 24"
             fill="none" stroke="white" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round">
          ${PENCIL_PATHS}
        </svg>
      </g>
    </svg>
  `;
}

/**
 * SVG for the splash — dark navy bg, logo as a rounded square in the center.
 * The rounded square here mimics the in-app Logo component's `rounded-xl`
 * (~12.5% corner radius).
 */
function splashSvg(size) {
  const logoSize = Math.round(size * 0.26); // ~720px on a 2732 canvas
  const logoOffset = Math.round((size - logoSize) / 2);
  const cornerRadius = Math.round(logoSize * 0.18); // softer than iOS app icon
  const pencilSize = Math.round(logoSize * 0.5);
  const pencilOffset = Math.round((logoSize - pencilSize) / 2);

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3d60ff" />
          <stop offset="100%" stop-color="#1d31db" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="${Math.round(logoSize * 0.06)}" />
        </filter>
      </defs>
      <rect width="${size}" height="${size}" fill="#0B0D13" />
      <!-- subtle glow behind the logo -->
      <rect x="${logoOffset}" y="${logoOffset}" width="${logoSize}" height="${logoSize}"
            rx="${cornerRadius}" ry="${cornerRadius}"
            fill="url(#brand)" opacity="0.45" filter="url(#glow)" />
      <!-- the logo itself -->
      <rect x="${logoOffset}" y="${logoOffset}" width="${logoSize}" height="${logoSize}"
            rx="${cornerRadius}" ry="${cornerRadius}" fill="url(#brand)" />
      <g transform="translate(${logoOffset + pencilOffset}, ${logoOffset + pencilOffset})">
        <svg width="${pencilSize}" height="${pencilSize}" viewBox="0 0 24 24"
             fill="none" stroke="white" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round">
          ${PENCIL_PATHS}
        </svg>
      </g>
    </svg>
  `;
}

async function render(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`  ✓ ${outPath}`);
}

async function main() {
  await mkdir(ASSETS_DIR, { recursive: true });
  console.log(`Generating brand assets → ${ASSETS_DIR}`);

  await render(iconSvg(1024), join(ASSETS_DIR, "icon.png"));
  await render(iconSvg(1024), join(ASSETS_DIR, "icon-only.png"));
  await render(splashSvg(2732), join(ASSETS_DIR, "splash.png"));
  await render(splashSvg(2732), join(ASSETS_DIR, "splash-dark.png"));

  console.log("\nDone. Next:");
  console.log("  npx capacitor-assets generate --ios");
  console.log("  npx cap sync ios");
}

main().catch((err) => {
  console.error("✗ Failed:", err);
  process.exit(1);
});
