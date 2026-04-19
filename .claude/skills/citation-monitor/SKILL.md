---
name: citation-monitor
description: Scans LLMs (ChatGPT, Claude, Perplexity, Gemini), aggregators, and the broader web for citations of Brian's named frameworks (Prototype-Led Positioning, Experiment Interfaces, Agent-Mediated UX). Use weekly or when Brian asks "what's cited this week," "check citation coverage," "did LLMs pick up the new essay," or before a monthly strategic review. Produces a scan log + delta against prior baselines.
---

# Citation Monitor

Detect and log citations of briantighe.design's named frameworks across LLMs, aggregators, and search surfaces. The skill does not create citations — it finds them. The scan log produces the feedback signal for every other distribution decision.

Distribution without measurement is noise. This skill is the measurement.

## When this skill activates

Typical invocations:

- "Run the weekly citation scan"
- "What LLMs know about Prototype-Led Positioning?"
- "Check if Dense Discovery linked the new essay"
- "Before the monthly review, give me the citation delta"

Recommended cadence: **weekly scan, monthly delta report, quarterly trend review.**

Can be wrapped with `/loop` or `/schedule` for autonomous cadence; otherwise Brian invokes explicitly on Friday or start-of-review-period.

## Inputs collected

1. **Scan scope** — default all registered frameworks; can narrow to one
2. **Target surfaces** — default full list from `references/query-patterns.md`; can narrow (e.g., "just LLMs," "just aggregators")
3. **Baseline window** — default compare to the most recent scan log; override for "compare to all time" or "compare to month-ago baseline"

## Output directory

```
.citation-log/
├── YYYY-MM-DD-scan/
│   ├── raw-responses/          # Verbatim LLM answers and web results
│   ├── hits.md                 # Structured list of confirmed citations
│   ├── delta.md                # Changes since prior baseline
│   └── follow-ups.md           # Engagement opportunities (respond, thank, extend)
└── monthly/
    └── YYYY-MM-summary.md      # Rolled up from weekly scans
```

The `.citation-log/` directory is gitignored (or kept local) per Brian's preference. If Brian wants citation history versioned, remove from `.gitignore` and treat as publishable project memory.

## Framework registry

Read `references/framework-registry.md` for the canonical list of named frameworks with capitalization, first-mention dates, and associated essay URLs. When Brian ships a new essay with a named framework, add it to this registry before the next scan.

## Scan process

### Step 1: Load the framework registry

Pull the list of active frameworks from `references/framework-registry.md`. Each entry has:

- Canonical name (e.g., `Prototype-Led Positioning`)
- First-published date
- Canonical essay URL
- Associated lexical anchors — phrases that should appear near the framework in an accurate citation

### Step 2: Run the LLM knowledge probes

Read `references/query-patterns.md` for the specific phrasings. For each framework × LLM combination:

**Claude (current session):** Ask Claude directly, "What do you know about [Framework]? Who originated it? Where is it published?" — Claude's answer is the surrogate for ClaudeBot training corpus inclusion.

**ChatGPT / Perplexity / Gemini:** Without paid API access, use `WebFetch` to retrieve the public model's response to a shared query URL, OR prompt Brian to paste the response after running the query manually. The skill's weekly ritual is to have Brian spend 5 minutes running the three canonical queries in the respective chat UIs and paste the responses into `raw-responses/`.

For each response:

- Search for the framework's canonical name — exact capitalization
- Search for associated lexical anchors — do they appear in context?
- Identify citation attribution — does the response mention Brian, briantighe.design, or the canonical essay URL?
- Classify: **strong citation** (named, attributed, URL referenced), **weak citation** (named but unattributed), **paraphrase without name**, **no mention**

### Step 3: Run the web search scans

Use `WebSearch` with:

- Exact canonical framework name in quotes
- Canonical name without quotes
- Associated lexical anchors
- Site-specific searches on target aggregators (`site:lennysnewsletter.com`, `site:sidebar.io`, etc.)

Record each result with URL, date, snippet, and classification.

### Step 4: Run the aggregator archive check

For each aggregator profiled in `aggregator-pitch-generator/references/aggregator-profiles.md`:

- Fetch the aggregator's recent archive pages
- Search for Brian's canonical domain, framework names, and essay URLs

Record hits.

### Step 5: Write the structured hit log

`hits.md` with one entry per confirmed citation:

```
## [Date] [Source type] — [Source name]
- **URL:** <url>
- **Framework:** [name]
- **Citation type:** strong / weak / paraphrase
- **Attribution quality:** cites Brian / cites essay URL / cites category / unattributed
- **Snippet:** 1-2 sentence excerpt
- **Follow-up:** opportunity to engage / thank / amplify / none
```

### Step 6: Write the delta

`delta.md` compares to the prior scan's hit count and composition:

- New citations since last scan (with URL list)
- Lost citations (aggregator archives that no longer reference)
- LLM knowledge changes (framework newly known vs previously unknown)
- Volume trend (increasing / stable / decreasing)

### Step 7: Write follow-up opportunities

`follow-ups.md` flags citations where Brian could engage — a thank-you DM, an amplification, a correction request, a follow-up essay idea. Each opportunity is one sentence; Brian decides whether to act.

### Step 8: Update monthly summary

At month-end scans, roll up the weekly scans into `.citation-log/monthly/YYYY-MM-summary.md` with:

- Total citations by framework
- Surface breakdown (LLM / aggregator / search / social)
- Most-cited framework (the compounding leader)
- Weakest-cited framework (the attention gap)
- Proposed distribution emphasis for next month

### Step 9: Present to Brian

Summary in chat:

- Scan window
- Total hits this scan (delta from baseline)
- Top 3 strongest new citations
- Top 3 follow-up opportunities
- One-sentence strategic read: what this scan suggests about distribution emphasis next week

## Failure modes — halt and surface

See `references/failure-modes.md`. Key:

1. **LLM knowledge probe unreliable** — if Claude claims knowledge but the cited source is fabricated (hallucination), flag hard and require manual verification before counting
2. **Framework name collision** — another party publishes a framework with a colliding name; flag for Brian's strategic response
3. **Baseline absence** — first scan has nothing to compare against; treat as baseline and note delta unavailable
4. **Attribution theft** — citation uses framework name without attribution; flag as engagement opportunity (not necessarily hostile — may be organic diffusion)
5. **Paid API limit** — if external API probes are wired later, rate-limit and cost boundaries halt scan early rather than quietly fail

## What this skill does not do

- Does not create citations (that's distribution skills' work)
- Does not respond, thank, amplify, or contact anyone — only flags follow-ups
- Does not paid-subscribe to services; all probes are free-tier
- Does not scrape behind paywalls
- Does not replace human review — the scan output is substrate; Brian synthesizes the strategic read

## Tool requirements

- `WebSearch` for search surfaces
- `WebFetch` for aggregator archives and public LLM share URLs
- `Read` for reference files and prior scan logs
- `Write` for scan outputs
- `Bash` for directory creation
- Claude's own knowledge for the Claude probe (ask directly)
