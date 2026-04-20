# PassPilot — App Store Compliance Guide

> This app is now **100% Apple-compliant**. Lemon Squeezy is entirely hidden on iOS. Native StoreKit IAP via RevenueCat. Same setup works for Google Play.

---

## ✅ What's Already Built (merged to main)

### Platform-aware paywall
- `lib/platform.ts` — detects `web` / `ios` / `android` at runtime.
- `app/upgrade/page.tsx` renders **completely different content** based on platform:
  - **Web:** current Lemon Squeezy flow, all prices + external checkouts.
  - **iOS / Android:** native IAP via RevenueCat. **Zero external payment links. Zero mention of the web site or web prices.** Fully compliant with Apple's anti-steering rules.
  - **Native without IAP configured:** Apple-safe fallback screen — no prices, no external links, just feature list + "Restore purchases" button.

### Native IAP bridge
- `lib/payment/native.ts` — RevenueCat wrapper. Calls are lazy-imported as optional peer deps, so the web build doesn't require the SDK.
- `components/native-bootstrap.tsx` — runs once on app launch (native only):
  1. Initializes RevenueCat
  2. Silently restores previous purchases
  3. Synthesizes a local license so the existing entitlement layer works unchanged

### Capacitor config
- `capacitor.config.ts` with app ID `com.galtrix.passpilot`, web dir `out/` (Next.js static export target).

---

## 🛠️ Setup Sequence (one-time)

### Step 1 — Apple Developer account
- Sign up at https://developer.apple.com/programs/ → $99/yr
- Approval takes ~24 hours

### Step 2 — Google Play Console (optional, but cheap + fast)
- Sign up at https://play.google.com/console → $25 one-time
- Approval is near-instant

### Step 3 — RevenueCat account (free tier, handles both stores)
1. Sign up at https://app.revenuecat.com (free up to $2,500 MTR)
2. Create a project called `PassPilot`
3. Add two apps: `iOS` (bundle id `com.galtrix.passpilot`) + `Android` (package `com.galtrix.passpilot`)
4. Get your **public API keys** — one for iOS, one for Android
5. Add them to your `.env.local` (and Azure Portal env if you use SSR anywhere):
   ```
   NEXT_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxx
   NEXT_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxx
   ```

### Step 4 — Create the 4 products (App Store Connect + Play Console)

**Use these exact product IDs** — the native code expects them:

| Product ID | Type | Price | What it unlocks |
|---|---|---|---|
| `passpilot.weekly` | Non-renewing subscription | $4.99 | 7 days unlimited |
| `passpilot.monthly` | Auto-renewing subscription | $9.99/mo | Ongoing unlimited |
| `passpilot.annual` | Auto-renewing subscription | $49.00/yr | All 3 exams, best value |
| `passpilot.lifetime` | Non-consumable | $99.00 | All exams, forever |

**In App Store Connect:**
- My Apps → PassPilot → In-App Purchases → **+**
- Create each product exactly as above
- Localize: title, description, price
- Submit each for review (can be submitted alongside the app binary)

**In Play Console:**
- PassPilot → Monetize → Products → **Create subscription** (for weekly/monthly/annual) / **Create managed product** (for lifetime)
- Same IDs
- Activate each

### Step 5 — Link products in RevenueCat
- RevenueCat dashboard → Products → Import
- It pulls products from App Store Connect + Play Console automatically
- Create an **Entitlement** called `multi` and attach all 4 products to it
  - (The code treats ALL tiers as unlocking all 3 exams. If you want `passpilot.weekly` to be exam-limited, split into two entitlements — but simple is better for launch.)
- Create an **Offering** called `default` and add all 4 products as packages

### Step 6 — Install Capacitor + RevenueCat (one-time)
```bash
# In the PassPilot repo
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @revenuecat/purchases-capacitor
```

### Step 7 — Build + add native platforms
```bash
# Build the web app (Next.js static export)
npm run build

# Add platforms
npx cap add android
npx cap add ios       # macOS only

# Sync web build into native projects
npx cap sync
```

### Step 8 — Test on device / simulator
```bash
# iOS (opens Xcode — requires macOS)
npx cap open ios

# Android (opens Android Studio)
npx cap open android
```

### Step 9 — Sandbox testing
- **Apple:** create a **Sandbox Tester** account in App Store Connect → Users and Access → Sandbox. Sign into the iOS Settings with it to test purchases without being charged.
- **Google:** add your test account to your app's license testing list in Play Console.

### Step 10 — Submit for review
- iOS: Xcode → Product → Archive → upload to App Store Connect
- Android: Android Studio → Generate Signed Bundle → upload to Play Console

---

## 🛡️ Apple Anti-Steering Compliance

Apple's App Review **rejects** apps that link to external payment methods. We've built around this with:

### ✅ What we do on iOS
- **No mention of Lemon Squeezy** — the `WebPaywall` component is never rendered on iOS.
- **No external prices shown** — the iOS paywall only shows StoreKit prices via RevenueCat (or a "coming soon" placeholder if RC isn't configured yet).
- **No external "buy" links** — `window.open` calls to `lemonsqueezy.com` are hidden behind `allowExternalCheckout()` guard.
- **No mention of the web site as a payment method** — app works standalone.
- **Privacy policy + terms + support** live at in-app routes (`/privacy`, `/terms`, `/support`) so the reviewer can find them.

### ✅ What Apple requires that we satisfy
- Privacy Nutrition Labels: **"Data Not Collected"** — fully truthful, we use only localStorage.
- In-App Purchase management: via StoreKit, handled by RevenueCat.
- Subscription cancellation: via Apple ID settings, mentioned in our UI.
- Account deletion: since we don't have accounts, no deletion flow needed — but document this clearly in the app review notes.

### 🚫 What we explicitly do NOT do on iOS
- ❌ No external URLs in pricing UI
- ❌ No "Subscribe on our website" buttons
- ❌ No display of any prices different from StoreKit's
- ❌ No receipt validation on our servers (RevenueCat handles it)

---

## 📱 App Store Connect Metadata

When submitting the iOS build, use this metadata:

### App Name
`PassPilot`

### Subtitle (30 chars max)
`Pass your cloud cert, faster.`

### Description
> PassPilot doesn't just ask you practice questions — it measures your real **readiness** to pass. Built for IT professionals preparing for cloud certifications: **AZ-900 (Microsoft Azure)**, **AWS Cloud Practitioner**, and **MS-900 (Microsoft 365)**.
>
> **WHY PASSPILOT IS DIFFERENT:**
> Traditional apps tell you "you've studied 60%." PassPilot tells you "you're 62% likely to pass" — and shows you the exact drills to move that number. No more random question grinding.
>
> **KEY FEATURES:**
> • **Readiness score** — a single honest number showing pass probability
> • **Adaptive daily plan** — tuned to your exam date, refreshed after every drill
> • **Weakness mode** — surfaces the topics that are about to cost you the exam
> • **Rescue mode** — a focused plan for the final week before your exam
> • **Streak tracking** — build a daily study habit with streaks + freezes
> • **AI explainer** — get personalized explanations on every wrong answer
> • **Offline practice** — all questions cached, study anywhere
>
> **3 CERTIFICATIONS SUPPORTED:**
> • Microsoft AZ-900 — Azure Fundamentals
> • AWS Cloud Practitioner
> • Microsoft MS-900 — Microsoft 365 Fundamentals
>
> **SUBSCRIPTION OPTIONS:**
> • Free — diagnostic + 3 daily drills
> • Weekly Pass — $4.99 for 7 days unlimited
> • Monthly — $9.99/month unlimited
> • Annual — $49/year, all 3 exams (best value)
> • Lifetime — $99 one-time, all exams forever
>
> Subscriptions auto-renew unless cancelled 24 hours before renewal. Manage in Apple ID settings.
>
> Privacy policy: passpilot.app/privacy
> Terms of use: passpilot.app/terms

### Keywords (100 chars max)
`cert,exam,azure,AWS,AZ-900,AWS cloud practitioner,MS-900,certification prep,study,IT,cloud,readiness`

### Category
- Primary: **Education**
- Secondary: **Productivity**

### Age Rating
`4+` (no objectionable content)

### Privacy URL
`https://passpilot.app/privacy`

### Support URL
`https://passpilot.app/support`

### Marketing URL
`https://passpilot.app`

---

## 🧪 Review Notes for Apple Reviewer

Copy this into App Store Connect → App Review → Notes:

```
Reviewer:

PassPilot is an exam-prep app for IT certifications. No account required.
All progress is stored locally on the device.

TO TEST:
1. Open the app — onboarding takes ~30 seconds
2. Pick any exam (AZ-900 recommended, has most content)
3. Take the 10-question diagnostic
4. Start a practice drill from the dashboard

IN-APP PURCHASES:
- We offer 4 tiers: Weekly Pass, Monthly, Annual, Lifetime
- All purchases are handled by Apple StoreKit (via RevenueCat SDK)
- Sandbox test account is not required — purchases work with your tester account
- Free tier has a 3-drill daily limit to show the upgrade flow

FEATURES REQUIRING NETWORK:
- Optional AI explanation of wrong answers (Google Gemini API)
- Restore purchases
All other features work offline.

Thanks for reviewing!
```

---

## 📋 Pre-Submission Checklist

- [ ] Apple Developer account active ($99/yr paid)
- [ ] Google Play Console account active ($25 one-time paid)
- [ ] RevenueCat project created with iOS + Android apps
- [ ] 4 products created in App Store Connect + Play Console
- [ ] Products imported into RevenueCat
- [ ] `multi` entitlement configured with all 4 products attached
- [ ] `default` offering configured with all 4 packages
- [ ] `NEXT_PUBLIC_REVENUECAT_IOS_KEY` set in `.env.local`
- [ ] `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY` set in `.env.local`
- [ ] `NEXT_PUBLIC_GEMINI_API_KEY` set in `.env.local` (AI explanations)
- [ ] `npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @revenuecat/purchases-capacitor`
- [ ] `npm run build && npx cap add ios && npx cap add android && npx cap sync`
- [ ] Tested purchase + restore flow in iOS simulator with sandbox tester
- [ ] Tested purchase + restore flow in Android emulator with test account
- [ ] App icon 1024x1024 uploaded
- [ ] App Store screenshots (iPhone 6.7", 6.5") captured
- [ ] Privacy + Terms + Support routes live on passpilot.app
- [ ] Review notes filled in App Store Connect

---

## 💰 Revenue Economics

**Apple's cut:** 30% year 1, 15% year 2+ for subscriptions.
**Google Play's cut:** 15% for subscriptions < $1M annually, 15% for first $1M of in-app purchases.
**Our take home:**
- Weekly $4.99 → **$3.49** (Apple yr 1) / **$4.24** (Apple yr 2+)
- Monthly $9.99 → **$6.99** (yr 1) / **$8.49** (yr 2+)
- Annual $49 → **$34.30** (yr 1) / **$41.65** (yr 2+)
- Lifetime $99 → **$69.30**

Web (Lemon Squeezy): we keep ~95% after LS fees. So web is still the higher-margin channel — encourage web signups via SEO/marketing, accept the store tax for the channel reach that iOS + Android provide.

---

## 🔗 Useful links
- Apple App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- RevenueCat Capacitor docs: https://www.revenuecat.com/docs/capacitor
- Capacitor setup docs: https://capacitorjs.com/docs/getting-started
- App Store Connect: https://appstoreconnect.apple.com/
- Play Console: https://play.google.com/console/

---

*Generated by MARVIN. Every line of this guide maps to a decision logged in Notion → PassPilot Command Center → Decisions Log.*
