# LLM Crawl Checklist — per-criterion detail

Each criterion includes the test, the pass condition, and the remediation sketch. Apply to a single essay URL OR at site scope.

## Crawlability

### C1 — robots.txt allows LLM crawlers
- **Test:** `curl -s <origin>/robots.txt`
- **Pass:** File contains explicit `User-agent:` entries with `Allow: /` for GPTBot, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai
- **Common fail:** Wildcard-only or missing LLM-specific UAs
- **Remediation:** Add explicit UA blocks in `app/robots.txt/route.ts`

### C2 — sitemap present and reachable
- **Test:** `curl -s <origin>/sitemap.xml`
- **Pass:** 200, valid XML, `<urlset>` with at least one `<url>`, includes target URL
- **Common fail:** 404, or sitemap exists but target essay missing
- **Remediation:** Ensure sitemap route lists all MDX files from `content/essays/**`

### C3 — target URL returns 200 with stable canonical
- **Test:** `curl -sI <url>` + parse `<link rel="canonical">` from body
- **Pass:** 200 status, canonical matches URL exactly, no redirect chain
- **Common fail:** 307/308 to auth wall, canonical pointing elsewhere
- **Remediation:** Check `app/essays/[year]/[slug]/page.tsx` `generateMetadata`

### C4 — no noindex
- **Test:** Parse `<meta name="robots">` and HTTP `X-Robots-Tag`
- **Pass:** Neither contains `noindex` or `nofollow`
- **Common fail:** Accidental noindex on draft pages leaking to production
- **Remediation:** Remove from layout metadata; gate drafts via `draft: true` in frontmatter + build-time filter

## Semantic structure

### C5 — one h1 per page
- **Test:** Count `<h1>` in rendered DOM
- **Pass:** Exactly one, matching the essay title verbatim
- **Common fail:** Multiple h1s (one in header, one in nav); or h1 that includes marketing suffixes
- **Remediation:** Reserve h1 for essay title only; nav/logo uses non-heading semantic

### C6 — heading hierarchy contiguous
- **Test:** Parse all h1–h6; check no level skips
- **Pass:** h1 → h2 → h3 progression with no gaps
- **Common fail:** h1 → h3 (skipping h2)
- **Remediation:** Author-time discipline; add a lint pass in CI

### C7 — semantic HTML for article body
- **Test:** Presence of `<article>`, `<header>`, `<time>`, `<section>`, `<blockquote>`, `<figure>`
- **Pass:** Essay wrapped in `<article>`, metadata in `<header>`, dates in `<time datetime>`
- **Common fail:** Div soup
- **Remediation:** `components/essay-layout.tsx`

### C8 — headings have anchor IDs
- **Test:** Every h2+ has `id` attribute
- **Pass:** All present (rehype-slug does this automatically with proper config)
- **Common fail:** Headings with special characters get no ID
- **Remediation:** Ensure `rehype-slug` is in `next.config.mjs` rehype pipeline

## Metadata for retrieval

### C9 — title matches essay title
- **Test:** Parse `<title>` tag
- **Pass:** Identical to essay frontmatter `title`
- **Common fail:** Title includes site name as prefix (dilutes signal)
- **Remediation:** Set `title: { template: '%s — {siteName}' }` at root; per-essay title overrides without template

### C10 — meta description: retrieval-written
- **Test:** Length + content of `<meta name="description">`
- **Pass:** 120–180 chars, states the essay's argument in plain prose, not marketing copy
- **Common fail:** "Learn how to..." / "Discover..." / "Unlock..." / AI-generic prose
- **Remediation:** Essay frontmatter `description` field; audit prose quality per essay

### C11 — canonical link
- **Test:** `<link rel="canonical" href="...">`
- **Pass:** Present, matches final URL
- **Common fail:** Missing, or pointing to index page
- **Remediation:** `generateMetadata` in essay route

### C12 — Open Graph + Twitter Card
- **Test:** Presence of `og:title`, `og:description`, `og:type=article`, `article:published_time`; `twitter:card=summary_large_image`
- **Pass:** All present with correct values
- **Remediation:** `generateMetadata` openGraph and twitter blocks

### C13 — JSON-LD schema.org Article
- **Test:** Parse `<script type="application/ld+json">`
- **Pass:** Contains `@type: "Article"` with `headline`, `datePublished`, `author`, `description`, `mainEntityOfPage`, `inLanguage`
- **Common fail:** Absent entirely (most common gap for Next.js scaffolds)
- **Remediation:** Add `<script type="application/ld+json">` to essay layout with per-essay dynamic data

## RSS fidelity

### C14 — feed reachable
- **Test:** `curl -s <origin>/feed.xml`
- **Pass:** 200, content-type `application/rss+xml`
- **Remediation:** `app/feed.xml/route.ts`

### C15 — feed contains target
- **Test:** XML parse, check `<item><link>` values
- **Pass:** Target URL is one of the `<item>` entries
- **Common fail:** Essay is `draft: true` or otherwise filtered from feed

### C16 — full content:encoded
- **Test:** Extract `<content:encoded>` for the target item
- **Pass:** Length close to rendered essay body HTML (within 10%)
- **Common fail:** Excerpt instead of full body; missing altogether
- **Remediation:** `feed.xml/route.ts` must call full-body rendering, not summary

### C17 — no JSX-naming leakage in RSS HTML
- **Test:** Search `<content:encoded>` body for `className=`, `tabIndex=`, `htmlFor=`
- **Pass:** Zero occurrences (all mapped to `class=`, `tabindex=`, `for=`)
- **Common fail:** React internal naming leaks when rendering React trees to HTML for RSS
- **Remediation:** Post-process in `lib/mdx.ts` or use `renderToStaticMarkup` + string replace

### C18 — valid RSS per W3C feed validator
- **Test:** POST feed body to https://validator.w3.org/feed/
- **Pass:** "This is a valid RSS feed"
- **Manual verification step** — not automated in the audit script

## Citation-ready prose

### C19 — standalone opening summary
- **Test:** First 1–3 sentences of body make sense absent title and header
- **Pass:** Yes — a retrieved snippet is legible
- **Common fail:** Opening assumes reader has seen title/header context
- **Remediation:** Editorial pass; every essay needs a "retrieval-lede"

### C20 — framework names capitalized
- **Test:** Grep body for framework names; check capitalization
- **Pass:** All mentions use exact form (`Prototype-Led Positioning`, not lowercased)
- **Remediation:** Author discipline; consider a remark plugin to auto-correct

### C21 — numbers and specifics inline
- **Test:** Numeric specifics appear in body, not only in sidenotes
- **Pass:** Yes — retrieval extracts body text primarily
- **Common fail:** Key metrics buried in sidenotes (invisible to linear retrieval)
- **Remediation:** Author pattern — sidenotes carry color, body carries the load-bearing specifics

## Performance

### C22 — TTFB < 2s
- **Test:** `curl -w "%{time_starttransfer}" -o /dev/null <url>`
- **Pass:** < 2.0 seconds
- **Remediation:** Vercel edge / ISR / static generation

### C23 — total page weight < 500 KB
- **Test:** Sum of HTML + CSS + fonts + images on wire
- **Pass:** < 500 KB
- **Common fail:** Unoptimized images; web font not preloaded
- **Remediation:** Next.js Image component, font preload

### C24 — zero client JS on essay pages
- **Test:** Parse page for `<script>` tags outside of Next.js bootstrap
- **Pass:** Only Next.js framework scripts; no client components in essay body
- **Common fail:** `'use client'` directive leaked into a component used in MDX
- **Remediation:** Audit `components/` for accidental client components

## Site-level meta

### C25 — single OpenGraph image baseline
- **Test:** Presence of `og-default.png` at 1200×630
- **Pass:** Reachable at `/og-default.png`

### C26 — theme color for both color schemes
- **Test:** `<meta name="theme-color">` entries for light and dark
- **Pass:** Both present

### C27 — favicon present
- **Test:** `<link rel="icon">`
- **Pass:** Present, served at the referenced path

### C28 — language tag
- **Test:** `<html lang="...">`
- **Pass:** Present (`en` for English essays)
