# PassPilot Backend — Layer 4 Design Doc

> Server-side content delivery + watermarked AI explanations.
> The last major anti-abuse layer before Layer 5 (device binding) completes the stack.

---

## Why PassPilot needs a backend now

PassPilot v1 is 100% client-side (Next.js static export → Azure SWA). That was the right call for speed, but it leaves 3 attack surfaces wide open:

1. **Content extraction.** All 400 questions + explanations ship in the JS bundle. A motivated attacker can `curl shop.passpilot.app/_next/static/chunks/*.js` + grep JSON from the bundle. No refund needed — they just take the content.
2. **AI explanation watermarking.** Currently client-side calls Gemini with no user context. If an explanation gets shared on Reddit, there's no way to trace which buyer leaked it.
3. **License verification.** Lemon Squeezy licenses are verified via client-side key lookups. Forgeable with any dev tools session.

Backend solves all three.

---

## Stack decision: Azure Functions (serverless) + Cosmos DB (or SQLite via blob)

**Why Azure Functions:**
- PassPilot already deploys to Azure Static Web Apps. SWA has **built-in integration with Azure Functions** — add an `api/` folder and it's live.
- No extra infra to manage.
- Generous free tier (1M invocations/month) — PassPilot is nowhere near.
- Same runtime Node.js we use everywhere else.

**Why Cosmos DB (or SQLite-on-blob for v1):**
- Cosmos: fully managed, serverless tier, global replication. ~$25/mo for low volume.
- SQLite-on-blob: free-tier, single-writer OK for a cert prep app. Good for v1.
- **Recommendation:** start with SQLite-on-blob (a single `passpilot.db` file in Azure Blob Storage, downloaded on function cold-start). Migrate to Cosmos only if we cross 100 concurrent users.

---

## Endpoints (Layer 4 minimum)

### 1. `GET /api/questions/:examId`
**Auth:** Bearer token (license key)
**Returns:** Array of question objects — but **only the subset unlocked** for this buyer based on:
- Their progressive-unlock day (re-computed server-side to prevent client-clock tampering)
- Their license tier (Pro → one exam; Multi → all 3)

**Tamper defense:** client can't see locked questions at all. They're not in the response.

### 2. `POST /api/ai/explain`
**Auth:** Bearer token
**Body:** `{ questionId, userSelection, officialExplanation }`
**Returns:** AI-generated explanation, **with hidden watermark** — invisible zero-width unicode characters encoding the buyer's license ID.

Watermark spec:
```
Every N characters in the output, insert one of:
  U+200B  (zero-width space)  → bit 0
  U+200C  (zero-width non-joiner) → bit 1
Encoding: license ID's first 8 chars (base36) → 40 bits → ~200 chars of spacing
```

If the explanation appears on Reddit / a forum:
1. Crawl the public page
2. Extract the text
3. Decode the invisible chars → recover license ID
4. Match to buyer → refund denied / account banned / legal notice

### 3. `POST /api/license/verify`
**Auth:** license key in body
**Returns:** `{ valid, tier, verifiedAt, unlockedExams }`
**Replaces:** current client-side LS lookup
**Defense:** server holds the source of truth. Client can't fake `tier = "multi"` via devtools anymore.

### 4. `POST /api/usage/sync`
**Auth:** Bearer token
**Body:** Array of UsageEvent (from client's localStorage log)
**Behavior:** Mirror client-side events to server-side DB. On refund claim, we have tamper-proof evidence even if user cleared localStorage.

### 5. `POST /api/consent/log`
**Auth:** None (pre-purchase)
**Body:** `{ offerId, priceCents, currency, userAgent, purchaseIntent }`
**Returns:** `{ id, logged }`
**Replaces:** current client-side consent log → server-side durable record

---

## Database schema

```sql
-- Buyers
CREATE TABLE licenses (
  id              TEXT PRIMARY KEY,         -- license key (from LS webhook)
  email           TEXT,
  tier            TEXT CHECK(tier IN ('pro', 'multi')),
  unlocked_exams  TEXT,                     -- JSON array
  verified_at     TEXT NOT NULL,
  lemon_order_id  TEXT,
  apple_iap_id    TEXT,
  google_iap_id   TEXT,
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Consent records (per purchase)
CREATE TABLE consents (
  id           TEXT PRIMARY KEY,
  license_id   TEXT,
  offer_id     TEXT,
  price_cents  INTEGER,
  currency     TEXT,
  user_agent   TEXT,
  ip_hash      TEXT,                        -- salted hash, not raw IP
  timestamp    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Usage events (mirrored from client)
CREATE TABLE usage_events (
  id           TEXT PRIMARY KEY,
  license_id   TEXT,
  event_type   TEXT,                        -- e.g. 'question.viewed'
  question_id  TEXT,
  exam_id      TEXT,
  meta_json    TEXT,
  client_ts    TEXT,
  server_ts    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Devices (Layer 5 companion)
CREATE TABLE devices (
  id              TEXT PRIMARY KEY,
  license_id      TEXT,
  fingerprint     TEXT,
  user_agent      TEXT,
  first_seen_at   TEXT,
  last_seen_at    TEXT,
  revoked_at      TEXT                      -- NULL = active
);

-- AI explanations (for watermark traceback)
CREATE TABLE ai_explanations (
  id           TEXT PRIMARY KEY,
  license_id   TEXT,
  question_id  TEXT,
  content      TEXT,                        -- raw (no watermark)
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## Deployment plan

### Option A — Azure Static Web Apps (recommended)
- Add `/api/` folder to PassPilot repo, matching the MARVIN pattern
- Each endpoint is a Function file: `api/questions/index.js`, `api/ai/explain/index.js`, etc.
- SWA auto-deploys on git push
- Env vars via Azure Portal → Application Settings

### Option B — Fly.io
- Pros: Postgres free tier, single-binary deploy, good DX
- Cons: another platform to manage, costs after small scale

### Option C — Cloudflare Workers + D1
- Pros: fastest edge, cheap
- Cons: KV-only initially, D1 still beta for SQL queries at scale

**Call: Option A** (Azure SWA). Matches MARVIN, zero new infra, free tier covers PassPilot's first 1000+ buyers.

---

## Migration path (3 phases)

### Phase 1 (v0.4.0): Add `/api/license/verify` + usage mirror
- Lowest-risk endpoint to add first
- Validates license key against LS webhook-provided records
- Client falls back to LS-only if backend unreachable
- Usage events POST'd async, doesn't block UX

### Phase 2 (v0.5.0): Add `/api/questions/:examId` + server-side unlock enforcement
- Client stops shipping questions in JS bundle
- Fetches on-demand from API
- Progressive unlock enforced server-side
- Tamper-proof

### Phase 3 (v0.6.0): Add `/api/ai/explain` with watermarking
- Pipe Gemini calls through backend
- Watermark buyer ID into every response
- Deters public leaks

---

## What to build first — concrete v0.4.0 file list

```
PassPilot/api/
├── host.json                           # Azure Functions host config
├── package.json                        # Function-level deps
├── license/
│   ├── verify/
│   │   ├── function.json
│   │   └── index.js
├── usage/
│   ├── sync/
│   │   ├── function.json
│   │   └── index.js
├── consent/
│   ├── log/
│   │   ├── function.json
│   │   └── index.js
└── _shared/
    ├── db.js                            # SQLite-on-blob wrapper
    ├── auth.js                          # bearer-token verification
    └── schemas.js                       # zod schemas for request bodies
```

---

## Estimated effort

- Phase 1 (licenses + usage mirror):  **~4 hrs**
- Phase 2 (questions + unlock enforcement): **~6 hrs** (data migration + API consumer refactor)
- Phase 3 (AI watermark):              **~3 hrs**
- **Total:** ~13 hrs across 3 session blocks

---

## Decision needed from Jann before we start

1. **Database:** SQLite-on-blob (free, simple) or Cosmos (resilient, costs ~$25/mo)?
2. **Deploy target:** Azure SWA (same as MARVIN) or separate?
3. **LS webhook ingestion:** how does Jann currently receive purchase events? Does PassPilot already have an LS webhook handler somewhere, or is verification pure client-side today?
4. **Subdomain:** `api.passpilot.app` for backend, or use SWA's co-located `/api/*` on main domain?

When Jann picks these four, MARVIN/Orion kicks off Phase 1 and the rest cascades.

---

_Drafted 2026-04-24 by MARVIN. Awaiting Jann's architecture calls._
