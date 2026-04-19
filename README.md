# PassPilot

> **Don't just study more. Study what matters most to pass.**

PassPilot is an AI-driven exam-readiness system for certification prep. It maps your weak topics, predicts your pass probability, and builds a daily study plan tuned to the exam date. The MVP ships with the **AZ-900 (Microsoft Azure Fundamentals)** curriculum — the architecture is designed to add more exams later.

This is **not** a flashcard clone. The core promise is a single trustworthy readiness score plus a plan that changes shape depending on how much time you have left.

---

## What's inside

| Screen | Path | Purpose |
|---|---|---|
| Landing | `/` | Hero, value prop, preview of readiness/plan/alerts |
| Onboarding | `/onboarding` | 5-step setup (exam, date, confidence, hours, target) |
| Diagnostic | `/diagnostic` | 12-question AZ-900 quiz with answer explanations |
| Results | `/diagnostic/results` | Readiness score, risk band, weakest/strongest topics |
| Dashboard | `/dashboard` | Readiness ring, countdown, mission, weak alerts, trend, recent sessions |
| Study plan | `/plan` | Daily blocks (study, practice, review, cram) with AI insight |
| Practice | `/practice` | Mixed / topic / incorrect-only drills |
| Weakness review | `/weakness` | Clustered risks, mini summaries, most-missed questions |
| Rescue mode | `/rescue` | Condensed survival plan for the final days |
| Study guide | `/guide` | Summary / cram sheet / key facts / personal mistake sheet |
| Settings | `/settings` | Edit exam date, time per day, reset data |

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with custom tokens and `tailwindcss-animate`
- **Zustand** with `persist` (localStorage) for state
- **Recharts** for the readiness trend chart
- **lucide-react** icons
- **No backend, no external APIs** — all data is local/mock, adaptive behavior is deterministic

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## Folder structure

```
passpilot/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing
│   ├── onboarding/
│   ├── diagnostic/
│   ├── dashboard/
│   ├── plan/
│   ├── practice/
│   ├── weakness/
│   ├── rescue/
│   ├── guide/
│   ├── settings/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                   # primitive UI (Button, Card, Progress, Badge)
│   ├── app-nav.tsx
│   ├── readiness-ring.tsx
│   ├── risk-badge.tsx
│   ├── topic-mastery-list.tsx
│   ├── trend-chart.tsx
│   ├── stat-card.tsx
│   ├── question-runner.tsx   # quiz engine, reused across diagnostic + practice
│   ├── container.tsx
│   └── hydration-gate.tsx
├── lib/
│   ├── types.ts              # domain models
│   ├── data/
│   │   ├── exams.ts
│   │   ├── topics.ts         # AZ-900 domains + cram/key facts
│   │   └── questions.ts      # 45+ mock questions + explanations
│   ├── scoring.ts            # readiness algorithm, risk classification
│   ├── planner.ts            # daily plan builder, weakness clustering, rescue
│   ├── store.ts              # Zustand + localStorage persistence
│   └── utils.ts
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## The readiness algorithm (in plain English)

Readiness is **not** raw quiz accuracy. It blends four signals:

1. **Weighted topic accuracy** — each of the 5 domains contributes to the score in proportion to its exam weight (e.g., Core Azure Services is worth 25%).
2. **High-risk penalty** — if a topic is below 50% accuracy *and* is high-weight *and* has been tested more than twice, we deduct from the score. Missing a big topic matters more than missing a small one.
3. **Consistency boost** — a small bonus for a study streak and for improving scores over time.
4. **Days-left urgency** — used by the planner to pick plan shape, and folded into risk classification for the final week.

Risk bands:

- **Strong Ready** (score ≥ 82)
- **Safer Zone** (72–81)
- **Borderline** (58–71)
- **High Risk** (< 58, or < 72 with ≤ 7 days left)

See `lib/scoring.ts` for the implementation.

---

## How the plan adapts

`lib/planner.ts` builds a fresh plan every render based on mastery + days left:

| Days left | Plan shape |
|---|---|
| > 21 | Warm-up → 3 study blocks → mixed practice → wrap review |
| 11–21 | Same, but focus topics skew harder toward weak domains |
| 6–10 | Timed mixed drill added; new-topic study trimmed |
| ≤ 5 | **Rescue mode**: cram sheet opener, 2 focus topics only, no new content |

The "Today's mission" and "AI insight" strings are picked from a rule set that looks at weakest topic, accuracy, and days left — so the copy stays specific without needing an LLM call.

---

## Adding a new exam

The data layer is normalized around `ExamId`. To add, say, AWS Cloud Practitioner:

1. Add topics to `lib/data/topics.ts` (same `Topic` shape).
2. Add questions to `lib/data/questions.ts`.
3. Register the exam in `lib/data/exams.ts`.
4. Update the `ExamId` union in `lib/types.ts`.
5. Add a new option in `app/onboarding/page.tsx` (the `ExamStep` component).

The rest of the UI — scoring, planner, dashboard, rescue mode — is exam-agnostic.

---

## State & persistence

All user state (profile, attempts, completed blocks) lives in **one Zustand store** (`lib/store.ts`), persisted to `localStorage` under the key `passpilot.v1`. There is no account, no backend — refreshing the page preserves your progress; clearing browser storage wipes it.

The `HydrationGate` component handles the one-time delay while Zustand reads from storage on mount.

---

## Design notes

- Mobile-first layout with a bottom tab bar on mobile and a top bar on desktop.
- Colors are driven by CSS variables in `globals.css` — light/dark tokens are both defined, with dark disabled by default.
- The readiness ring is a raw SVG (no chart library for that piece — cleaner animation control).
- Every surface uses the `.card-surface` utility so shadows, radii, and borders stay consistent.

---

## What's intentionally out of scope

- Accounts, auth, billing
- A real AI/LLM backend (microcopy is rule-based for speed + offline)
- Admin dashboards, multi-user features
- Full AZ-900 question bank coverage (45+ is enough to feel alive, not enough for real certification)

Swap the mock data for a real question bank + LLM-generated explanations and this is a shippable v1.

---

## License

MIT for the code scaffolding. AZ-900 is a Microsoft trademark — PassPilot is independent study software and is not affiliated with Microsoft.
