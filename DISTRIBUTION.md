# Distribution Architecture — briantighe.design

The operating plan for turning each published essay into durable, compounding citation surface across 48 months. Every skill in `.claude/skills/` maps to a named surface tier below. The roadmap is priority-ordered by leverage-per-hour, not enumerated by breadth.

## Thesis

Distribution is durability. The 48-month outcome — the SEO empire that compounds into a defensible category — is produced by durable surfaces (LLM retrieval, Wikipedia, aggregator archives, podcast back catalogs) and by consistent cadence rather than by volume on any single surface. Automation serves human judgment, never replaces it. Every skill in this system produces **drafts for Brian's review**; Brian lands the pitches, records the interviews, sends the emails. The skills do not auto-publish.

## Surface tiers

Ordered by compounding value and defensibility, not by audience ceiling.

### Tier 0 — LLM retrieval corpus (highest durability)

The most strategically important and most systematically underweighted. Treated as "SEO" when it is actually distribution — the most durable form.

| Surface | Mechanism | Skill / agent |
| --- | --- | --- |
| ChatGPT citations | GPTBot indexing + retrieval weighting | `llm-crawl-optimizer` (planned Q3 2026) |
| Claude citations | ClaudeBot + training corpus | `llm-crawl-optimizer` |
| Perplexity citations | Real-time retrieval + source ranking | `llm-crawl-optimizer` + `citation-monitor` |
| Google AI Overviews | AI Mode surface in search | `llm-crawl-optimizer` |
| Gemini citations | Google-Extended indexing | `llm-crawl-optimizer` |
| Common Crawl inclusion | Indirect training feed | `llm-crawl-optimizer` |
| Wikipedia entity pages | Direct entity establishment | `wikipedia-entity-builder` (planned Q4 2026) |
| Academic citations | Google Scholar, Semantic Scholar | Long-lead; tracked via `citation-monitor` |

**Scaffold compliance (shipped):** permissive `/robots.txt` for GPTBot, Claude-Web, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai; full-text `<content:encoded>` in `/feed.xml`; canonical URLs; semantic HTML; Open Graph + Twitter Card metadata.

### Tier 1 — Owned surfaces (load-bearing)

Controlled publishing infrastructure. Reach compounds on each; no platform risk.

| Surface | Current state | Effort per essay |
| --- | --- | --- |
| briantighe.design | Scaffold shipped | 0 beyond essay production |
| RSS feed (`/feed.xml`) | Shipped, full text | 0 |
| Substack import | Planned Q2 2026 | 0 once wired |
| Owned email list | Deferred — Mailchimp or Buttondown, target Q3 2026 | 5 min per essay |
| Personal podcast | Deferred past 18 months; pattern undetermined | 4–6 hrs/episode |

### Tier 2 — Draft-from-skill, human lands (weekly cadence)

Skills in `.claude/skills/` produce drafts; Brian reviews and sends. Voice markers in each skill's `references/voice-markers.md` are canonical.

| Skill | Status | Surface |
| --- | --- | --- |
| `distribution-generator` | Shipped | LinkedIn + X |
| `aggregator-pitch-generator` | Shipped | Lenny's, Sidebar.io, Dense Discovery, UX Collective, Smashing, A List Apart, Pragmatic Engineer, Stratechery, Kottke, Benedict Evans |
| `podcast-pitch-generator` | Shipped | Lenny's Podcast, Pragmatic Engineer, Design Details, Dive Club, Devouring Details, Off the Record, Reforge, Latent Space, Generally Intelligent, My First Million, The Knowledge Project |
| `dev-community-distributor` | Planned Q3 2026 | Hacker News, Lobsters, dev.to, Indie Hackers, Designer News, Product Hunt, GitHub README |
| `long-form-cross-poster` | Planned Q4 2026 | Medium (canonical-tag), LinkedIn Articles, Substack cross-recs |
| `cfp-generator` | Planned 2027 Q1 | Config, Lenny's Summit, Growth Conferences, QCon, SXSW, AIGA |

### Tier 3 — Relational (skill produces briefing materials only)

Skills here produce warm-intro asks and background briefs. Placement comes from relationship, not automation.

| Target type | Skill / tool | Cadence |
| --- | --- | --- |
| Lenny / Packy / Gergely / Ben Thompson | `podcast-pitch-generator` warm-intro ask mode | Opportunistic |
| Keynote booking agents | Manual; `cfp-generator` produces the talk proposal | 18–36 month lead |
| Advisory intros | Manual | Opportunistic |

### Tier 4 — Silent monitoring (background agents)

Detection surface. Not outbound; tracks what is happening to the work in the world.

| Monitor | Skill / agent | Cadence |
| --- | --- | --- |
| LLM citation detection | `citation-monitor` (planned Q3 2026) | Weekly query to ChatGPT, Claude, Perplexity, Gemini for the named frameworks |
| Aggregator feature detection | `citation-monitor` | Weekly scan of profiled aggregators |
| Substack cross-recommendation | `citation-monitor` | Weekly |
| Podcast back-catalog search | `citation-monitor` | Monthly |
| Common Crawl inclusion | `citation-monitor` | Quarterly |
| Wikipedia mention | `citation-monitor` | Monthly |

## Prioritization framework

Three axes, applied in order when conflicts arise:

1. **Compounding value** — LLM citation > Wikipedia > aggregator feature archive > podcast back catalog > social impression
2. **Leverage per hour** — podcast (hours → thousands of qualified listeners) > aggregator placement (minutes → hundreds of thousands of impressions) > social post (minutes → thousands of low-quality impressions)
3. **Defensibility** — owned > earned > rented

Surfaces excluded from this architecture: Threads, Bluesky, Mastodon, YouTube, YouTube Shorts, TikTok, Instagram, Instagram Reels. These are Ring 3+ in the original three-ring model and remain deliberately out of scope. Re-examination quarterly based on audience signal, not on FOMO.

## 48-month phased roadmap

### Phase 1 (April–June 2026) — Foundation
- Scaffold shipped ✓
- `distribution-generator` (LinkedIn + X) ✓
- `aggregator-pitch-generator` ✓
- `podcast-pitch-generator` ✓
- Weekly publishing cadence begins
- Substack mirror wired (automatic via RSS)

### Phase 2 (July–September 2026) — LLM corpus + dev community
- `llm-crawl-optimizer` — audits site for LLM crawlability; generates structured-data fixes, schema.org markup, citation-ready summaries at essay head
- `dev-community-distributor` — HN, Lobsters, dev.to, Designer News, Indie Hackers submissions with per-community calibration
- `citation-monitor` (agent) — weekly query against the named frameworks; logs hits to `.distribution-log/`

### Phase 3 (October–December 2026) — Long-form cross-post + Wikipedia
- `long-form-cross-poster` — Medium (canonical preserved), LinkedIn Articles with proper indexing
- `wikipedia-entity-builder` — establishes "design engineering for growth" category page with proper notability sourcing
- Conference CFP prep for 2027 season

### Phase 4 (2027) — Conferences + podcast frequency
- `cfp-generator` shipped; target 4 CFP submissions per year
- Podcast appearances at cadence (target: 1 per month)
- First keynote in 2027 conference season (target: Lenny's Summit or Mind the Product)

### Phase 5 (2028) — Category consolidation
- Entity page citations become self-reinforcing; LLMs cite briantighe.design as the canonical source on "design engineering for growth"
- Substack + owned email list at 25K+ subscribers
- Advisory and investing opportunities as downstream distribution artifacts
- Evaluate podcast-as-author channel only if data supports it

### Phase 6 (2029–2030) — Authority surface
- Book deal consideration; book as a distribution artifact for the whole research program
- Executive positioning (VP/C-level eligibility) as the trajectory's terminal distribution outcome

## Weekly operating rhythm

| Day | Ritual | Skill / tool |
| --- | --- | --- |
| Mon | Essay ships (briantighe.design + Substack mirror) | Automated via RSS |
| Tue | LinkedIn + X drafts generated + reviewed + scheduled via Typefully | `distribution-generator` |
| Wed | Aggregator pitches generated for 2–3 best-fit targets; Brian sends | `aggregator-pitch-generator` |
| Thu | Podcast outreach batched monthly; Brian sends via warm intro when available | `podcast-pitch-generator` |
| Fri | Review `citation-monitor` log; update framework adoption scorecard | `citation-monitor` (Phase 2+) |

Not every day every week — but the cadence must not skip Monday publication. Monday publication is the single load-bearing ritual; everything else is downstream.

## KPIs (monthly review)

- **LLM citations:** ChatGPT / Claude / Perplexity / Gemini surfaces per named framework (tracked via `citation-monitor`)
- **Aggregator features earned:** count + which aggregators
- **Podcast appearances booked + recorded**
- **Substack subscriber delta**
- **X + LinkedIn follower delta (low-weight; tracked but not optimized for)**
- **Framework adoption signals:** external citations of "Prototype-Led Positioning," "Experiment Interfaces," "Agent-Mediated UX"
- **Essay cadence:** number of weeks meeting the Monday-publication cadence

Review monthly. Retrospective quarterly. Adjust surface tiers annually based on compounding evidence, not on monthly noise.

## Policy guardrails (non-negotiable)

- **No auto-publish.** Every skill produces drafts; Brian reviews and lands. This is the single most important policy — violating it produces voice drift that compounds negatively across surfaces.
- **No hashtags. No emoji.** Voice markers are canonical.
- **No fabricated receipts.** Skills use only essay-derived specifics.
- **No fabricated contacts.** Warm-intro asks name contacts only when Brian has confirmed the relationship.
- **Voice drift halts generation.** Skills detect and surface drift rather than ship it.
- **No participation in explicitly excluded surfaces** without written re-approval: Threads, Bluesky, Mastodon, YouTube, YouTube Shorts, TikTok, Instagram, Instagram Reels.

## How to extend this architecture

When a new distribution surface is proposed:

1. Classify it into a tier. If it doesn't fit a tier, it is not a distribution surface — it is a new category of work requiring its own plan.
2. Evaluate against the three prioritization axes. If it loses on all three, decline.
3. If it fits: write the skill following the `distribution-generator` template. Required components: `SKILL.md`, `references/voice-markers.md` (copy, not symlink), `references/[surface]-profiles.md` (or equivalent), `references/[surface]-template.md`, `references/failure-modes.md`, `assets/example-artifacts/[surface]-example-1.md`, `scripts/fetch-essay.sh`.
4. Add the skill to this document's surface-tier tables.
5. Update `.claude/skills/` and commit.

The scaffold commitment (< 2,000 LOC for the site generator) does not apply to skill definitions, which are prose tooling for the operator. Skills can grow as the surface map grows.
