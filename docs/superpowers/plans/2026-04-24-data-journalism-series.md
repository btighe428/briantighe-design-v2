# Data Journalism Series — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable infrastructure that pulls Design Drift data onto briantighe.design as citation-grade data journalism, and ship piece #1 — *The discourse-vs-hiring gap*.

**Architecture:** Two repos, one-way boundary. Design Drift owns analysis (new tables, nightly classifier job, gap-scoring function, authenticated API). briantighe-v2 owns story (static JSON bake committed to git, four server-rendered SVG figures, Tufte-voice essay at `/essays/2026/discourse-vs-hiring`, methodology page at `/methodology/discourse-vs-hiring`). Static snapshot preserves citeability and zero-client-JS commitment.

**Tech Stack:** Prisma + Neon Postgres, Trigger.dev v3 `schedules.task`, Anthropic Haiku (`claude-haiku-4-5-20251001`) with prompt caching + Zod validation, Next.js 16 App Router route handler, Vitest for Design Drift unit tests, Next.js 16 + MDX + bespoke SVG server components for briantighe-v2 (no test runner — relies on `next build` + dev route).

**Spec:** `docs/superpowers/specs/2026-04-24-data-journalism-series-design.md`

---

## File structure

### Design Drift additions

| Path | Purpose |
|---|---|
| `prisma/schema.prisma` (modify) | Add `Topic`, `JobListingTopic`, `InfluencerPostTopic`, `ClassificationCache` models |
| `prisma/migrations/<ts>_data_journalism_series/migration.sql` | Auto-generated from schema change |
| `prisma/seed-topics.ts` | Idempotent seed script — ~40 `Topic` rows with aliases |
| `src/lib/gap-scoring.ts` | Pure function `computeGap(windowWeeks)` → ranked gap rows + excluded topics |
| `__tests__/gap-scoring/compute-gap.test.ts` | Vitest unit tests |
| `src/lib/topic-classifier.ts` | Haiku-backed classifier — single function, used by the Trigger task |
| `trigger/classify-topics.ts` | Nightly `schedules.task` that batches + classifies un-tagged rows |
| `src/app/api/gap-data/route.ts` | GET endpoint, bearer-auth, returns `computeGap(52)` JSON |
| `PROCESSES.md` (new) | Dated entry documenting taxonomy + classifier + gap formula |
| `docs/classifier-audit-2026-04.md` | Hand audit artifact (created during audit task) |

### briantighe-v2 additions

| Path | Purpose |
|---|---|
| `components/data-source.tsx` | Reusable citation block for series essays |
| `components/figures/discourse-vs-hiring/gap-dumbbell.tsx` | F1 hero figure |
| `components/figures/discourse-vs-hiring/topic-taxonomy-map.tsx` | F2 taxonomy reference figure |
| `components/figures/discourse-vs-hiring/corpus-scale-over-time.tsx` | F3 margin-figure context |
| `components/figures/discourse-vs-hiring/topic-divergence-details.tsx` | F4 small-multiples |
| `components/figures/discourse-vs-hiring/__fixtures__/sample.json` | Fixture for dev route |
| `components/figures/discourse-vs-hiring/types.ts` | Shared data types |
| `content/data/2026/discourse-vs-hiring.json` | Frozen snapshot (created by bake script) |
| `content/methodology/discourse-vs-hiring.mdx` | Methodology page content |
| `content/essays/2026/discourse-vs-hiring.mdx` | The essay |
| `app/methodology/[slug]/page.tsx` | Route handler for methodology MDX files |
| `app/dev/figures/[slug]/page.tsx` | Dev-only route for eyeball-reviewing figures against fixture |
| `scripts/bake-data.mjs` | Pulls from `/api/gap-data`, writes JSON, freshness gate |
| `lib/content.ts` (modify) | Add `getMethodologyBySlug` alongside existing `getEssayBySlug` |
| `package.json` (modify) | Add `bake` npm script |
| `.env.example` (new) | Document `GAP_DATA_TOKEN` + `GAP_DATA_URL` |

---

## Working agreement

1. **Two working trees.** Design Drift work is in `/Users/briantighe/design-drift`; briantighe-v2 work is in `/Users/briantighe/briantighe-v2`. Each part commits to its own repo.
2. **Sequence:** Part A must land (and be deployed) before Part B's bake script can run. Parts B/C can run in parallel once Part A is deployed. Part D depends on A+B+C.
3. **Never skip the failing-test step.** For TDD tasks, verify the test fails before implementing. Evidence beats assertion.
4. **Commits:** small and frequent. Each task ends with a commit.
5. **Design Drift CLAUDE.md says:** "This is NOT the Next.js you know." Read the relevant `node_modules/next/dist/docs/` guide before touching route handlers.

---

# Part A — Design Drift backend

## Task A1: Prisma schema — four new models + migration

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Modify: `prisma/schema.prisma` (append to end)
- Create: `prisma/migrations/<generated>/migration.sql` (via `npx prisma migrate dev`)

- [ ] **Step 1: Add models to schema**

Append to `prisma/schema.prisma`:

```prisma
model Topic {
  id        String   @id @default(cuid())
  slug      String   @unique
  label     String
  category  String   // "ai" | "design-process" | "tooling" | "growth-pm" | "emergent"
  aliases   String[] @default([])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  jobListingTopics     JobListingTopic[]
  influencerPostTopics InfluencerPostTopic[]

  @@index([category])
}

model JobListingTopic {
  jobListingId String
  topicId      String
  mentionCount Int      @default(1)
  weekStart    DateTime

  jobListing JobListing @relation(fields: [jobListingId], references: [id], onDelete: Cascade)
  topic      Topic      @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@id([jobListingId, topicId])
  @@index([topicId, weekStart])
  @@index([weekStart])
}

model InfluencerPostTopic {
  influencerPostId String
  topicId          String
  mentionCount     Int      @default(1)
  weekStart        DateTime

  post  InfluencerPost @relation(fields: [influencerPostId], references: [id], onDelete: Cascade)
  topic Topic          @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@id([influencerPostId, topicId])
  @@index([topicId, weekStart])
  @@index([weekStart])
}

model ClassificationCache {
  contentHash String   @id
  topicSlugs  String[] @default([])
  createdAt   DateTime @default(now())

  @@index([createdAt])
}
```

- [ ] **Step 2: Add inverse relations to JobListing and InfluencerPost**

In `JobListing` model (around L185-195), add inside the model block:

```prisma
  jobListingTopics JobListingTopic[]
```

In `InfluencerPost` model (around L541-567), add inside the model block:

```prisma
  influencerPostTopics InfluencerPostTopic[]
```

- [ ] **Step 3: Generate + apply migration**

```bash
npx prisma migrate dev --name data_journalism_series
npx prisma generate
```

Expected: migration file created under `prisma/migrations/<timestamp>_data_journalism_series/`, Prisma client regenerated without errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(schema): add Topic, junction tables, and ClassificationCache for data journalism series"
```

---

## Task A2: Seed topic taxonomy

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `prisma/seed-topics.ts`
- Modify: `package.json` (add `prisma.seed` OR an npm script that runs it)

- [ ] **Step 1: Create the seed file**

`prisma/seed-topics.ts`:

```ts
import { prisma } from "@/lib/db";

type SeedTopic = { slug: string; label: string; category: string; aliases: string[] };

const TOPICS: SeedTopic[] = [
  // AI (~10)
  { slug: "ai-agents", label: "AI agents", category: "ai", aliases: ["ai agent", "autonomous agent", "agentic", "agent workflows"] },
  { slug: "foundation-models", label: "Foundation models", category: "ai", aliases: ["foundation model", "LLM", "large language model"] },
  { slug: "rag", label: "Retrieval-augmented generation", category: "ai", aliases: ["rag", "retrieval augmented"] },
  { slug: "fine-tuning", label: "Fine-tuning", category: "ai", aliases: ["fine tune", "fine-tune", "finetuning"] },
  { slug: "mcp", label: "Model Context Protocol", category: "ai", aliases: ["mcp", "model context protocol"] },
  { slug: "prompt-engineering", label: "Prompt engineering", category: "ai", aliases: ["prompt eng", "prompting"] },
  { slug: "claude", label: "Claude (Anthropic)", category: "ai", aliases: ["claude code", "anthropic"] },
  { slug: "gpt", label: "GPT (OpenAI)", category: "ai", aliases: ["chatgpt", "openai"] },
  { slug: "embeddings", label: "Embeddings", category: "ai", aliases: ["vector embedding", "text embedding"] },
  { slug: "evals", label: "Evaluations", category: "ai", aliases: ["eval", "llm eval", "benchmark"] },

  // Design process (~8)
  { slug: "design-systems", label: "Design systems", category: "design-process", aliases: ["design system", "component library"] },
  { slug: "jobs-to-be-done", label: "Jobs-to-be-done", category: "design-process", aliases: ["jtbd", "jobs to be done"] },
  { slug: "research-ops", label: "Research operations", category: "design-process", aliases: ["research ops", "researchops", "ux research ops"] },
  { slug: "user-research", label: "User research", category: "design-process", aliases: ["ux research", "usability research"] },
  { slug: "workshops", label: "Workshops", category: "design-process", aliases: ["design sprint", "design workshop"] },
  { slug: "prototyping", label: "Prototyping", category: "design-process", aliases: ["prototype", "rapid prototyping"] },
  { slug: "accessibility", label: "Accessibility", category: "design-process", aliases: ["a11y", "wcag"] },
  { slug: "information-architecture", label: "Information architecture", category: "design-process", aliases: ["ia", "information arch"] },

  // Tooling (~8)
  { slug: "figma-make", label: "Figma Make", category: "tooling", aliases: ["figma make", "figma.make"] },
  { slug: "cursor", label: "Cursor", category: "tooling", aliases: ["cursor editor", "cursor ide"] },
  { slug: "claude-code", label: "Claude Code", category: "tooling", aliases: ["claude code cli"] },
  { slug: "v0", label: "v0 by Vercel", category: "tooling", aliases: ["v0.dev", "vercel v0"] },
  { slug: "bolt", label: "Bolt", category: "tooling", aliases: ["bolt.new", "stackblitz bolt"] },
  { slug: "figma", label: "Figma", category: "tooling", aliases: ["figma design"] },
  { slug: "react", label: "React", category: "tooling", aliases: ["react.js", "reactjs"] },
  { slug: "tailwind", label: "Tailwind CSS", category: "tooling", aliases: ["tailwindcss", "tailwind css"] },

  // Growth / PM (~7)
  { slug: "activation", label: "Activation", category: "growth-pm", aliases: ["user activation", "activation rate"] },
  { slug: "retention", label: "Retention", category: "growth-pm", aliases: ["retention rate", "user retention"] },
  { slug: "onboarding", label: "Onboarding", category: "growth-pm", aliases: ["user onboarding", "product onboarding"] },
  { slug: "pricing", label: "Pricing", category: "growth-pm", aliases: ["pricing strategy", "saas pricing"] },
  { slug: "plg", label: "Product-led growth", category: "growth-pm", aliases: ["plg", "product led", "product-led"] },
  { slug: "conversion", label: "Conversion", category: "growth-pm", aliases: ["conversion rate", "cvr"] },
  { slug: "experimentation", label: "Experimentation", category: "growth-pm", aliases: ["a/b test", "ab test", "experiment"] },

  // Emergent (~7)
  { slug: "ai-product-designer", label: "AI Product Designer", category: "emergent", aliases: ["ai pd", "ai product design"] },
  { slug: "design-engineering", label: "Design engineering", category: "emergent", aliases: ["design engineer", "design+eng"] },
  { slug: "vibe-coding", label: "Vibe coding", category: "emergent", aliases: ["vibe code"] },
  { slug: "taste", label: "Taste", category: "emergent", aliases: ["good taste", "design taste"] },
  { slug: "craft", label: "Craft", category: "emergent", aliases: ["design craft", "high craft"] },
  { slug: "ai-design-review", label: "AI design review", category: "emergent", aliases: ["ai critique", "ai review"] },
  { slug: "generative-ui", label: "Generative UI", category: "emergent", aliases: ["gen ui", "generative interface"] },
];

async function main() {
  for (const t of TOPICS) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { label: t.label, category: t.category, aliases: t.aliases },
      create: t,
    });
  }
  const count = await prisma.topic.count();
  console.log(`Seeded ${count} topics.`);
}

main().finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add npm script**

Append to `package.json` `scripts`:

```json
"seed:topics": "tsx prisma/seed-topics.ts"
```

- [ ] **Step 3: Run the seed**

```bash
npm run seed:topics
```

Expected: `Seeded 40 topics.` (or exact count matching the list).

- [ ] **Step 4: Spot-check**

```bash
npx prisma studio
```

Open `Topic` table, verify ~40 rows exist with correct categories. Close Studio.

- [ ] **Step 5: Commit**

```bash
git add prisma/seed-topics.ts package.json
git commit -m "feat(seed): seed ~40 canonical topics for data journalism series"
```

---

## Task A3: Gap-scoring pure function (TDD)

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `src/lib/gap-scoring.ts`
- Test: `__tests__/gap-scoring/compute-gap.test.ts`

- [ ] **Step 1: Write the failing tests**

`__tests__/gap-scoring/compute-gap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { scoreGap, type RawCounts } from "@/lib/gap-scoring";

const totalPosts = 1000;
const totalJds = 2000;

describe("scoreGap", () => {
  it("computes gapRatio = influencerShare / jdShare", () => {
    const row = scoreGap({
      slug: "x",
      label: "X",
      category: "ai",
      influencerCount: 50,
      jdCount: 20,
      totalPosts,
      totalJds,
    });
    expect(row?.gapRatio).toBeCloseTo((50 / 1000) / (20 / 2000));
  });

  it("logGap is log2(gapRatio), symmetric at 1:1 equal shares", () => {
    const row = scoreGap({
      slug: "x", label: "X", category: "ai",
      influencerCount: 50, jdCount: 100, totalPosts: 1000, totalJds: 2000,
    });
    expect(row?.gapRatio).toBeCloseTo(1);
    expect(row?.logGap).toBeCloseTo(0);
  });

  it("returns null when influencerCount < 10 (sample-size exclusion)", () => {
    const row = scoreGap({
      slug: "x", label: "X", category: "ai",
      influencerCount: 5, jdCount: 100, totalPosts: 1000, totalJds: 2000,
    });
    expect(row).toBeNull();
  });

  it("returns null when jdCount < 10 (sample-size exclusion)", () => {
    const row = scoreGap({
      slug: "x", label: "X", category: "ai",
      influencerCount: 100, jdCount: 5, totalPosts: 1000, totalJds: 2000,
    });
    expect(row).toBeNull();
  });

  it("returns null when jdShare is 0 (zero-jd exclusion)", () => {
    const row = scoreGap({
      slug: "x", label: "X", category: "ai",
      influencerCount: 100, jdCount: 0, totalPosts: 1000, totalJds: 2000,
    });
    expect(row).toBeNull();
  });

  it("logGap is negative when JDs out-mention influencers", () => {
    const row = scoreGap({
      slug: "x", label: "X", category: "ai",
      influencerCount: 10, jdCount: 500, totalPosts: 1000, totalJds: 2000,
    });
    expect(row?.logGap).toBeLessThan(0);
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
npm test -- gap-scoring
```

Expected: all 6 tests fail with module-not-found error (`@/lib/gap-scoring`).

- [ ] **Step 3: Implement the function**

`src/lib/gap-scoring.ts`:

```ts
import { prisma } from "@/lib/db";

export type RawCounts = {
  slug: string;
  label: string;
  category: string;
  influencerCount: number;
  jdCount: number;
  totalPosts: number;
  totalJds: number;
};

export type GapRow = {
  slug: string;
  label: string;
  category: string;
  influencerShare: number;
  jdShare: number;
  gapRatio: number;
  logGap: number;
  influencerCount: number;
  jdCount: number;
};

export type ExcludedTopic = {
  slug: string;
  label: string;
  reason: "sample-size" | "zero-jd-share";
  influencerCount: number;
  jdCount: number;
};

export type GapReport = {
  snapshotDate: string;
  windowWeeks: 12 | 26 | 52;
  windowStart: string;
  windowEnd: string;
  totalPosts: number;
  totalJds: number;
  rows: GapRow[];
  excluded: ExcludedTopic[];
};

const MIN_SAMPLE = 10;

export function scoreGap(raw: RawCounts): GapRow | null {
  if (raw.influencerCount < MIN_SAMPLE) return null;
  if (raw.jdCount < MIN_SAMPLE) return null;
  const influencerShare = raw.influencerCount / raw.totalPosts;
  const jdShare = raw.jdCount / raw.totalJds;
  if (jdShare === 0) return null;
  const gapRatio = influencerShare / jdShare;
  const logGap = Math.log2(gapRatio);
  return {
    slug: raw.slug,
    label: raw.label,
    category: raw.category,
    influencerShare,
    jdShare,
    gapRatio,
    logGap,
    influencerCount: raw.influencerCount,
    jdCount: raw.jdCount,
  };
}

export async function computeGap(windowWeeks: 12 | 26 | 52 = 52): Promise<GapReport> {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - windowWeeks * 7);

  const [topics, totalPosts, totalJds] = await Promise.all([
    prisma.topic.findMany(),
    prisma.influencerPost.count({ where: { scrapedAt: { gte: windowStart } } }),
    prisma.jobListing.count({ where: { firstSeenAt: { gte: windowStart } } }),
  ]);

  const influencerCounts = await prisma.influencerPostTopic.groupBy({
    by: ["topicId"],
    where: { weekStart: { gte: windowStart } },
    _count: { influencerPostId: true },
  });
  const jdCounts = await prisma.jobListingTopic.groupBy({
    by: ["topicId"],
    where: { weekStart: { gte: windowStart } },
    _count: { jobListingId: true },
  });
  const influencerByTopicId = new Map(influencerCounts.map((r) => [r.topicId, r._count.influencerPostId]));
  const jdByTopicId = new Map(jdCounts.map((r) => [r.topicId, r._count.jobListingId]));

  const rows: GapRow[] = [];
  const excluded: ExcludedTopic[] = [];

  for (const topic of topics) {
    const influencerCount = influencerByTopicId.get(topic.id) ?? 0;
    const jdCount = jdByTopicId.get(topic.id) ?? 0;
    const scored = scoreGap({
      slug: topic.slug,
      label: topic.label,
      category: topic.category,
      influencerCount,
      jdCount,
      totalPosts,
      totalJds,
    });
    if (scored) {
      rows.push(scored);
    } else {
      const reason =
        influencerCount < MIN_SAMPLE || jdCount < MIN_SAMPLE ? "sample-size" : "zero-jd-share";
      excluded.push({ slug: topic.slug, label: topic.label, reason, influencerCount, jdCount });
    }
  }

  rows.sort((a, b) => b.logGap - a.logGap);

  return {
    snapshotDate: now.toISOString(),
    windowWeeks,
    windowStart: windowStart.toISOString(),
    windowEnd: now.toISOString(),
    totalPosts,
    totalJds,
    rows,
    excluded,
  };
}
```

Verify `JobListing.firstSeenAt` exists by grepping `prisma/schema.prisma`. If the actual field is different (e.g., `createdAt` or `postedAt`), swap to that name before committing. The right field is "when the listing was first ingested."

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- gap-scoring
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gap-scoring.ts __tests__/gap-scoring/
git commit -m "feat(gap-scoring): add pure scorer + async computeGap with sample-size exclusions"
```

---

## Task A4: Topic classifier (Haiku + prompt caching + Zod)

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `src/lib/topic-classifier.ts`
- Create: `trigger/classify-topics.ts`
- Reference: `src/lib/enrichment/haiku-enrich.ts` for the existing Haiku pattern

- [ ] **Step 1: Implement the classifier function**

`src/lib/topic-classifier.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

const MODEL = "claude-haiku-4-5-20251001";
const anthropic = new Anthropic();

const ResponseSchema = z.object({
  topics: z.array(z.string()),
});

function hashContent(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function stripJsonCodeFence(s: string): string {
  return s.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
}

async function buildSystemPrompt(): Promise<string> {
  const topics = await prisma.topic.findMany({ orderBy: { category: "asc" } });
  const taxonomy = topics.map((t) => ({
    slug: t.slug,
    label: t.label,
    category: t.category,
    aliases: t.aliases,
  }));
  return `You are a taxonomic classifier. Given a post or job description, return the slugs of any topics from the taxonomy that the text substantively discusses — not passing mentions.

Rules:
- Return ONLY slugs present in the taxonomy. No other slugs.
- A topic must be DISCUSSED, not merely name-dropped. A one-word mention does not count.
- Return an empty list if none apply. Never hallucinate.
- Respond with JSON only: {"topics": ["slug1", "slug2"]}

Taxonomy (${topics.length} topics):
${JSON.stringify(taxonomy, null, 2)}`;
}

let cachedSystemPrompt: string | null = null;

export async function classifyText(text: string): Promise<string[]> {
  if (!text || text.trim().length < 30) return [];

  const hash = hashContent(text);
  const cached = await prisma.classificationCache.findUnique({ where: { contentHash: hash } });
  if (cached) return cached.topicSlugs;

  if (!cachedSystemPrompt) cachedSystemPrompt = await buildSystemPrompt();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: [{ type: "text", text: cachedSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: text.slice(0, 8000) }],
  });

  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("");
  const parsed = ResponseSchema.safeParse(JSON.parse(stripJsonCodeFence(raw)));
  const slugs = parsed.success ? parsed.data.topics : [];

  const validSlugs = new Set(
    (await prisma.topic.findMany({ select: { slug: true } })).map((t) => t.slug)
  );
  const filtered = slugs.filter((s) => validSlugs.has(s));

  await prisma.classificationCache.upsert({
    where: { contentHash: hash },
    update: { topicSlugs: filtered },
    create: { contentHash: hash, topicSlugs: filtered },
  });

  return filtered;
}
```

- [ ] **Step 2: Implement the Trigger.dev task**

`trigger/classify-topics.ts`:

```ts
import { schedules } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db";
import { classifyText } from "@/lib/topic-classifier";

const BATCH_SIZE = 50;
const MAX_BATCHES_PER_RUN = 20; // caps runtime + cost per nightly tick

function weekStartOf(d: Date): Date {
  const result = new Date(d);
  result.setUTCHours(0, 0, 0, 0);
  const day = result.getUTCDay();
  result.setUTCDate(result.getUTCDate() - day);
  return result;
}

export const classifyTopics = schedules.task({
  id: "classify-topics",
  cron: "30 3 * * *", // 03:30 UTC nightly
  maxDuration: 3600,
  run: async () => {
    let totalClassified = 0;

    for (let batch = 0; batch < MAX_BATCHES_PER_RUN; batch++) {
      const jds = await prisma.jobListing.findMany({
        where: { jobListingTopics: { none: {} }, description: { not: null } },
        select: { id: true, description: true, firstSeenAt: true },
        take: BATCH_SIZE,
      });
      if (jds.length === 0) break;

      for (const jd of jds) {
        const text = jd.description ?? "";
        const slugs = await classifyText(text);
        const topicIds = await prisma.topic.findMany({
          where: { slug: { in: slugs } },
          select: { id: true },
        });
        if (topicIds.length === 0) {
          // still insert a sentinel by skipping — the "none" filter won't re-pick this
          // so we insert a tombstone row pointing to a reserved slug. Simpler: insert nothing
          // and filter using a ClassificationCache hit instead. For this spec: insert nothing
          // and accept re-classification will hit the content-hash cache (free).
          continue;
        }
        const weekStart = weekStartOf(jd.firstSeenAt ?? new Date());
        await prisma.jobListingTopic.createMany({
          data: topicIds.map((t) => ({
            jobListingId: jd.id,
            topicId: t.id,
            mentionCount: 1,
            weekStart,
          })),
          skipDuplicates: true,
        });
        totalClassified++;
      }
    }

    for (let batch = 0; batch < MAX_BATCHES_PER_RUN; batch++) {
      const posts = await prisma.influencerPost.findMany({
        where: { influencerPostTopics: { none: {} }, text: { not: null } },
        select: { id: true, text: true, scrapedAt: true },
        take: BATCH_SIZE,
      });
      if (posts.length === 0) break;

      for (const post of posts) {
        const text = post.text ?? "";
        const slugs = await classifyText(text);
        const topicIds = await prisma.topic.findMany({
          where: { slug: { in: slugs } },
          select: { id: true },
        });
        if (topicIds.length === 0) continue;
        const weekStart = weekStartOf(post.scrapedAt);
        await prisma.influencerPostTopic.createMany({
          data: topicIds.map((t) => ({
            influencerPostId: post.id,
            topicId: t.id,
            mentionCount: 1,
            weekStart,
          })),
          skipDuplicates: true,
        });
        totalClassified++;
      }
    }

    return { totalClassified };
  },
});
```

Cross-check: open `prisma/schema.prisma` and confirm actual field names for `JobListing.description` + `firstSeenAt` and `InfluencerPost.text` + `scrapedAt`. Swap if they differ (e.g., the post field may be `content` or `body`).

- [ ] **Step 3: Local smoke test (one item)**

```bash
npx tsx -e "import('./src/lib/topic-classifier').then(async ({ classifyText }) => { const r = await classifyText('We are hiring a Senior Product Designer to design AI agent workflows using Claude and Figma.'); console.log(r); })"
```

Expected: prints array including at least `ai-agents`, `claude`, `figma`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/topic-classifier.ts trigger/classify-topics.ts
git commit -m "feat(classifier): Haiku topic classifier with content-hash cache + nightly Trigger task"
```

---

## Task A5: Classifier audit (manual, 50+50 sample)

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `docs/classifier-audit-2026-04.md`

- [ ] **Step 1: Build the sample**

Create a one-off script you'll delete after. Paste and run:

```bash
npx tsx -e "
import { prisma } from './src/lib/db';
import { classifyText } from './src/lib/topic-classifier';

async function main() {
  const jds = await prisma.jobListing.findMany({
    where: { description: { not: null } },
    take: 50, orderBy: { firstSeenAt: 'desc' },
    select: { id: true, description: true },
  });
  const posts = await prisma.influencerPost.findMany({
    where: { text: { not: null } },
    take: 50, orderBy: { scrapedAt: 'desc' },
    select: { id: true, text: true },
  });
  const results = [];
  for (const jd of jds) {
    const topics = await classifyText(jd.description ?? '');
    results.push({ kind: 'jd', id: jd.id, excerpt: (jd.description ?? '').slice(0, 200), topics });
  }
  for (const p of posts) {
    const topics = await classifyText(p.text ?? '');
    results.push({ kind: 'post', id: p.id, excerpt: (p.text ?? '').slice(0, 200), topics });
  }
  console.log(JSON.stringify(results, null, 2));
}
main().finally(() => prisma.\$disconnect());
" > /tmp/audit-sample.json
```

- [ ] **Step 2: Hand-audit**

Open `/tmp/audit-sample.json`. For each of the 100 rows, note (in `docs/classifier-audit-2026-04.md`):

```md
# Classifier Audit — 2026-04-??

Sample: 50 JDs + 50 InfluencerPosts, most recent.
Model: claude-haiku-4-5-20251001
Taxonomy version: 40 topics (commit <sha>)

## Per-row outcomes

| # | kind | id | machine topics | correct? | missing topics | wrong topics |
| 1 | jd   | abc | [ai-agents]    | yes      | —              | —            |
| 2 | post | def | [rag, claude]  | partial  | embeddings     | claude       |
...

## Summary

- Total assignments: N (sum of topic counts across rows)
- Correct assignments: M
- **Precision = M / N = ??%**
- Common failure modes: [list]

## Prompt iteration

[If precision < 90%, describe prompt change + reason. Rerun the audit with the updated prompt. Include both runs in this file.]
```

- [ ] **Step 3: Iterate if needed**

If precision < 90%, edit the system prompt in `src/lib/topic-classifier.ts`, rerun steps 1-2. Record the change and the new precision in the audit doc.

- [ ] **Step 4: Commit audit**

```bash
git add docs/classifier-audit-2026-04.md
git commit -m "docs(classifier): audit of 50 JD + 50 post classifications — precision XX%"
```

---

## Task A6: Classifier backfill on full corpus

**Repo:** `/Users/briantighe/design-drift`

- [ ] **Step 1: Trigger a one-off backfill**

In Trigger.dev dashboard, manually invoke the `classify-topics` task repeatedly (it batches to 20 × 50 = 1000 items per run). Watch cost in Anthropic console; stop if per-run cost diverges significantly from the ~$12 total estimate.

Easier path: push to production after A9, then let the nightly cron run for a few nights. The task is fully idempotent — it only selects un-classified rows each time.

- [ ] **Step 2: Verify coverage**

```bash
npx tsx -e "
import { prisma } from './src/lib/db';
(async () => {
  const jdCoverage = await prisma.jobListing.count({ where: { jobListingTopics: { some: {} } } });
  const jdTotal = await prisma.jobListing.count({ where: { description: { not: null } } });
  const postCoverage = await prisma.influencerPost.count({ where: { influencerPostTopics: { some: {} } } });
  const postTotal = await prisma.influencerPost.count({ where: { text: { not: null } } });
  console.log({ jdCoverage, jdTotal, postCoverage, postTotal,
    jdPct: (jdCoverage/jdTotal*100).toFixed(1),
    postPct: (postCoverage/postTotal*100).toFixed(1) });
  await prisma.\$disconnect();
})();"
```

Expected: both `Pct` values > 95%. If not, the task hit an error; inspect Trigger dashboard logs.

- [ ] **Step 3: Spot-check the gap report**

```bash
npx tsx -e "
import { computeGap } from './src/lib/gap-scoring';
computeGap(52).then((r) => console.log(JSON.stringify({
  totalPosts: r.totalPosts, totalJds: r.totalJds,
  topGap: r.rows.slice(0,5).map(x => ({ slug: x.slug, logGap: x.logGap.toFixed(2) })),
  bottomGap: r.rows.slice(-5).map(x => ({ slug: x.slug, logGap: x.logGap.toFixed(2) })),
  excluded: r.excluded.length,
}, null, 2)));"
```

Expected: reasonable-looking rankings, no `null`/`NaN` values.

- [ ] **Step 4: No commit needed** (this is a data-only step)

---

## Task A7: API route `/api/gap-data` with bearer auth

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `src/app/api/gap-data/route.ts`

- [ ] **Step 1: Add env var**

Append to `.env.local`:

```
GAP_DATA_TOKEN=<generate-with-openssl-rand-hex-32>
```

Generate:

```bash
openssl rand -hex 32
```

Paste into `.env.local`. Also add to Vercel project env (production + preview scopes).

- [ ] **Step 2: Create the route**

`src/app/api/gap-data/route.ts`:

```ts
import { NextResponse } from "next/server";
import { computeGap } from "@/lib/gap-scoring";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.GAP_DATA_TOKEN}`;
  if (!process.env.GAP_DATA_TOKEN || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const weeksParam = Number(url.searchParams.get("weeks") ?? "52");
  const windowWeeks = ([12, 26, 52] as const).includes(weeksParam as 12 | 26 | 52)
    ? (weeksParam as 12 | 26 | 52)
    : 52;

  const report = await computeGap(windowWeeks);
  return NextResponse.json(report);
}
```

- [ ] **Step 3: Smoke test locally**

```bash
npm run dev
# in another shell:
curl -s -H "Authorization: Bearer $(grep GAP_DATA_TOKEN .env.local | cut -d= -f2)" \
  http://localhost:3000/api/gap-data?weeks=52 | jq '.totalPosts, .totalJds, (.rows | length), (.excluded | length)'
```

Expected: four numbers print, all reasonable. With no token, expect `{"error":"unauthorized"}`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/gap-data/route.ts
git commit -m "feat(api): add bearer-auth /api/gap-data route for briantighe-v2 consumption"
```

---

## Task A8: PROCESSES.md creation

**Repo:** `/Users/briantighe/design-drift`
**Files:**
- Create: `PROCESSES.md`

- [ ] **Step 1: Create the file**

```md
# Design Drift — Processes

## 2026-04-24 — Topic classification + gap scoring

### Purpose

Classify every `JobListing` and `InfluencerPost` against a ~40-topic taxonomy to enable gap-score analysis (what design discourse talks about vs. what companies hire for) powering the briantighe.design data journalism series.

### Taxonomy

Stored in the `Topic` table. Five categories: `ai`, `design-process`, `tooling`, `growth-pm`, `emergent`. Seeded via `prisma/seed-topics.ts`. To revise, edit the seed file and rerun `npm run seed:topics` (idempotent upsert).

### Classifier

- Model: `claude-haiku-4-5-20251001`
- Prompt: see `src/lib/topic-classifier.ts` `buildSystemPrompt()`
- Input: raw JD description or post text, truncated to 8000 chars
- Output: `{ topics: string[] }` filtered against valid slugs
- Caching: content SHA-256 hash → slug list in `ClassificationCache` table. Re-classifying identical text is free.

### Scoring formula

For each topic, within a rolling window of N weeks:

```
influencerShare = (# posts classified with topic) / (# total posts in window)
jdShare         = (# JDs classified with topic)  / (# total JDs in window)
gapRatio        = influencerShare / jdShare
logGap          = log2(gapRatio)        // symmetric around 0
```

### Exclusion rules

A topic is excluded from the report (moved to `excluded[]`) if:
- `influencerCount < 10` (reason `sample-size`)
- `jdCount < 10` (reason `sample-size`)
- `jdShare === 0` (reason `zero-jd-share`)

### Validation

Pre-backfill, audit 50 JDs + 50 posts by hand. Target precision ≥ 90%. Results recorded in `docs/classifier-audit-2026-04.md`.

### Schedule

Nightly `classify-topics` Trigger.dev task at `30 3 * * *` UTC. Caps at 20 batches × 50 items = 1000 rows per run. Backfill: repeated invocations over several nights.

### Change log

- 2026-04-24: Initial taxonomy + classifier shipped.
```

- [ ] **Step 2: Commit**

```bash
git add PROCESSES.md
git commit -m "docs: add PROCESSES.md documenting taxonomy + classifier + gap scoring"
```

---

## Task A9: Deploy Design Drift

**Repo:** `/Users/briantighe/design-drift`

- [ ] **Step 1: Verify Vercel env**

```bash
npx vercel env ls | grep GAP_DATA_TOKEN
```

Expected: appears under Production (and ideally Preview).

- [ ] **Step 2: Push to main**

```bash
git push origin main
```

Vercel auto-deploys. Monitor:

```bash
npx vercel ls design-drift | head -5
```

- [ ] **Step 3: Smoke test production endpoint**

```bash
curl -s -H "Authorization: Bearer $GAP_DATA_TOKEN" \
  https://design-drift-two.vercel.app/api/gap-data?weeks=52 \
  | jq '.totalPosts, .totalJds, (.rows | length)'
```

Expected: three numbers. Record them — briantighe-v2 bake script will pull from this endpoint.

- [ ] **Step 4: Deploy the Trigger task**

```bash
npx trigger.dev@latest deploy
```

Confirms `classify-topics` task is live.

- [ ] **Step 5: No commit** (deployment is the artifact)

---

# Part B — briantighe-v2 scaffolding

## Task B1: Directory structure + env stub

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `.env.example`, `.env.local`
- Create: empty dirs `content/data/2026/`, `content/methodology/`, `components/figures/discourse-vs-hiring/__fixtures__/`

- [ ] **Step 1: Create env files**

`.env.example`:

```
# Authenticated endpoint for pulling Design Drift gap-data snapshots
GAP_DATA_URL=https://design-drift-two.vercel.app/api/gap-data
GAP_DATA_TOKEN=
```

`.env.local` (NOT committed — already in `.gitignore` via `.env*`):

```
GAP_DATA_URL=https://design-drift-two.vercel.app/api/gap-data
GAP_DATA_TOKEN=<paste the value from design-drift>
```

- [ ] **Step 2: Create the directories (via placeholder files that will be replaced)**

```bash
mkdir -p content/data/2026 content/methodology components/figures/discourse-vs-hiring/__fixtures__
touch content/data/2026/.gitkeep content/methodology/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add .env.example content/data/2026/.gitkeep content/methodology/.gitkeep
git commit -m "chore: scaffold directories + env example for data journalism series"
```

---

## Task B2: `<DataSource />` component

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/data-source.tsx`

- [ ] **Step 1: Build the component**

`components/data-source.tsx`:

```tsx
type Props = {
  source: string;
  snapshotDate: string; // ISO
  commitSha?: string;
  methodologyHref: string;
};

export function DataSource({ source, snapshotDate, commitSha, methodologyHref }: Props) {
  const date = new Date(snapshotDate);
  const formatted = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <p
      className="data-source"
      style={{
        fontStyle: "italic",
        color: "var(--color-ink-muted)",
        fontSize: "0.85em",
        marginTop: "-0.5em",
        marginBottom: "2em",
        borderLeft: "2px solid var(--color-rule)",
        paddingLeft: "0.75em",
      }}
    >
      Data: {source}, snapshot {formatted}
      {commitSha ? ` (commit ${commitSha.slice(0, 7)})` : null}. <a href={methodologyHref}>Methodology →</a>
    </p>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/data-source.tsx
git commit -m "feat(components): add DataSource citation block for data journalism essays"
```

---

## Task B3: `/methodology/[slug]` route

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `app/methodology/[slug]/page.tsx`
- Modify: `lib/content.ts`

- [ ] **Step 1: Add `getMethodologyBySlug`**

Append to `lib/content.ts`:

```ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type MethodologyMetadata = {
  slug: string;
  title: string;
  essaySlug: string;   // the essay this methodology documents
  essayYear: string;
  date: string;
};

export async function getMethodologyBySlug(slug: string): Promise<MethodologyMetadata | null> {
  const file = path.join(process.cwd(), "content/methodology", `${slug}.mdx`);
  try {
    const raw = await fs.readFile(file, "utf8");
    const { data } = matter(raw);
    return { slug, ...(data as Omit<MethodologyMetadata, "slug">) };
  } catch {
    return null;
  }
}

export async function getAllMethodologySlugs(): Promise<string[]> {
  const dir = path.join(process.cwd(), "content/methodology");
  const entries = await fs.readdir(dir);
  return entries.filter((e) => e.endsWith(".mdx")).map((e) => e.replace(/\.mdx$/, ""));
}
```

If `lib/content.ts` already imports matter or fs differently, match that style and reuse existing helpers rather than duplicating.

- [ ] **Step 2: Create the route**

`app/methodology/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMethodologyBySlug, getAllMethodologySlugs } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllMethodologySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getMethodologyBySlug(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — Methodology`,
    alternates: { canonical: `/methodology/${slug}` },
  };
}

export default async function MethodologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = await getMethodologyBySlug(slug);
  if (!meta) notFound();

  const mod = await import(`@/content/methodology/${slug}.mdx`);
  const MDXContent = mod.default;

  return (
    <article className="methodology-page">
      <header style={{ marginBottom: "2rem" }}>
        <p className="label">Methodology</p>
        <h1>{meta.title}</h1>
        <p className="subtitle">
          For <a href={`/essays/${meta.essayYear}/${meta.essaySlug}`}>the corresponding essay</a>.
        </p>
      </header>
      <MDXContent />
    </article>
  );
}
```

Check what `generateStaticParams` + `params` signature Next 16 wants. If this version needs non-Promise `params`, adjust (reference the essays route as the known-good pattern).

- [ ] **Step 3: Commit**

```bash
git add app/methodology lib/content.ts
git commit -m "feat(routes): add /methodology/[slug] route for series methodology pages"
```

---

## Task B4: `scripts/bake-data.mjs` with freshness gate

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `scripts/bake-data.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the script**

`scripts/bake-data.mjs`:

```js
#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const slug = process.argv[2];
const allowStale = process.argv.includes("--allow-stale");

if (!slug) {
  console.error("Usage: node scripts/bake-data.mjs <slug> [--allow-stale]");
  process.exit(1);
}

const url = process.env.GAP_DATA_URL;
const token = process.env.GAP_DATA_TOKEN;
if (!url || !token) {
  console.error("GAP_DATA_URL and GAP_DATA_TOKEN must be set in .env.local");
  process.exit(1);
}

console.log(`Baking ${slug}...`);

const res = await fetch(`${url}?weeks=52`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();

const snapshotAge = Date.now() - new Date(data.snapshotDate).getTime();
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
if (snapshotAge > THIRTY_DAYS && !allowStale) {
  console.error(
    `Snapshot is ${Math.round(snapshotAge / 86_400_000)} days old. Pass --allow-stale to proceed.`
  );
  process.exit(1);
}

const year = new Date(data.snapshotDate).getUTCFullYear();
const outDir = path.join(process.cwd(), "content/data", String(year));
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.json`);
await fs.writeFile(outPath, JSON.stringify(data, sortReplacer, 2) + "\n");

console.log(`Wrote ${outPath}`);
console.log(`  snapshotDate: ${data.snapshotDate}`);
console.log(`  totalPosts: ${data.totalPosts}`);
console.log(`  totalJds: ${data.totalJds}`);
console.log(`  rows: ${data.rows.length}`);
console.log(`  excluded: ${data.excluded.length}`);

function sortReplacer(_key, value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = value[k];
        return acc;
      }, {});
  }
  return value;
}
```

The sort replacer keeps JSON diffs across bakes readable.

- [ ] **Step 2: Add npm script**

In `package.json` `scripts`, add:

```json
"bake": "node --env-file=.env.local scripts/bake-data.mjs"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/bake-data.mjs package.json
git commit -m "feat(scripts): add bake-data.mjs with 30-day freshness gate"
```

---

## Task B5: First bake

**Repo:** `/Users/briantighe/briantighe-v2`

- [ ] **Step 1: Ensure `.env.local` has the token**

Repeat of B1 Step 1. `cat .env.local` to confirm both vars set.

- [ ] **Step 2: Run the bake**

```bash
npm run bake discourse-vs-hiring
```

Expected: prints `Wrote content/data/2026/discourse-vs-hiring.json`, plus the summary counts. If it warns about staleness, pass `--allow-stale` temporarily.

- [ ] **Step 3: Inspect the JSON**

```bash
jq '.totalPosts, .totalJds, (.rows | length), (.excluded | length), .rows[0:3]' content/data/2026/discourse-vs-hiring.json
```

Expected: reasonable numbers, top-3 rows have `slug`, `logGap`, `influencerCount`, `jdCount` etc.

- [ ] **Step 4: Commit the snapshot**

```bash
git add content/data/2026/discourse-vs-hiring.json
git commit -m "data: bake initial discourse-vs-hiring snapshot"
```

---

# Part C — Figures

## Task C1: Figure types + fixture

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/figures/discourse-vs-hiring/types.ts`
- Create: `components/figures/discourse-vs-hiring/__fixtures__/sample.json`

- [ ] **Step 1: Types mirror the baked JSON**

`components/figures/discourse-vs-hiring/types.ts`:

```ts
export type GapRow = {
  slug: string;
  label: string;
  category: "ai" | "design-process" | "tooling" | "growth-pm" | "emergent";
  influencerShare: number;
  jdShare: number;
  gapRatio: number;
  logGap: number;
  influencerCount: number;
  jdCount: number;
};

export type ExcludedTopic = {
  slug: string;
  label: string;
  reason: "sample-size" | "zero-jd-share";
  influencerCount: number;
  jdCount: number;
};

export type GapReport = {
  snapshotDate: string;
  windowWeeks: 12 | 26 | 52;
  windowStart: string;
  windowEnd: string;
  totalPosts: number;
  totalJds: number;
  rows: GapRow[];
  excluded: ExcludedTopic[];
};
```

- [ ] **Step 2: Fixture (hand-authored realistic sample)**

`components/figures/discourse-vs-hiring/__fixtures__/sample.json`:

```json
{
  "snapshotDate": "2026-04-24T00:00:00.000Z",
  "windowWeeks": 52,
  "windowStart": "2025-04-24T00:00:00.000Z",
  "windowEnd": "2026-04-24T00:00:00.000Z",
  "totalPosts": 24183,
  "totalJds": 86201,
  "rows": [
    { "slug": "vibe-coding", "label": "Vibe coding", "category": "emergent", "influencerShare": 0.042, "jdShare": 0.004, "gapRatio": 10.5, "logGap": 3.39, "influencerCount": 1016, "jdCount": 345 },
    { "slug": "ai-design-review", "label": "AI design review", "category": "emergent", "influencerShare": 0.037, "jdShare": 0.006, "gapRatio": 6.17, "logGap": 2.62, "influencerCount": 895, "jdCount": 517 },
    { "slug": "ai-agents", "label": "AI agents", "category": "ai", "influencerShare": 0.128, "jdShare": 0.031, "gapRatio": 4.13, "logGap": 2.05, "influencerCount": 3096, "jdCount": 2672 },
    { "slug": "mcp", "label": "Model Context Protocol", "category": "ai", "influencerShare": 0.024, "jdShare": 0.008, "gapRatio": 3.0, "logGap": 1.58, "influencerCount": 580, "jdCount": 690 },
    { "slug": "generative-ui", "label": "Generative UI", "category": "emergent", "influencerShare": 0.031, "jdShare": 0.013, "gapRatio": 2.38, "logGap": 1.25, "influencerCount": 750, "jdCount": 1121 },
    { "slug": "claude-code", "label": "Claude Code", "category": "tooling", "influencerShare": 0.022, "jdShare": 0.012, "gapRatio": 1.83, "logGap": 0.87, "influencerCount": 532, "jdCount": 1034 },
    { "slug": "design-engineering", "label": "Design engineering", "category": "emergent", "influencerShare": 0.048, "jdShare": 0.028, "gapRatio": 1.71, "logGap": 0.78, "influencerCount": 1161, "jdCount": 2414 },
    { "slug": "ai-product-designer", "label": "AI Product Designer", "category": "emergent", "influencerShare": 0.053, "jdShare": 0.032, "gapRatio": 1.66, "logGap": 0.73, "influencerCount": 1282, "jdCount": 2758 },
    { "slug": "figma-make", "label": "Figma Make", "category": "tooling", "influencerShare": 0.014, "jdShare": 0.011, "gapRatio": 1.27, "logGap": 0.34, "influencerCount": 338, "jdCount": 948 },
    { "slug": "prompt-engineering", "label": "Prompt engineering", "category": "ai", "influencerShare": 0.036, "jdShare": 0.030, "gapRatio": 1.20, "logGap": 0.26, "influencerCount": 870, "jdCount": 2586 },
    { "slug": "design-systems", "label": "Design systems", "category": "design-process", "influencerShare": 0.072, "jdShare": 0.094, "gapRatio": 0.77, "logGap": -0.39, "influencerCount": 1741, "jdCount": 8103 },
    { "slug": "accessibility", "label": "Accessibility", "category": "design-process", "influencerShare": 0.019, "jdShare": 0.031, "gapRatio": 0.61, "logGap": -0.71, "influencerCount": 459, "jdCount": 2672 },
    { "slug": "research-ops", "label": "Research operations", "category": "design-process", "influencerShare": 0.011, "jdShare": 0.019, "gapRatio": 0.58, "logGap": -0.79, "influencerCount": 266, "jdCount": 1638 },
    { "slug": "user-research", "label": "User research", "category": "design-process", "influencerShare": 0.024, "jdShare": 0.068, "gapRatio": 0.35, "logGap": -1.51, "influencerCount": 580, "jdCount": 5862 },
    { "slug": "prototyping", "label": "Prototyping", "category": "design-process", "influencerShare": 0.018, "jdShare": 0.062, "gapRatio": 0.29, "logGap": -1.79, "influencerCount": 435, "jdCount": 5344 },
    { "slug": "figma", "label": "Figma", "category": "tooling", "influencerShare": 0.041, "jdShare": 0.154, "gapRatio": 0.27, "logGap": -1.89, "influencerCount": 991, "jdCount": 13275 },
    { "slug": "information-architecture", "label": "Information architecture", "category": "design-process", "influencerShare": 0.006, "jdShare": 0.023, "gapRatio": 0.26, "logGap": -1.94, "influencerCount": 145, "jdCount": 1983 }
  ],
  "excluded": [
    { "slug": "fine-tuning", "label": "Fine-tuning", "reason": "sample-size", "influencerCount": 7, "jdCount": 312 },
    { "slug": "embeddings", "label": "Embeddings", "reason": "sample-size", "influencerCount": 8, "jdCount": 245 }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add components/figures/discourse-vs-hiring/types.ts components/figures/discourse-vs-hiring/__fixtures__/sample.json
git commit -m "feat(figures): add shared types + hand-authored fixture for discourse-vs-hiring"
```

---

## Task C2: F1 — Gap dumbbell (hero)

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/figures/discourse-vs-hiring/gap-dumbbell.tsx`

- [ ] **Step 1: Build the figure**

Match the existing pattern in `components/figures/figma-valuation.tsx` — server component, fixed `W`/`H`/`PAD`, `viewBox`, CSS vars, wrapped in `<figure className="inline-figure">`.

`components/figures/discourse-vs-hiring/gap-dumbbell.tsx`:

```tsx
import type { GapReport } from "./types";

const W = 680;
const PAD = { top: 40, right: 24, bottom: 48, left: 180 };
const ROW_HEIGHT = 22;

const CATEGORY_COLORS: Record<string, string> = {
  ai: "var(--color-accent)",
  "design-process": "var(--color-ink)",
  tooling: "var(--color-ink-muted)",
  "growth-pm": "var(--color-ink)",
  emergent: "var(--color-accent)",
};

export function GapDumbbell({ data }: { data: GapReport }) {
  const rows = [...data.rows].sort((a, b) => b.logGap - a.logGap);
  const H = PAD.top + PAD.bottom + rows.length * ROW_HEIGHT;
  const chartW = W - PAD.left - PAD.right;

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.logGap)));
  const scaleX = (v: number) => PAD.left + (v / maxAbs) * (chartW / 2) + chartW / 2;
  const zeroX = scaleX(0);

  const ticks = [-Math.ceil(maxAbs), -1, 0, 1, Math.ceil(maxAbs)];

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`${rows.length} topics ranked by the log-ratio of influencer-post frequency to job-listing frequency. Topics with a positive log-gap are over-represented in design discourse relative to hiring; negative means under-represented.`}
      >
        <title>Discourse vs. hiring gap, ranked</title>
        <desc>
          Each row is a topic. A horizontal segment connects hire-share (left end) to discourse-share (right end).
          Positive log-gap means discourse out-talks hiring; negative means hiring out-mentions discourse.
        </desc>

        {/* Axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={scaleX(t)}
              x2={scaleX(t)}
              y1={PAD.top - 8}
              y2={H - PAD.bottom + 4}
              stroke="var(--color-rule)"
              strokeWidth={t === 0 ? 1 : 0.5}
              strokeDasharray={t === 0 ? "none" : "2 2"}
            />
            <text
              x={scaleX(t)}
              y={H - PAD.bottom + 18}
              fontSize={10}
              textAnchor="middle"
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {t === 0 ? "equal" : (t > 0 ? "+" : "") + t + "×"}
            </text>
          </g>
        ))}

        {/* Rows */}
        {rows.map((r, i) => {
          const y = PAD.top + i * ROW_HEIGHT + ROW_HEIGHT / 2;
          const xStart = Math.min(zeroX, scaleX(r.logGap));
          const xEnd = Math.max(zeroX, scaleX(r.logGap));
          const color = CATEGORY_COLORS[r.category] ?? "var(--color-ink)";
          return (
            <g key={r.slug}>
              <text
                x={PAD.left - 10}
                y={y + 4}
                fontSize={11}
                textAnchor="end"
                fill="var(--color-ink)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {r.label}
              </text>
              <line
                x1={xStart}
                x2={xEnd}
                y1={y}
                y2={y}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle cx={scaleX(r.logGap)} cy={y} r={4} fill={color} />
              <circle cx={zeroX} cy={y} r={2} fill="var(--color-ink-muted)" opacity={0.5} />
              <text
                x={scaleX(r.logGap) + (r.logGap >= 0 ? 8 : -8)}
                y={y + 4}
                fontSize={10}
                textAnchor={r.logGap >= 0 ? "start" : "end"}
                fill="var(--color-ink-muted)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {(r.logGap >= 0 ? "+" : "") + r.logGap.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={PAD.left + chartW * 0.25}
          y={PAD.top - 20}
          fontSize={10}
          textAnchor="middle"
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          hiring out-mentions
        </text>
        <text
          x={PAD.left + chartW * 0.75}
          y={PAD.top - 20}
          fontSize={10}
          textAnchor="middle"
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          discourse out-talks
        </text>
      </svg>
      <figcaption>
        Forty topics, ranked by log₂ of the ratio between discourse mentions and job-listing mentions.
        Anything above +1 appears twice as often in posts as in JDs. Data: 52-week window,
        Design Drift snapshot {new Date(data.snapshotDate).toLocaleDateString()}.
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add components/figures/discourse-vs-hiring/gap-dumbbell.tsx
git commit -m "feat(figures): add F1 GapDumbbell hero figure"
```

---

## Task C3: F2 — Topic taxonomy map

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/figures/discourse-vs-hiring/topic-taxonomy-map.tsx`

- [ ] **Step 1: Build the figure**

A static taxonomy overview. Five category columns, topics listed underneath. Minimal geometry — this is a reference table dressed as a figure.

```tsx
import type { GapReport } from "./types";

const CATEGORIES = [
  { slug: "ai", label: "AI" },
  { slug: "design-process", label: "Design process" },
  { slug: "tooling", label: "Tooling" },
  { slug: "growth-pm", label: "Growth / PM" },
  { slug: "emergent", label: "Emergent" },
] as const;

const W = 680;
const COL_W = W / CATEGORIES.length;
const ROW_H = 18;
const HEADER_H = 36;

export function TopicTaxonomyMap({ data }: { data: GapReport }) {
  const all = [...data.rows, ...data.excluded.map((e) => ({ slug: e.slug, label: e.label, category: categoryFor(e.slug, data) }))];
  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    topics: all.filter((t) => t.category === c.slug).sort((a, b) => a.label.localeCompare(b.label)),
  }));
  const maxRows = Math.max(...byCategory.map((c) => c.topics.length));
  const H = HEADER_H + maxRows * ROW_H + 16;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Five categories of topics: ${CATEGORIES.map((c) => c.label).join(", ")}. ${all.length} topics total.`}
      >
        <title>Topic taxonomy</title>
        <desc>{all.length} topics grouped into five categories.</desc>
        {byCategory.map((c, i) => (
          <g key={c.slug} transform={`translate(${i * COL_W}, 0)`}>
            <text
              x={COL_W / 2}
              y={20}
              fontSize={11}
              textAnchor="middle"
              fill="var(--color-ink)"
              style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
            >
              {c.label}
            </text>
            <line x1={8} x2={COL_W - 8} y1={28} y2={28} stroke="var(--color-rule)" strokeWidth={0.5} />
            {c.topics.map((t, j) => (
              <text
                key={t.slug}
                x={COL_W / 2}
                y={HEADER_H + j * ROW_H}
                fontSize={10}
                textAnchor="middle"
                fill="var(--color-ink-muted)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {t.label}
              </text>
            ))}
          </g>
        ))}
      </svg>
      <figcaption>
        The ~40-term taxonomy used for classification, grouped by category. Full definitions and aliases live on the
        methodology page.
      </figcaption>
    </figure>
  );
}

function categoryFor(slug: string, data: GapReport): string {
  const row = data.rows.find((r) => r.slug === slug);
  return row?.category ?? "emergent";
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/figures/discourse-vs-hiring/topic-taxonomy-map.tsx
git commit -m "feat(figures): add F2 TopicTaxonomyMap reference figure"
```

---

## Task C4: F3 — Corpus scale over time (margin-figure sized)

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/figures/discourse-vs-hiring/corpus-scale-over-time.tsx`

**Note:** The gap-report JSON currently has no weekly series — only the aggregate window counts. This figure needs that data.

- [ ] **Step 1: Extend the API + types (if not already)**

Add `weeklyTotals` to `GapReport` in `design-drift/src/lib/gap-scoring.ts`:

```ts
// In computeGap, alongside the existing queries:
const jdsByWeek = await prisma.jobListing.groupBy({
  by: ["firstSeenAt"],
  where: { firstSeenAt: { gte: windowStart } },
  _count: true,
});
const postsByWeek = await prisma.influencerPost.groupBy({
  by: ["scrapedAt"],
  where: { scrapedAt: { gte: windowStart } },
  _count: true,
});
```

This is incorrect — `groupBy` on a timestamp column groups by exact timestamp. You need a week-bucketed count. Replace with raw SQL:

```ts
const weeklyTotals = await prisma.$queryRaw<
  Array<{ weekStart: Date; posts: bigint; jds: bigint }>
>`
  WITH weeks AS (
    SELECT generate_series(
      date_trunc('week', ${windowStart}::timestamp),
      date_trunc('week', NOW()),
      interval '1 week'
    ) AS week_start
  )
  SELECT
    w.week_start AS "weekStart",
    COUNT(DISTINCT ip.id) AS posts,
    COUNT(DISTINCT jl.id) AS jds
  FROM weeks w
  LEFT JOIN "InfluencerPost" ip ON date_trunc('week', ip."scrapedAt") = w.week_start
  LEFT JOIN "JobListing"     jl ON date_trunc('week', jl."firstSeenAt") = w.week_start
  GROUP BY w.week_start
  ORDER BY w.week_start;
`;
```

Add to `GapReport`:

```ts
weeklyTotals: Array<{ weekStart: string; posts: number; jds: number }>;
```

Serialize `bigint → Number` in the returned report.

Add a matching Vitest test (`weeklyTotals` has expected length ~= windowWeeks+1; each entry has week-aligned dates).

Also update **both** of these in briantighe-v2:
- `components/figures/discourse-vs-hiring/types.ts` — add `weeklyTotals: Array<{ weekStart: string; posts: number; jds: number }>;` to `GapReport`.
- `components/figures/discourse-vs-hiring/__fixtures__/sample.json` — add a `weeklyTotals` array of ~52 entries (hand-authored values are fine for the fixture).

Commit the design-drift change first, redeploy it (so the live API returns the extended shape), then re-run `npm run bake discourse-vs-hiring` in briantighe-v2 to refresh the real snapshot. Commit fixture + types in briantighe-v2 as a separate commit.

- [ ] **Step 2: Build the figure**

`components/figures/discourse-vs-hiring/corpus-scale-over-time.tsx`:

```tsx
import type { GapReport } from "./types";

const W = 340;
const H = 140;
const PAD = { top: 20, right: 40, bottom: 24, left: 10 };

export function CorpusScaleOverTime({ data }: { data: GapReport }) {
  const series = data.weeklyTotals;
  const n = series.length;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxPosts = Math.max(...series.map((s) => s.posts));
  const maxJds = Math.max(...series.map((s) => s.jds));
  const scale = (max: number) => (v: number) => PAD.top + chartH - (v / max) * chartH;
  const scaleX = (i: number) => PAD.left + (i / (n - 1)) * chartW;

  const postsPath = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scale(maxPosts)(s.posts).toFixed(1)}`)
    .join(" ");
  const jdsPath = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scale(maxJds)(s.jds).toFixed(1)}`)
    .join(" ");

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Weekly corpus volumes over ${n} weeks. Posts and job listings, normalized to their own maxima.`}
      >
        <title>Corpus scale, weekly</title>
        <desc>Two overlaid time-series, each normalized to its own maximum to show shape rather than absolute scale.</desc>
        <path d={postsPath} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
        <path d={jdsPath} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
        <text x={PAD.left} y={PAD.top - 6} fontSize={9} fill="var(--color-accent)" style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}>posts</text>
        <text x={PAD.left + 40} y={PAD.top - 6} fontSize={9} fill="var(--color-ink)" style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}>jds</text>
        <text x={W - PAD.right + 4} y={PAD.top + 4} fontSize={8} fill="var(--color-ink-muted)">peak {maxPosts}</text>
        <text x={W - PAD.right + 4} y={H - PAD.bottom + 2} fontSize={8} fill="var(--color-ink-muted)">peak {maxJds}</text>
      </svg>
      <figcaption>Weekly corpus volumes, each normalized to its own peak.</figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/figures/discourse-vs-hiring/corpus-scale-over-time.tsx
git commit -m "feat(figures): add F3 CorpusScaleOverTime margin figure"
```

---

## Task C5: F4 — Topic divergence details (small multiples)

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `components/figures/discourse-vs-hiring/topic-divergence-details.tsx`

**Note:** Requires per-topic weekly series. Extend `GapReport` again — add `rows[].weeklySeries` to `computeGap` output in design-drift BEFORE building this figure.

- [ ] **Step 1: Extend design-drift gap-scoring.ts**

Add to `computeGap`:

```ts
// After existing groupBy queries:
const weekly = await prisma.$queryRaw<
  Array<{ topicId: string; weekStart: Date; postCount: bigint; jdCount: bigint }>
>`
  WITH weeks AS (
    SELECT generate_series(
      date_trunc('week', ${windowStart}::timestamp),
      date_trunc('week', NOW()),
      interval '1 week'
    ) AS week_start
  )
  SELECT
    t.id AS "topicId",
    w.week_start AS "weekStart",
    COALESCE(COUNT(DISTINCT ipt."influencerPostId"), 0) AS "postCount",
    COALESCE(COUNT(DISTINCT jlt."jobListingId"), 0) AS "jdCount"
  FROM "Topic" t
  CROSS JOIN weeks w
  LEFT JOIN "InfluencerPostTopic" ipt ON ipt."topicId" = t.id AND ipt."weekStart" = w.week_start
  LEFT JOIN "JobListingTopic"     jlt ON jlt."topicId" = t.id AND jlt."weekStart" = w.week_start
  GROUP BY t.id, w.week_start
  ORDER BY t.id, w.week_start;
`;

// Fold into rows:
const weeklyByTopicId = new Map<string, Array<{ weekStart: string; posts: number; jds: number }>>();
for (const w of weekly) {
  const arr = weeklyByTopicId.get(w.topicId) ?? [];
  arr.push({
    weekStart: w.weekStart.toISOString(),
    posts: Number(w.postCount),
    jds: Number(w.jdCount),
  });
  weeklyByTopicId.set(w.topicId, arr);
}

// Attach series onto each GapRow (inside the for-loop):
const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));
for (const row of rows) {
  (row as any).weeklySeries = weeklyByTopicId.get(topicIdBySlug.get(row.slug)!) ?? [];
}
```

Update **all three** locations:
- `design-drift/src/lib/gap-scoring.ts` — add `weeklySeries: Array<{ weekStart: string; posts: number; jds: number }>;` to `GapRow`.
- `briantighe-v2/components/figures/discourse-vs-hiring/types.ts` — same extension to its `GapRow`.
- `briantighe-v2/components/figures/discourse-vs-hiring/__fixtures__/sample.json` — add `weeklySeries` to each row (hand-authored, ~52 entries per featured row is enough; other rows can have empty arrays).

Add a Vitest test confirming `weeklySeries` has the expected length and is sorted by `weekStart`. Commit in design-drift, redeploy, re-run bake in briantighe-v2, commit updated fixture + real JSON in briantighe-v2 as separate commits.

- [ ] **Step 2: Build the figure**

`components/figures/discourse-vs-hiring/topic-divergence-details.tsx`:

```tsx
import type { GapReport, GapRow } from "./types";

const FEATURED_SLUGS = [
  // Top 3 most overhyped
  // Bottom 3 most underhyped
  // Editorial choice at author time; initial defaults:
  "vibe-coding",
  "ai-agents",
  "mcp",
  "user-research",
  "prototyping",
  "figma",
];

const CELL_W = 200;
const CELL_H = 100;
const COLS = 3;
const PAD = 12;

export function TopicDivergenceDetails({ data }: { data: GapReport }) {
  const featured = FEATURED_SLUGS.map((slug) => data.rows.find((r) => r.slug === slug))
    .filter(Boolean) as GapRow[];
  const rows = Math.ceil(featured.length / COLS);
  const W = CELL_W * COLS + PAD * (COLS + 1);
  const H = CELL_H * rows + PAD * (rows + 1) + 20;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Weekly posts vs. job listings for ${featured.length} topics, each normalized to its own maxima.`}
      >
        <title>Topic-level divergence, weekly</title>
        <desc>Small multiples comparing weekly discourse volume to weekly hiring volume for featured topics.</desc>
        {featured.map((row, i) => {
          const col = i % COLS;
          const r = Math.floor(i / COLS);
          const x0 = PAD + col * (CELL_W + PAD);
          const y0 = PAD + r * (CELL_H + PAD);
          const series = row.weeklySeries ?? [];
          const maxPosts = Math.max(1, ...series.map((s) => s.posts));
          const maxJds = Math.max(1, ...series.map((s) => s.jds));
          const scaleX = (i: number) =>
            x0 + 8 + (i / Math.max(1, series.length - 1)) * (CELL_W - 16);
          const scaleY = (v: number, max: number) =>
            y0 + 30 + (CELL_H - 40) - (v / max) * (CELL_H - 40);
          const pPath = series
            .map((s, j) => `${j === 0 ? "M" : "L"} ${scaleX(j).toFixed(1)} ${scaleY(s.posts, maxPosts).toFixed(1)}`)
            .join(" ");
          const jPath = series
            .map((s, j) => `${j === 0 ? "M" : "L"} ${scaleX(j).toFixed(1)} ${scaleY(s.jds, maxJds).toFixed(1)}`)
            .join(" ");
          return (
            <g key={row.slug}>
              <text
                x={x0 + 4}
                y={y0 + 14}
                fontSize={11}
                fill="var(--color-ink)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {row.label}
              </text>
              <text
                x={x0 + CELL_W - 4}
                y={y0 + 14}
                fontSize={10}
                textAnchor="end"
                fill={row.logGap >= 0 ? "var(--color-accent)" : "var(--color-ink-muted)"}
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {(row.logGap >= 0 ? "+" : "") + row.logGap.toFixed(2)}
              </text>
              <path d={pPath} fill="none" stroke="var(--color-accent)" strokeWidth={1.2} />
              <path d={jPath} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
            </g>
          );
        })}
        <text
          x={PAD}
          y={H - 8}
          fontSize={9}
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          red = posts · black = jds · each normalized to its own peak
        </text>
      </svg>
      <figcaption>Weekly discourse volume vs. job-listing volume for six featured topics. Each pane scales independently.</figcaption>
    </figure>
  );
}
```

The `FEATURED_SLUGS` list is a stand-in — replace with author-chosen slugs after reviewing the real data.

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/figures/discourse-vs-hiring/topic-divergence-details.tsx
git commit -m "feat(figures): add F4 TopicDivergenceDetails small-multiples figure"
```

---

## Task C6: Dev route `/dev/figures/discourse-vs-hiring`

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `app/dev/figures/[slug]/page.tsx`

- [ ] **Step 1: Build the dev route**

`app/dev/figures/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import fixture from "@/components/figures/discourse-vs-hiring/__fixtures__/sample.json";
import { GapDumbbell } from "@/components/figures/discourse-vs-hiring/gap-dumbbell";
import { TopicTaxonomyMap } from "@/components/figures/discourse-vs-hiring/topic-taxonomy-map";
import { CorpusScaleOverTime } from "@/components/figures/discourse-vs-hiring/corpus-scale-over-time";
import { TopicDivergenceDetails } from "@/components/figures/discourse-vs-hiring/topic-divergence-details";
import type { GapReport } from "@/components/figures/discourse-vs-hiring/types";

export const dynamicParams = false;
export const metadata = { robots: "noindex" };

export async function generateStaticParams() {
  return [{ slug: "discourse-vs-hiring" }];
}

export default async function DevFigures({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== "discourse-vs-hiring") notFound();
  const data = fixture as unknown as GapReport;
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <p className="label">DEV: {slug}</p>
      <h1>Figures preview — fixture data</h1>
      <p className="subtitle">This route is noindex. It renders all four figures against the committed fixture.</p>
      <hr />
      <h2>F1 — Gap Dumbbell (hero)</h2>
      <GapDumbbell data={data} />
      <h2>F2 — Topic Taxonomy Map</h2>
      <TopicTaxonomyMap data={data} />
      <h2>F3 — Corpus Scale Over Time</h2>
      <div style={{ maxWidth: 340 }}>
        <CorpusScaleOverTime data={data} />
      </div>
      <h2>F4 — Topic Divergence Details</h2>
      <TopicDivergenceDetails data={data} />
    </div>
  );
}
```

- [ ] **Step 2: Start dev server + eyeball**

```bash
npm run dev
```

Open `http://localhost:3000/dev/figures/discourse-vs-hiring`. Verify every figure renders. Check at 375px wide (Chrome devtools). Iterate geometry as needed in each figure file.

- [ ] **Step 3: Commit**

```bash
git add app/dev/figures/[slug]/page.tsx
git commit -m "feat(dev): add /dev/figures/[slug] route for fixture-based figure review"
```

---

# Part D — Essay + methodology content + deploy

## Task D1: Methodology MDX page

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `content/methodology/discourse-vs-hiring.mdx`

- [ ] **Step 1: Write methodology content**

`content/methodology/discourse-vs-hiring.mdx`:

```mdx
---
title: Discourse vs. hiring — methodology
essaySlug: discourse-vs-hiring
essayYear: 2026
date: 2026-04-24
---

## Purpose

This page documents the full methodology behind *The discourse-vs-hiring gap*. Any finding in the essay can be traced back to the exact classifier prompt, scoring formula, and data snapshot used to produce it.

## Data sources

Two corpora, both scraped and maintained by Design Drift:

1. **InfluencerPost** — LinkedIn, X, and Substack posts from 483 hand-curated design / AI / growth voices. Snapshot: <insert post count> posts within the 52-week window ending <insert date>.
2. **JobListing** — design job descriptions from Greenhouse, Ashby, SmartRecruiters, Workday, Adzuna, LinkedIn, Dribbble, and WeWorkRemotely. Snapshot: <insert JD count> JDs within the same window.

## Taxonomy

Forty topics grouped into five categories: AI, Design Process, Tooling, Growth / PM, Emergent. Each topic has canonical aliases for phrase-matching resilience (e.g., `"figma make" | "figma.make" | "FM"` all map to `figma-make`).

The full taxonomy is seeded via `prisma/seed-topics.ts` in the Design Drift repo. Topic revisions are append-only — re-classifying with a new taxonomy produces a new snapshot with a new date.

## Classifier

Every post and JD is classified via Claude Haiku (`claude-haiku-4-5-20251001`) against the taxonomy. The system prompt instructs:

> Return only slugs present in the taxonomy. A topic must be *discussed*, not merely name-dropped. Respond with JSON only.

Full prompt and code: [`src/lib/topic-classifier.ts`](https://github.com/btighe428/design-drift/blob/main/src/lib/topic-classifier.ts).

Classifier output is filtered against the active taxonomy (any hallucinated slug is dropped) and cached by SHA-256 content hash.

**Validation:** Before the full backfill, 50 posts + 50 JDs were hand-audited. Precision: <insert %>. Audit record: [`docs/classifier-audit-2026-04.md`](https://github.com/btighe428/design-drift/blob/main/docs/classifier-audit-2026-04.md).

## Scoring formula

For each topic, across the 52-week window:

```
influencerShare = posts_with_topic / total_posts
jdShare         = jds_with_topic   / total_jds
gapRatio        = influencerShare / jdShare
logGap          = log₂(gapRatio)
```

A `logGap` of +1 means the topic appears twice as often in posts (per-capita) as in JDs; −1 means the reverse.

## Exclusion rules

A topic is excluded from the report if:
- It has fewer than 10 posts mentioning it in the window (reason: `sample-size`).
- It has fewer than 10 JDs mentioning it (reason: `sample-size`).
- `jdShare === 0` (reason: `zero-jd-share`).

The essay lists excluded topics in a sidenote to prevent selective omission.

## Known limitations

- **English-only.** Both corpora are filtered to English content.
- **Public-company bias.** JDs come from ATS aggregators; companies on greenhouse.io / ashbyhq / etc. skew larger and better-funded.
- **Influencer selection bias.** The 483 influencers were hand-curated; the sample is not randomized.
- **Attribution sensitivity.** Individual companies and humans are anonymized in the essay — aggregate-only. Sidenotes may cite example descriptors (*"a Staff role at a Series C fintech"*) without naming organizations.
- **Classifier approximation.** Haiku is not perfect. Precision is measured and disclosed.

## Reproducibility

The JSON snapshot the essay references is committed at [`content/data/2026/discourse-vs-hiring.json`](https://github.com/btighe428/briantighe-design-v2/blob/main/content/data/2026/discourse-vs-hiring.json). Any third party can check out that commit, rerun `npm run bake discourse-vs-hiring` against their own Design Drift instance (or a mock), and regenerate the exact figures in the essay.
```

Every `<insert X>` is replaced with a real number at essay-write time.

- [ ] **Step 2: Commit**

```bash
git add content/methodology/discourse-vs-hiring.mdx
git commit -m "content(methodology): add discourse-vs-hiring methodology page"
```

---

## Task D2: Essay MDX scaffold

**Repo:** `/Users/briantighe/briantighe-v2`
**Files:**
- Create: `content/essays/2026/discourse-vs-hiring.mdx`

- [ ] **Step 1: Scaffold the essay file**

`content/essays/2026/discourse-vs-hiring.mdx`:

```mdx
---
title: "The discourse-vs-hiring gap"
subtitle: "Forty topics, ranked by what design influencers talk about versus what companies actually hire for"
date: 2026-04-24
description: "A 52-week comparison of the topics dominating design discourse against the topics that actually show up in job descriptions. Forty topics, ranked by log ratio."
epigraph: "The map is not the territory — but a bad map is worse than no map at all."
epigraphAttribution: "Alfred Korzybski, paraphrased"
dropCap: true
---

import dataJson from "@/content/data/2026/discourse-vs-hiring.json";
import type { GapReport } from "@/components/figures/discourse-vs-hiring/types";
import { DataSource } from "@/components/data-source";
import { GapDumbbell } from "@/components/figures/discourse-vs-hiring/gap-dumbbell";
import { TopicTaxonomyMap } from "@/components/figures/discourse-vs-hiring/topic-taxonomy-map";
import { CorpusScaleOverTime } from "@/components/figures/discourse-vs-hiring/corpus-scale-over-time";
import { TopicDivergenceDetails } from "@/components/figures/discourse-vs-hiring/topic-divergence-details";

export const data = dataJson as unknown as GapReport;

<DataSource
  source="Design Drift"
  snapshotDate={data.snapshotDate}
  methodologyHref="/methodology/discourse-vs-hiring"
/>

## The question

[Section 1 — 400 words. Frame the problem: design discourse in 2024-2026 has exploded. The canonical voices on LinkedIn, X, Substack publish daily. But has what we *talk* about matched what we *hire* for? This essay reports a ratio.]

## Methodology transparency

[Section 2 — 400 words. Before results, describe the method. Name the corpora (483 influencers, N posts; N job listings), the taxonomy (~40 topics in five categories), the scoring formula (log₂ ratio of shares). Link to the methodology page.]

<TopicTaxonomyMap data={data} />

## Scale of both corpora

[Section 3 — 200 words. Brief context on relative volumes. A sentence or two about how influencer volume has grown vs. how hiring volume has grown. The margin figure below normalizes each to its own peak; the real story is about shape, not magnitude.]

<MarginFigure>
  <CorpusScaleOverTime data={data} />
</MarginFigure>

## The main finding

[Section 4 — 600 words. The headline. Walk the reader through the dumbbell: left end = hiring over-mentions, right end = discourse over-talks. Name the top three on each end. Offer plain-English interpretation for each. Keep claims proportionate to the data — avoid "influencers are wrong" framing.]

<GapDumbbell data={data} />

<PullQuote cite="The author, 2026">
  [Pull-quote — the single most quotable sentence from section 4.]
</PullQuote>

## How specific topics diverge

[Section 5 — 500 words. Zoom in on 6 featured topics. For each: when did discourse start climbing? When (if ever) did hiring catch up? Specific numbers from `data.rows.find(r => r.slug === "X").weeklySeries`. The goal is to show that some topics really are future-indicators and others are self-sustaining bubbles.]

<TopicDivergenceDetails data={data} />

## What this does and doesn't mean

[Section 6 — 400 words. Caveats. This is a snapshot, not a causal claim. Influencer selection bias. ATS-source bias. Classifier precision bound. Some "overhyped" topics may genuinely lead hiring by more than 52 weeks.]

## The series

[Section 7 — 200 words. This is piece #1 of a recurring data journalism series on briantighe.design. Future pieces: the vocabulary of the ladder (Senior → Staff → Principal), the AI-PD audit, indie-SaaS multiples. Subscribe / return.]

---

*Data: Design Drift, 52-week window ending {new Date(data.snapshotDate).toLocaleDateString()}. [Methodology.](/methodology/discourse-vs-hiring)*
```

Section brackets are authorial TODOs for Brian, not placeholder engineering content. The *structure* is complete; only the prose within each section remains.

- [ ] **Step 2: Build test**

```bash
npm run build
```

Expected: builds successfully even with bracket TODOs (they're just prose). If it errors, it's about MDX imports or frontmatter — fix before the next task.

- [ ] **Step 3: Commit scaffold**

```bash
git add content/essays/2026/discourse-vs-hiring.mdx
git commit -m "content(essay): scaffold discourse-vs-hiring essay with figure imports + data wiring"
```

---

## Task D3: Essay prose (author checkpoint)

**Repo:** `/Users/briantighe/briantighe-v2`

- [ ] **Step 1: Author the prose**

Brian writes section bodies in `content/essays/2026/discourse-vs-hiring.mdx`. For each bracketed section:
- Replace with final prose.
- Quote exact numbers from `data` (e.g., `data.rows.find(r => r.slug === "ai-agents").logGap`) — or hard-code after confirming against JSON.
- Honor the voice conventions from `prototype-led-positioning.mdx`: small-caps for organizations, old-style numerals for years, `<Sidenote>` for caveats, at most one `<PullQuote>`.

- [ ] **Step 2: Replace epigraph if desired**

Frontmatter `epigraph` and `epigraphAttribution` — swap in Brian's preferred quotation.

- [ ] **Step 3: Author completes**

(No automated check. When Brian considers the draft done, proceed to D4.)

---

## Task D4: Fact-check pass

**Repo:** `/Users/briantighe/briantighe-v2`

- [ ] **Step 1: Dump every number in prose**

Read through `content/essays/2026/discourse-vs-hiring.mdx` from top to bottom. For every number that appears in prose (not inside an imported figure), note:
- The exact text around it.
- The JSON path it should match (e.g., `data.rows.find(r => r.slug === "vibe-coding").logGap`).
- The JSON value at that path.
- Match / mismatch.

- [ ] **Step 2: Reconcile**

Every mismatch is either a typo (fix the essay) or a bake-timing issue (re-bake, then re-check). No number in prose should be unverifiable.

- [ ] **Step 3: Record the pass**

Append a brief note to the methodology page:

> Fact-checked on 2026-MM-DD against `content/data/2026/discourse-vs-hiring.json` at commit `<sha>`.

- [ ] **Step 4: Commit**

```bash
git add content/essays/2026/discourse-vs-hiring.mdx content/methodology/discourse-vs-hiring.mdx
git commit -m "content(essay): complete prose + fact-check pass"
```

---

## Task D5: Pre-publish E2E verification

**Repo:** `/Users/briantighe/briantighe-v2`

- [ ] **Step 1: Fresh bake + build**

```bash
npm run bake discourse-vs-hiring
npx tsc --noEmit
npm run build
```

Expected: bake succeeds, typecheck clean, build succeeds.

- [ ] **Step 2: Local essay render**

```bash
npm start
```

Open `http://localhost:3000/essays/2026/discourse-vs-hiring`. Verify:
- Drop cap renders.
- All four figures render.
- Typography matches `/essays/2026/prototype-led-positioning` (same font, small caps, old-style numerals).
- `<DataSource>` block appears at the top.
- Sidenotes work.
- Pull-quote renders.

- [ ] **Step 3: Methodology page**

`http://localhost:3000/methodology/discourse-vs-hiring`. Verify:
- Title + subtitle render.
- Link back to the essay works.
- All internal links to GitHub URLs are live (click each).

- [ ] **Step 4: RSS feed**

`http://localhost:3000/feed.xml`. Search for `discourse-vs-hiring`. Verify:
- Present in feed.
- `<content:encoded>` contains the full essay HTML including SVG elements.

- [ ] **Step 5: Mobile**

Chrome DevTools → iPhone 12 Pro (390×844). Verify:
- No horizontal scroll.
- Figures scale gracefully.
- Legends and labels are readable.

- [ ] **Step 6: Screenshots**

Take a screenshot of each figure at desktop size. Save to `content/data/2026/discourse-vs-hiring-screenshots/F1.png` through `F4.png`. These power the distribution drafts.

```bash
mkdir -p content/data/2026/discourse-vs-hiring-screenshots
git add content/data/2026/discourse-vs-hiring-screenshots
git commit -m "assets: add figure screenshots for discourse-vs-hiring distribution"
```

- [ ] **Step 7: No commit required** for verification itself.

---

## Task D6: Deploy briantighe-v2

**Repo:** `/Users/briantighe/briantighe-v2`

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Vercel deploy**

```bash
vercel deploy --prod --yes --scope brians-projects-61d69cd7
```

- [ ] **Step 3: Verify prod**

```bash
open https://briantighe-v2-5nu0kh34d-brians-projects-61d69cd7.vercel.app/essays/2026/discourse-vs-hiring
open https://briantighe-v2-5nu0kh34d-brians-projects-61d69cd7.vercel.app/methodology/discourse-vs-hiring
```

Verify both URLs render. Check RSS at `/feed.xml`.

- [ ] **Step 4: No commit** (deployment is the artifact)

---

# Unresolved questions (end-of-plan)

1. **`JobListing` and `InfluencerPost` exact field names.** Plan references `description`, `firstSeenAt`, `text`, `scrapedAt` — verify against the live schema in Task A1 and adjust the classifier task + gap-scoring raw SQL accordingly. Flag any differences before committing.
2. **Classifier cost ceiling.** If audit-iteration or backfill runs higher than the ~$12 estimate, is there a hard cap? (Soft cap at $30 recommended; abort and re-prompt if exceeded.)
3. **Featured slugs in F4.** Initial defaults are placeholders. Final selection happens during essay authoring (Task D3) based on real data.
4. **Title.** Spec offered two options. Current scaffold uses "The discourse-vs-hiring gap." Author decision during D3.
5. **Epigraph.** Current placeholder is Korzybski paraphrase. Author decision during D3.
6. **Classifier precision target.** 90% is the asserted floor; the audit (A5) may justify a different number. Revisit in A5 based on actual sample.
7. **Weekly series denormalization.** Tasks C4 and C5 both extend the gap-data API shape sequentially. A cleaner refactor would land both extensions in a single follow-on task between A8 (PROCESSES.md) and A9 (deploy), so Part C is purely frontend. If you want to restructure, do that before starting Part C.
8. **Query performance.** The raw SQL CTEs in C4/C5 do a full-range scan against `InfluencerPost.scrapedAt` and `JobListing.firstSeenAt`. Check for indexes on those columns before deploying; add `@@index([scrapedAt])` / `@@index([firstSeenAt])` in a follow-up migration if queries exceed a few seconds.
