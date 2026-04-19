---
name: llm-crawl-optimizer
description: Audits briantighe.design (or any essay URL) for LLM-retrieval-readiness — checks robots.txt coverage for GPTBot/Claude-Web/Perplexity/Google-Extended, RSS full-text fidelity, canonical URLs, schema.org Article markup, Open Graph, citation-ready essay summaries, and semantic heading hierarchy. Use when Brian asks "audit the site for LLM crawling," "is this essay LLM-ready," "check our citation surface," or before publishing a structurally important essay. Produces a scored report + specific fixes; applies fixes only with explicit approval.
---

# LLM Crawl Optimizer

Audit a page (or the whole site) for retrieval-readiness by ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini, and Common Crawl. Report concrete gaps and suggest specific fixes. Apply fixes only when Brian says apply.

The underlying premise: LLM retrieval is distribution, not SEO. A poorly-indexed essay is invisible to the retrieval layer regardless of how good the writing is.

## When this skill activates

Typical invocations:

- "Audit briantighe.design for LLM crawlability"
- "Check the prototype-led positioning essay for citation-readiness"
- "Is the site set up right for GPTBot and Claude-Web?"
- "Score the new essay before I publish it"

Also run proactively on a monthly cadence as a maintenance pass.

## Inputs collected

1. **Target URL or path** — either a live URL (e.g., `https://briantighe.design/essays/2026/prototype-led-positioning`) or a local path (`content/essays/2026/prototype-led-positioning.mdx`) when auditing pre-publish
2. **Scope** — single essay, full site, or specific subset (e.g., "all 2026 essays")
3. **Fix policy** — `report-only` (default), `propose-patches` (generate diffs), or `apply-with-approval` (write changes after showing them)

## Output directory

```
.llm-audit/YYYY-MM-DD-[target-slug]/
├── audit-report.md         # Scored findings per criterion
├── fixes.md                # Concrete suggested edits, diff-style when possible
└── monitoring-baseline.md  # Snapshot for next audit's delta comparison
```

## Audit criteria

Every criterion scores **Pass / Fail / N/A**. Pass requires the criterion be met for retrieval — not merely present but complete.

Read the full checklist at `references/llm-crawl-checklist.md`. Summary:

### Crawlability
- `robots.txt` explicitly allows GPTBot, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai
- `/sitemap.xml` present, served, references the target URL, has valid lastmod
- No `noindex` or `nofollow` on the target
- Page responds 200 with stable canonical URL (no redirects to auth walls)

### Semantic structure
- One `<h1>` per page, matching the essay title
- Heading hierarchy is contiguous (no skip from `h1` to `h3`)
- Semantic HTML for article body (`<article>`, `<section>`, `<time>`, `<blockquote>`)
- Every heading has an `id` (slug) for anchor retrieval

### Metadata for retrieval
- `<title>` matches essay title verbatim
- `<meta name="description">` present, 120–180 characters, written for retrieval (not marketing copy)
- `<link rel="canonical">` set to the canonical URL
- `<meta property="og:title">`, `og:description`, `og:type=article`, `article:published_time`
- JSON-LD schema.org `Article` block with: `headline`, `datePublished`, `author`, `description`, `mainEntityOfPage`, `inLanguage`

### RSS fidelity
- `/feed.xml` reachable, valid RSS 2.0
- Target essay appears in feed
- `<content:encoded>` contains full body HTML (not excerpt)
- No `className` / `tabIndex` / `htmlFor` leaking into RSS HTML (React naming → HTML naming)
- Valid XML — passes W3C feed validator

### Citation-ready prose
- Essay opens with a 1–3 sentence summary that stands alone (a retrieved snippet must make sense without surrounding context)
- Named frameworks use exact capitalized form (`Prototype-Led Positioning`, not lowercase variations)
- Key claims are near their supporting evidence — retrieval systems often extract adjacent-sentence pairs
- Numbers and specifics are inline, not hidden in footnotes/sidenotes (sidenotes are secondary)

### Performance
- Page responds < 2s to first byte
- Total page weight < 500 KB on wire
- No render-blocking client JS on essay pages (zero-JS guarantee)

## Generation process

### Step 1: Fetch target

Use `scripts/audit.sh <url>` which:
- Fetches the page, robots.txt, sitemap.xml, feed.xml
- Stores raw responses in a temp cache
- Emits a JSON summary of HTTP status, content length, content-type for each

If the target is a local `.mdx` path instead of a live URL, use `Read` on the file and apply checklist criteria that are detectable from source (frontmatter, body structure) — skip criteria that require a live HTTP response.

### Step 2: Evaluate against checklist

Work through `references/llm-crawl-checklist.md` item by item. Record Pass/Fail with a one-sentence rationale per criterion.

### Step 3: Write the audit report

`audit-report.md`:

- Target URL + date + scope
- Summary score (e.g., 23/28 criteria pass)
- Per-section table of findings
- Top 3 priority fixes ordered by retrieval impact
- Note any criteria marked N/A and why

### Step 4: Write suggested fixes

`fixes.md`:

- For each failing criterion, a concrete fix
- Where the fix is code, include a unified diff or file-edit spec
- Where the fix is editorial (e.g., add a summary sentence), include a 1–2 sentence proposed edit
- Group fixes by: site-wide changes (affect every essay) vs. essay-specific changes

### Step 5: Write monitoring baseline

`monitoring-baseline.md`: a frozen snapshot of the criteria-pass status. The next audit computes delta against this.

### Step 6: Present and decide on application

Summarize to Brian:

- Audit score + top 3 fixes
- Fix policy check: report-only / propose-patches / apply-with-approval
- If apply-with-approval: show each diff, ask for explicit yes/no per fix, apply approved ones, report what changed

Never apply fixes without Brian's explicit approval per file. Global yes does not count.

## Failure modes — halt and surface

See `references/failure-modes.md`. Key:

1. **Target unreachable** — URL 404 or timeout; confirm correct URL before proceeding
2. **Robots.txt blocks audit** — if the site's robots disallows general crawlers including the audit path; flag and continue via cached content
3. **Criteria collide with commitment** — if a "fix" would violate the 2000-LOC scaffold commitment (e.g., adding schema.org needs <100 lines but a related feature needs more); surface the tradeoff
4. **Canonical URL mismatch** — audit finds canonical pointing to a different URL than expected; flag as likely error
5. **RSS body divergence** — `<content:encoded>` HTML diverges substantially from rendered essay HTML; flag for investigation

## What this skill does not do

- Does not change the site in `report-only` mode
- Does not submit URLs to Google Search Console or any indexer
- Does not run Lighthouse (separate concern; use lighthouse CLI directly)
- Does not evaluate essay content quality — purely structural/retrieval audit
- Does not guarantee LLM citation — crawlability is necessary but not sufficient

## Tool requirements

- `Bash` for `curl` probes (via `scripts/audit.sh`)
- `Read` for local file inspection
- `Write` for output reports and fixes
- `Edit` for applying fixes when approved
