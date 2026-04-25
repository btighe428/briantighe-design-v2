---
title: Data Journalism Series — Design Spec
date: 2026-04-24
status: approved
authors: Brian Tighe
repos:
  - briantighe-v2 (frontend)
  - design-drift (backend)
---

# Data Journalism Series — Design Spec

## Context and goal

The briantighe.design V2 scaffold ships three prose essays and twelve bespoke SVG figures drawn from synthesized research. It has the distribution architecture in place (full-text RSS, permissive LLM robots, canonical URLs, semantic HTML) but it has **never published a piece drawn from Brian's own data pipelines**. Design Drift, Faktory, Cityping, and DwellScore each expose analytic territory nobody else can report on. This spec establishes the reusable pattern for bringing that territory onto briantighe.design as a recurring **data journalism series**, and delivers the first piece: *The discourse-vs-hiring gap*.

The series answers a strategic need: the 48-month SEO/LLM-citation thesis requires evergreen, citation-worthy, numerically-precise essays. Research synthesis works; proprietary data with reproducible methodology works better. A single piece with a named methodology page that models can cite becomes a durable retrieval asset.

## Non-goals

- No CMS, no comment system, no reading-time estimator, no tag taxonomy (scaffold commitment intact).
- No live data on essay pages — static snapshots only. Zero client JS commitment preserved.
- No cross-piece navigation infrastructure (related-essay algorithms, series index pages beyond a simple list) until ≥3 pieces have shipped.
- No interactive chart controls, filters, or tooltips on essay figures in this spec. Those belong to a different shape (the scrollytelling or standalone-data-page shapes we considered and deferred).
- No automated fact-checking. Numbers are hand-verified by the author pre-publish; freshness gate prevents accidental staleness.

## Architecture

The work spans two repos with a clean one-way boundary.

```
design-drift                          briantighe-v2
──────────────                        ─────────────
Topic taxonomy (~40 terms)   ─┐
JobListingTopic table         │
InfluencerPostTopic table     │─ classify ─→ gap JSON ──┐
Classifier job (Trigger.dev)  │                          ↓
Gap-scoring function          ─┘                   content/data/2026/
API endpoint /api/gap-data ────── pulled by ────→ discourse-vs-hiring.json
                                   bake script          ↓
                                                  content/essays/2026/
                                                  discourse-vs-hiring.mdx
                                                        ↓
                                                  imports JSON
                                                  renders figures
                                                  (server components,
                                                   bespoke SVG,
                                                   zero client JS)
```

**Boundary rule:** Design Drift owns analysis. briantighe-v2 owns story. A one-way manual bake pulls a frozen JSON snapshot at author-chosen moments; the essay cites the snapshot date and pinned commit SHA. Subsequent rebuilds with new data produce *new* articles, not mutations of old ones.

**Rationale for static bake over live fetch:**
- Preserves zero-client-JS commitment.
- Makes the essay citeable — numbers don't change under the reader or the model retrieving it.
- Decouples briantighe-v2 build reliability from Design Drift DB availability.
- Enables git-pinned reproducibility: any third party can check out the commit, rerun the bake, and produce the same figures.

## Design Drift backend additions

### 1. `Topic` table (Prisma)

```prisma
model Topic {
  id         String   @id @default(cuid())
  slug       String   @unique
  label      String
  category   String   // "ai" | "design-process" | "tooling" | "growth-pm" | "emergent"
  aliases    String[] // phrase variants for classifier + fallback keyword match
  createdAt  DateTime @default(now())
}
```

~40 rows, hand-seeded via `prisma/seed-topics.ts`. Distribution across categories:

| Category | Count | Example topics |
|---|---|---|
| `ai` | ~10 | agents, foundation models, RAG, fine-tuning, MCP |
| `design-process` | ~8 | design systems, workshops, jobs-to-be-done, research ops |
| `tooling` | ~8 | Figma Make, Cursor, Claude Code, v0, Bolt |
| `growth-pm` | ~7 | activation, retention, onboarding, pricing, PLG |
| `emergent` | ~7 | AI product designer, design engineering, prompt engineering |

Exact topic list and alias sets are an editorial decision finalized during implementation.

### 2. Junction tables

```prisma
model JobListingTopic {
  jobListingId   String
  topicId        String
  mentionCount   Int
  weekStart      DateTime  // denormalized for time-series queries

  @@id([jobListingId, topicId])
  @@index([topicId, weekStart])
}

model InfluencerPostTopic {
  influencerPostId String
  topicId          String
  mentionCount     Int
  weekStart        DateTime

  @@id([influencerPostId, topicId])
  @@index([topicId, weekStart])
}
```

### 3. Classifier job (Trigger.dev)

New task `classifyTopics` in `trigger/classify-topics.ts`. Nightly schedule. Processes un-classified `JobListing` and `InfluencerPost` rows in batches of 50. Each batch:

1. Pull batch from DB (rows with no classification row in junction table).
2. Inline the taxonomy JSON into a system prompt.
3. Call Haiku with user prompt `"Classify this text against the taxonomy. Return JSON array of topic slugs."`.
4. Parse response, insert junction rows.
5. Cache by content-hash (`sha256(text)` → `topicSlug[]`) in a new `ClassificationCache` table so re-classifying identical text is free.

Estimated backfill cost: **~$12** (Haiku input ~$0.25/M tokens, output ~$1.25/M tokens, corpus ~85K JDs + ~26K posts averaging 300 input tokens + 30 output tokens per row).

### 4. Gap-scoring function

Pure TS in `src/lib/gap-scoring.ts`:

```ts
type GapRow = {
  slug: string
  label: string
  category: string
  influencerShare: number
  jdShare: number
  gapRatio: number    // influencerShare / jdShare
  logGap: number      // log2(gapRatio); symmetric around 0
  totalInfluencerPosts: number
  totalJds: number
  topPostsSample: Array<{ postId: string, excerpt: string }>  // 3 examples
  topJdsSample: Array<{ jobListingId: string, excerpt: string }>
}

function computeGap(windowWeeks: 12 | 26 | 52): {
  snapshotDate: string
  windowWeeks: number
  rows: GapRow[]
  excludedTopics: Array<{ slug: string, reason: string }>
}
```

**Exclusion rule baked in:** any topic with fewer than 10 posts OR fewer than 10 JDs in the window is excluded from `rows` and moved to `excludedTopics`. Small-sample ratios are statistically meaningless and Tufte-rigor demands we say so.

### 5. API endpoint

`app/api/gap-data/route.ts`. Returns the full `computeGap(52)` result as JSON. Secured by static bearer token (`GAP_DATA_TOKEN`), shared only with briantighe-v2's bake script. Not user-facing, not linked from any UI.

### 6. PROCESSES.md update

Append a dated entry to `design-drift/PROCESSES.md` documenting the gap-scoring formula, taxonomy, and classifier prompt — per Brian's global instruction that scraping/scoring pipelines must be documented with dated history.

## briantighe-v2 scaffolding

### Directory additions

```
content/data/2026/
  discourse-vs-hiring.json           (frozen snapshot, committed)
content/essays/2026/
  discourse-vs-hiring.mdx            (the essay)
content/methodology/
  discourse-vs-hiring.mdx            (methodology page — reusable pattern per piece)
components/figures/discourse-vs-hiring/
  gap-dumbbell.tsx                   (hero figure)
  topic-taxonomy-map.tsx             (F2)
  corpus-scale-over-time.tsx         (F3, margin-figure size)
  topic-divergence-details.tsx       (F4, small-multiples)
  __fixtures__/sample.json           (test fixture)
components/
  data-source.tsx                    (reusable citation block for series)
scripts/
  bake-data.mjs                      (calls DD API, writes JSON)
app/methodology/[slug]/
  page.tsx                           (thin renderer for methodology MDX files)
```

### `scripts/bake-data.mjs`

Usage: `npm run bake discourse-vs-hiring`. Calls `GET https://design-drift-two.vercel.app/api/gap-data` with `Authorization: Bearer $GAP_DATA_TOKEN`. Writes response to `content/data/2026/<slug>.json`. Pretty-prints JSON (stable key order) so git diffs are readable across snapshots.

**Freshness gate:** if `snapshotDate` in the response is older than 30 days, the script prints a warning and exits non-zero unless `--allow-stale` is passed. Prevents accidental publish-with-stale-data.

### `<DataSource />` MDX component

Small footer-above-essay block. ~30 LOC. Signature:

```tsx
<DataSource
  source="Design Drift"
  snapshotDate="2026-04-24"
  commitSha="abc1234"
  methodologyHref="/methodology/discourse-vs-hiring"
/>
```

Renders as a single italicized line at the top of the essay body, e.g., *"Data: Design Drift, snapshot April 24, 2026 (commit abc1234). Methodology →."*

### Figure components

All four are **server components** (no `"use client"`). Each imports the frozen JSON directly, maps over it, emits SVG. Follow the pattern in existing `components/figures/figma-valuation.tsx`. Every SVG root includes `<title>` and `<desc>` elements with descriptive text (not chart-type labels) — feeds screen readers and LLM retrieval.

### Methodology route

`app/methodology/[slug]/page.tsx` renders MDX from `content/methodology/[slug].mdx`. Separate URL per piece. Rationale: distinct canonical URL for each methodology gives LLMs a retrievable artifact that can be cited independently of the essay, doubling the citation surface per piece.

### LOC budget

Approximate new lines in briantighe-v2:

| Addition | LOC |
|---|---|
| `bake-data.mjs` | 80 |
| `<DataSource />` | 30 |
| Four figure components | 150–300 each (~800) |
| Methodology route | 40 |
| Type definitions | 40 |
| **Total** | **~990** |

Well under the 2,000-LOC generator cap, with headroom for series pieces 2–5.

## First piece: *The discourse-vs-hiring gap*

**Route:** `/essays/2026/discourse-vs-hiring`
**Target length:** ~2,700 words, four figures.
**Cadence position:** Piece #1 of the recurring series.

### Section structure

| # | Section | Words | Figure |
|---|---|---|---|
| 1 | The question | 400 | — |
| 2 | Methodology transparency | 400 | F2 topic taxonomy map |
| 3 | Total corpus scale over time | 200 | F3 corpus scale (margin-figure) |
| 4 | The main finding (dumbbell) | 600 | **F1 gap dumbbell (hero)** |
| 5 | Divergence details | 500 | F4 topic divergence small-multiples |
| 6 | What this does and doesn't mean | 400 | — |
| 7 | Series frame / methodology link | 200 | — |

### Attribution policy (piece #1)

**Aggregate-only.** Topics named (all ~40). Individual influencers and companies not named in body text. Sidenotes may cite example post IDs or descriptors like *"a Staff role at a Series C fintech"* — never individual human names. This is deliberate:

1. Lowest relational cost while the series format is still being established.
2. The aggregate story is already sharp on its own.
3. Retains the option to go more aggressive in a later piece without having poisoned the well.

Subsequent pieces may revisit this policy.

### Voice markers

Matching `prototype-led-positioning.mdx`: drop cap, epigraph + attribution, small-caps for organization names (`<span className="sc">Design Drift</span>`), old-style numerals for years, sidenotes for caveats and citations, one pull-quote at the rhetorical peak. Numbers rendered with consistent precision — no false accuracy (`3.4×` not `3.417×`).

### Reproducibility commitment

Essay cites a specific snapshot. Any third party can check out the commit SHA, run `npm run bake discourse-vs-hiring`, and regenerate the exact JSON, which produces the exact figures. This is Tufte-grade rigor *and* the LLM-retrieval moat — models citing the piece also surface the methodology page as a sibling artifact.

## Testing and verification

Proportional to stakes. This is editorial work, not a payments system, but numerical precision in prose is the moat.

### Classifier validation (Design Drift)

Before full backfill: sample 50 random posts + 50 random JDs, run classifier, manually audit every topic assignment. Iterate on prompt until **precision ≥ 90%**. Record audit spreadsheet as `design-drift/docs/classifier-audit-2026-04.md` (committed).

### Gap-scoring unit tests (Design Drift)

Vitest in `src/lib/gap-scoring.test.ts`. ~6 tests:

- Pure function correctness with synthetic shares.
- `jdShare === 0` → row moved to `excludedTopics` with reason `"zero-jd-share"`.
- `influencerPosts < 10` → excluded with reason `"sample-size"`.
- Edge case: equal shares → `gapRatio === 1`, `logGap === 0`.
- Window parameter correctness (12 vs 26 vs 52).
- Output sorted by `logGap` descending.

### Figure component verification (briantighe-v2)

No snapshot tests — they're churn generators. Instead: each figure gets a TSX fixture (`__fixtures__/sample.json`). Dev-only route `/dev/figures/discourse-vs-hiring` renders every figure against the fixture for eyeball review. Formal gate: `next build` succeeds, TypeScript strict-check passes.

### End-to-end checklist (pre-publish)

1. `npm run bake discourse-vs-hiring` → fresh snapshot
2. `npx tsc --noEmit` → strict types clean
3. `npm run build` → Next build succeeds
4. Open `/essays/2026/discourse-vs-hiring` locally: all figures render, typography matches peer essays
5. Open `/methodology/discourse-vs-hiring`: renders, links back
6. `/feed.xml` → essay present, `<content:encoded>` contains full body including SVG
7. **Author reads every number cited in prose and verifies against JSON** — no automation substitutes for this
8. Mobile 375px: figures scale, no horizontal scroll
9. Screenshots every figure saved to `content/data/2026/discourse-vs-hiring-screenshots/` for distribution

### Freshness gate

Bake script refuses to proceed if `snapshotDate` > 30 days without `--allow-stale` flag.

### Accessibility

Every SVG root has `<title>` (finding-descriptive, not chart-type) and `<desc>` (one-sentence summary). These are also what LLMs retrieve, so writing them well is both an a11y and a distribution move.

### Explicitly not tested

- Visual regression (manual review catches real issues faster)
- Analytics (Vercel native suffices)
- Load performance (static page, edge-cached)

## Out of scope for this spec

- Attribution policy for pieces 2–5 (decided per piece based on how piece #1 lands).
- Automatic nightly re-bake / essay refresh cadence (manual for the foreseeable future).
- A cross-series index page / series navigation UI (defer until ≥3 pieces shipped).
- Interactive chart variants (filters, tooltips, zoom) — belongs to a different shape.
- Live companion dashboard (Shape D from brainstorming) — deferred.

## Open questions

1. **Exact topic list for the 40-term taxonomy.** The category counts above are the skeleton. Editorial finalization happens during implementation; first draft should be generated from a frequency scan of both corpora and then hand-curated.
2. **Methodology page template** — how prescriptive should the structure be? Current plan: a consistent template per piece (formula, taxonomy, limitations, prompt, sample size). Resist drift unless a later piece genuinely needs a different shape.
3. **Title A/B.** *"The discourse-vs-hiring gap"* (descriptive) vs. *"Forty topics, ranked by hype"* (punchier). Author decides at write-time.
4. **Classifier threshold** — 90% precision target is an assertion, not a measurement. Real target might be tighter (95%) once we see the audit sample. Revisit after first audit run.
