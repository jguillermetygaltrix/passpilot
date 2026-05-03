#!/usr/bin/env bash
# build-ios-archive.sh — produce a signed iOS .xcarchive ready for TestFlight
#
# Prereqs (one-time):
#   1. Xcode signed in with your Apple Developer account
#      (Xcode → Settings → Accounts → Apple ID → Add)
#   2. Set TEAM_ID env var (10-char Apple Developer Team ID, e.g. "ABCDE12345")
#      Find it: developer.apple.com/account → Membership → Team ID
#
# Usage:
#   TEAM_ID=YOUR_TEAM_ID ./scripts/build-ios-archive.sh
#
# Produces:
#   build/PassPilot.xcarchive — open in Xcode (Window → Organizer) to upload
#   build/PassPilot.ipa       — if exportArchive succeeds (next step)
#
# Then upload to TestFlight via:
#   ./scripts/upload-testflight.sh build/PassPilot.ipa

set -euo pipefail

if [[ -z "${TEAM_ID:-}" ]]; then
  echo "✗ TEAM_ID env var not set."
  echo "  Find your 10-char Apple Developer Team ID at:"
  echo "  https://developer.apple.com/account → Membership → Team ID"
  echo ""
  echo "  Then re-run: TEAM_ID=ABCDE12345 ./scripts/build-ios-archive.sh"
  exit 1
fi

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$PROJECT_DIR/ios/App"
BUILD_DIR="$PROJECT_DIR/build"
ARCHIVE_PATH="$BUILD_DIR/PassPilot.xcarchive"
EXPORT_PATH="$BUILD_DIR"

mkdir -p "$BUILD_DIR"

echo "▸ Step 1: Building Next.js static export"
cd "$PROJECT_DIR"
npm run build

echo ""
echo "▸ Step 2: Capacitor sync to ios/"
npx cap sync ios

echo ""
echo "▸ Step 3: Xcode archive (Release config, automatic signing, Team=$TEAM_ID)"
cd "$IOS_DIR"
xcodebuild \
  -project App.xcodeproj \
  -scheme App \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  archive

echo ""
echo "▸ Step 4: Export .ipa for App Store distribution"
# Generate ExportOptions.plist on the fly
cat > "$BUILD_DIR/ExportOptions.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>teamID</key>
  <string>$TEAM_ID</string>
  <key>uploadBitcode</key>
  <false/>
  <key>uploadSymbols</key>
  <true/>
  <key>signingStyle</key>
  <string>automatic</string>
</dict>
</plist>
EOF

xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist" \
  -allowProvisioningUpdates

echo ""
echo "✓ Archive ready: $ARCHIVE_PATH"
echo "✓ IPA ready:     $BUILD_DIR/App.ipa"
echo ""
echo "Next:"
echo "  • Open in Organizer:  open $ARCHIVE_PATH"
echo "  • Upload via altool:  ./scripts/upload-testflight.sh $BUILD_DIR/App.ipa"
echo "  • Or from Xcode:      Window → Organizer → Distribute App → App Store Connect"
