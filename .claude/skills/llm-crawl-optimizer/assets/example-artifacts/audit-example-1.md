# Example — LLM Crawl Audit Report

*Known-good reference. Target: `https://briantighe.design/essays/2026/prototype-led-positioning`. Date: 2026-04-27 (hypothetical post-deploy).*

---

# Audit report — Prototype-Led Positioning

**Target:** https://briantighe.design/essays/2026/prototype-led-positioning
**Date:** 2026-04-27
**Scope:** Single essay + relevant site-level criteria
**Score:** 24 / 28 criteria pass; 3 fail; 1 N/A

## Summary

The essay is substantially retrieval-ready. Three gaps:

1. **JSON-LD schema.org Article markup is absent** (C13). Highest priority — measurably improves citation in Perplexity and Google AI Overviews.
2. **Meta description is marketing-styled** (C10). Current description: "The case for treating a working prototype as the primary positioning artifact, replacing the legacy PowerPoint deck." This reads as a subtitle, not as retrieval prose. Recommend rewriting as plain argument summary.
3. **Opening lede assumes title context** (C19). The first sentence ("Every positioning exercise in the twenty years before 2024 produced the same artifact: a deck.") is legible standalone, but the subsequent paragraph requires the title to make the framework legible. Retrieval systems that extract the first 200 characters will miss "Prototype-Led Positioning" as the named framework.

## Per-section findings

### Crawlability
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C1 | robots.txt allows LLM crawlers | Pass | All seven named UAs permitted |
| C2 | sitemap present + reachable | Pass | |
| C3 | 200 + stable canonical | Pass | |
| C4 | no noindex | Pass | |

### Semantic structure
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C5 | one h1 per page | Pass | |
| C6 | heading hierarchy contiguous | Pass | h1 → h2 only; no h3 yet |
| C7 | semantic article HTML | Pass | `<article class="essay">`, `<time datetime>` |
| C8 | headings have anchor IDs | Pass | rehype-slug wired |

### Metadata for retrieval
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C9 | title matches essay title | Pass | |
| C10 | meta description retrieval-written | **Fail** | See fix 2 |
| C11 | canonical link | Pass | |
| C12 | OpenGraph + Twitter Card | Pass | |
| C13 | JSON-LD schema.org Article | **Fail** | See fix 1 |

### RSS fidelity
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C14 | feed reachable | Pass | |
| C15 | feed contains target | Pass | |
| C16 | full content:encoded | Pass | 4,932 bytes vs 4,847 rendered body — within 2% |
| C17 | no JSX-naming leakage | Pass | `className` → `class` post-processed correctly |
| C18 | W3C feed validator | N/A | Not automated; manual check recommended quarterly |

### Citation-ready prose
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C19 | standalone opening summary | **Fail** | See fix 3 |
| C20 | framework names capitalized | Pass | "Prototype-Led Positioning" consistent |
| C21 | numbers/specifics inline | Pass | "1847", "100x", "72 hours" all in body, not sidenotes |

### Performance
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C22 | TTFB < 2s | Pass | 0.18s |
| C23 | total page weight < 500KB | Pass | 217 KB (fonts 147 KB, CSS 32 KB, HTML 38 KB) |
| C24 | zero client JS on essay | Pass | Only Next.js framework scripts |

### Site-level meta
| C# | Criterion | Status | Note |
| --- | --- | --- | --- |
| C25 | OpenGraph image baseline | Pass | og-default.png 1200×630 |
| C26 | theme-color light + dark | Pass | |
| C27 | favicon | Pass | favicon.svg |
| C28 | language tag | Pass | `<html lang="en">` |

## Priority fixes (see `fixes.md`)

1. **Add JSON-LD schema.org Article** — +20 lines to `app/essays/[year]/[slug]/page.tsx`; pulls all fields from essay frontmatter and `site-config.ts`. Expected retrieval impact: high for Google AI Overviews, Perplexity, Gemini.
2. **Rewrite meta description** as argument summary. Example: "Why working prototypes have replaced positioning decks as the primary artifact in 2026 — and the three disciplines that follow."
3. **Add a retrieval lede paragraph** at essay top: one sentence that names the framework and states the thesis, before the narrative opening. This is an editorial decision; recommendation is an optional "frontmatter retrieval field" if Brian doesn't want prose restructured.

## Baseline for next audit

Criteria status snapshot stored at `monitoring-baseline.md`. Next audit computes delta.
