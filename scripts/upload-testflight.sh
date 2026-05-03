#!/usr/bin/env bash
# upload-testflight.sh — push a built .ipa to App Store Connect / TestFlight
#
# Prereqs (one-time):
#   1. Generate App Store Connect API key:
#      https://appstoreconnect.apple.com/access/api → "+" → name + Developer access
#   2. Download the .p8 file (only available ONCE)
#   3. Note the Key ID + Issuer ID
#   4. Export env vars:
#      export ASC_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_ABCD1234.p8
#      export ASC_KEY_ID=ABCD1234
#      export ASC_ISSUER_ID=01234567-89ab-cdef-0123-456789abcdef
#
# Usage:
#   ./scripts/upload-testflight.sh build/App.ipa
#
# After successful upload (~2-5 min):
#   • App Store Connect → My Apps → PassPilot → TestFlight tab
#   • Build appears in "Processing" for 15-30 min, then "Ready to Submit"
#   • Add internal testers (you, Edwin, Yiram) via TestFlight tab
#   • External testers go through Beta App Review (~24h)

set -euo pipefail

IPA_PATH="${1:-}"

if [[ -z "$IPA_PATH" ]]; then
  echo "✗ Usage: ./scripts/upload-testflight.sh path/to/App.ipa"
  echo "  Build one first with: TEAM_ID=YOUR_ID ./scripts/build-ios-archive.sh"
  exit 1
fi

if [[ ! -f "$IPA_PATH" ]]; then
  echo "✗ IPA not found at: $IPA_PATH"
  exit 1
fi

if [[ -z "${ASC_KEY_PATH:-}" || -z "${ASC_KEY_ID:-}" || -z "${ASC_ISSUER_ID:-}" ]]; then
  echo "✗ App Store Connect API credentials not set."
  echo ""
  echo "  One-time setup:"
  echo "    1. Generate key at https://appstoreconnect.apple.com/access/api"
  echo "    2. Download AuthKey_*.p8 (only available once — keep safe)"
  echo "    3. Note Key ID + Issuer ID"
  echo "    4. Export env vars:"
  echo "       export ASC_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_XXX.p8"
  echo "       export ASC_KEY_ID=XXXXXXXXXX"
  echo "       export ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000"
  exit 1
fi

echo "▸ Validating IPA signature + entitlements"
xcrun altool \
  --validate-app \
  --file "$IPA_PATH" \
  --type ios \
  --apiKey "$ASC_KEY_ID" \
  --apiIssuer "$ASC_ISSUER_ID"

echo ""
echo "▸ Uploading to App Store Connect (this can take 2-5 min)"
xcrun altool \
  --upload-app \
  --file "$IPA_PATH" \
  --type ios \
  --apiKey "$ASC_KEY_ID" \
  --apiIssuer "$ASC_ISSUER_ID"

echo ""
echo "✓ Upload complete."
echo "  Track processing at https://appstoreconnect.apple.com/apps"
echo "  Build will be available in TestFlight in 15-30 min."
