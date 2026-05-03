# PassPilot — Mac Transfer + iOS Scaffold Runbook

Boss bootstrapped the Apple Silicon Mac satellite as the second MARVIN
host on 2026-04-27 (DEC-042). PassPilot now joins it so iOS builds can
happen natively (no Codemagic, no GitHub Actions macOS minutes).

---

## TL;DR — three commands to be working on Mac

```bash
cd ~/Documents/GitHub
git clone git@github.com:jguillermetygaltrix/passpilot.git
cd passpilot && npm install
```

That's the **transfer**. Below is everything you need for the **iOS scaffold**.

---

## Step 1 — Mac prereqs (one-time, ~30 min if Xcode isn't already installed)

| Prereq | Verify | Install if missing |
|---|---|---|
| **Xcode** | `xcode-select -p` → `/Applications/Xcode.app/Contents/Developer` | Mac App Store → Xcode (~10GB, slow) |
| **Xcode CLI tools** | `xcode-select --install` (no-op if installed) | `xcode-select --install` |
| **CocoaPods** | `pod --version` → ≥1.14 | `sudo gem install cocoapods` |
| **Apple ID in Xcode** | Xcode → Settings → Accounts → Galtrix team listed | Sign in with Apple Developer ID |
| **Node 20+** | `node -v` → v20.x | `brew install node` (Homebrew) |

Apple Developer account is paid (DEC-036, 2026-04-26) — should already
show "Apple Developer Program — Active" under your Apple ID once you
sign into Xcode.

---

## Step 2 — Clone + scaffold iOS (~5 min)

```bash
cd ~/Documents/GitHub
git clone git@github.com:jguillermetygaltrix/passpilot.git
cd passpilot

npm install                 # ~2 min
npm run build               # produces out/ for Capacitor
npx cap add ios             # creates ios/ directory + Xcode workspace
npx cap sync                # copies web assets + plugins into iOS project
npx cap open ios            # opens Xcode to ios/App/App.xcworkspace
```

After `cap add ios`, commit the new `ios/` directory:

```bash
git add ios/
git commit -m "chore(ios): scaffold Capacitor iOS project"
git push
```

---

## Step 3 — First Xcode build (~10 min)

In Xcode (after `cap open ios` opens it):

1. **Click `App` in the project navigator** (top of the left sidebar)
2. **Targets → App → Signing & Capabilities tab**
3. **Team:** select Galtrix's team from the dropdown
4. **Bundle Identifier:** confirm it reads `com.galtrix.passpilot` (matches `capacitor.config.ts`)
5. **Top toolbar:** select a simulator (iPhone 15 Pro or similar)
6. **Cmd+R** → builds + launches in simulator

If the build fails on signing, check that Xcode auto-resolved a
provisioning profile. Manual setup if needed:
`https://developer.apple.com/account/resources/profiles/list`

---

## Step 4 — RevenueCat + IAP wiring (separate, can be done after first build)

Already done on the JS side:
- `@revenuecat/purchases-capacitor` is in `package.json`
- `lib/payment/native.ts` has the IAP catalog (4 products: weekly,
  monthly, annual, lifetime) — actually currently only Multi-Cert
  is wired through native; the per-cert Pro tier flows through
  Lemon Squeezy on web

**On RevenueCat dashboard:**
- Create iOS app → bundle ID `com.galtrix.passpilot`
- Link to the App Store Connect app (Step 5)
- Add 4 products matching `NATIVE_CATALOG` in `lib/payment/native.ts`
- Create entitlement `multi` and link to the Multi-Cert product
- Get the `REVENUECAT_PUBLIC_API_KEY_IOS` and add to `.env.local`

---

## Step 5 — App Store Connect setup (Apple-side, ~1-2 hours of clicking)

Go to <https://appstoreconnect.apple.com/apps>:

1. **My Apps → +** → New App
   - Platform: iOS
   - Name: `PassPilot — Pass your cert`
   - Primary language: English (U.S.)
   - Bundle ID: `com.galtrix.passpilot`
   - SKU: `passpilot-ios-1`
   - User Access: Full Access

2. **In-App Purchases** (one-time, lifetime tier):
   - Type: Non-Consumable
   - Reference Name: `PassPilot Multi-Cert Lifetime`
   - Product ID: `passpilot.multi.lifetime` (must match `NATIVE_CATALOG`)
   - Price: $39 USD
   - Display name + description (Quill drafts available at
     `MARVIN/agents/quill/drafts/passpilot-app-store-listing.md`)

3. **Privacy Manifests** (REQUIRED — Apple rejects without these):
   - App Privacy → "Get Started"
   - Walk through data collection types — PassPilot collects:
     - **Usage data:** product interaction (anonymized, on-device only)
     - **Identifiers:** RevenueCat user ID (linked to purchases)
     - **Diagnostics:** none (no crash reporting in v1)
     - **Sensitive Info:** none
   - The `/privacy` page on the live web is the source of truth

4. **Screenshots** (Prism agent has been queued for these — see
   `MARVIN/agents/prism/queue.md`). Required:
   - 6.7" iPhone (Pro Max) — 6 screenshots
   - 6.1" iPhone — same set, scaled
   - iPad Pro 12.9" if shipping iPad simultaneously (not blocking)

5. **App Review Information:**
   - Demo account: not needed (app is free + IAP)
   - Notes: "PassPilot is a cert-prep study app. The diagnostic + 3
     daily drills are free; Multi-Cert IAP unlocks all 7 certs forever."

---

## Step 6 — TestFlight (the goal)

After App Review approves the binary upload:

```bash
# On Mac, build a release archive:
cd ~/Documents/GitHub/passpilot
npm run build
npx cap sync
npx cap open ios
# In Xcode: Product → Archive → Distribute App → App Store Connect → Upload
```

TestFlight processes the build (~15-30 min). Once green, internal
testers (you, Edwin, Yiram) can install via TestFlight app. External
testers go through a separate Beta App Review (~24h).

---

## Troubleshooting (anticipated)

**"No matching profiles found"** — In Xcode → Signing & Capabilities,
ensure "Automatically manage signing" is checked. Apple Dev account
must have an active membership (refresh `developer.apple.com/account`).

**"Pod install fails"** — `cd ios/App && pod repo update && pod install`.
If still failing, delete `ios/App/Podfile.lock` and re-run.

**Web changes don't appear in iOS app** — `npm run build && npx cap sync`
must run after every web change. There's no live reload in Capacitor.

**Localhost API calls fail in iOS** — The static export means there's no
backend server bundled. PassPilot's web layer works because Lemon Squeezy
validation is CORS-enabled. Same logic applies on iOS.

---

## What stays Windows-only

- `android/build-debug-apk.ps1` — PowerShell helper for the Windows
  Android build. No-op on Mac. Mac uses Xcode for iOS instead.
- The Lemon Squeezy product test-mode previews (Boss's existing
  Windows browser sessions) — these don't need to move.

---

## Cross-host git etiquette

When working on Mac AND Windows simultaneously (rare):

- **Commit + push from one host before switching** — PassPilot is a
  simple-trunk workflow (no feature branches yet), so divergent commits
  on each host = manual rebase pain.
- **Pull before starting work** on the other host: `git pull --ff-only`.
- **If you forget:** `git pull --rebase origin main` resolves cleanly
  for non-conflicting changes.

---

## Brain cross-reference

When the Mac side starts iOS work, log it in:
- `MARVIN/brain/decisions/decision_log.md` as the next DEC entry
- `MARVIN/brain/projects/passpilot.md` — bump the iOS status section
- `MARVIN/brain/sessions/YYYY-MM-DD-mac-ios-scaffold.md` — session
  summary including any new build issues encountered

This way the Windows side picks up where the Mac left off automatically.

---

## App Store launch sequence (Mac-side, after iOS scaffold + sim build verified)

The DEC-049 polish sprint locked the codebase + locked all 41 E2E tests.
Once Boss is ready to upload to TestFlight, this is the end-to-end:

### One-time setup (~30 min)

1. **Apple Developer Team ID** — find at
   <https://developer.apple.com/account> → Membership → Team ID.
   Save as `TEAM_ID` env var.
2. **Sign in to Xcode** — Xcode → Settings → Accounts → "+" → Apple ID →
   add the same Apple ID that owns the Developer Program.
3. **App Store Connect API key** (for CLI uploads — skip if uploading
   via Xcode Organizer GUI):
   - <https://appstoreconnect.apple.com/access/api> → "+" → Developer access
   - Download `AuthKey_*.p8` (one-time download, keep safe in
     `~/.appstoreconnect/private_keys/`)
   - Note the Key ID + Issuer ID; export as `ASC_KEY_PATH`,
     `ASC_KEY_ID`, `ASC_ISSUER_ID`
4. **App Store Connect: create app entry** —
   <https://appstoreconnect.apple.com/apps> → "+" → New App
   - Bundle ID: `com.galtrix.passpilot`
   - SKU: `passpilot-ios-1`
   - Name: `PassPilot — Pass your cert`
   - Primary language: English (U.S.)
5. **Privacy + IAP setup in App Store Connect** — see Step 5 of the
   "Step 5 — App Store Connect setup" section above.

### Repeat per release (~5 min)

```bash
# 1. Build the archive (Release config, signed with your Team)
TEAM_ID=YOUR_10CHAR_TEAM_ID ./scripts/build-ios-archive.sh

# 2. Upload to TestFlight (uses ASC API key)
./scripts/upload-testflight.sh build/App.ipa
```

The `scripts/build-ios-archive.sh` script:
- Runs `npm run build` (Next.js static export)
- Runs `npx cap sync ios` (copies web assets into the iOS bundle)
- Runs `xcodebuild archive` with Release config + automatic signing +
  `-allowProvisioningUpdates` so Xcode auto-fetches/refreshes the
  provisioning profile against your Team
- Exports an App-Store-method .ipa via `ExportOptions.plist` generated
  on the fly

The `scripts/upload-testflight.sh` script:
- Validates the .ipa with `xcrun altool --validate-app`
- Uploads to App Store Connect with `xcrun altool --upload-app`
- Build appears in TestFlight tab after 15-30 min of processing

### After upload

- **Internal testers** (Boss + Edwin + Yiram) — add via TestFlight tab,
  install via TestFlight app on iPhone. Available immediately after
  build processes.
- **External testers** — separate Beta App Review (~24h turnaround).
- **App Store submission** — Submit for Review when ready (separate
  full review, ~2-7 days).

### Sanity checks before every upload

```bash
# All E2E tests must pass — locked by .github/workflows/e2e.yml on PR/push
npx playwright test

# Visual regression baselines (macOS-local; run before any UI change)
npx playwright test visual-regression
```

If E2E fails on CI, do NOT upload — fix first.

---

*Last updated: 2026-05-02 · Authored by Marvin during the App Store
launch prep + E2E coverage sprint.*
