---
name: distribution-generator
description: Generates LinkedIn and X distribution artifacts from published essays on briantighe.design. Use when Brian has published a new essay and needs distribution drafts for review, when he mentions "generate distribution artifacts," "create LinkedIn post for my essay," "draft X thread for essay," or references a specific essay URL on briantighe.design and wants shareable versions. Produces drafts for Brian's review — never auto-publishes or sends to external surfaces.
---

# Distribution Artifact Generator

Generate distribution drafts for LinkedIn and X from a published essay on briantighe.design. This skill produces drafts only — Brian reviews and edits before any publication. Never send to external surfaces directly.

## When this skill activates

Brian has published a new essay on briantighe.design and needs distribution artifacts. Typical invocation: "Generate distribution artifacts for my latest essay" or "Create LinkedIn and X drafts for https://briantighe.design/essays/[slug]."

## Inputs you will collect

Before generating artifacts, confirm you have these four inputs. Ask Brian for any that are missing rather than guessing:

1. **Essay URL** on briantighe.design — the canonical published location
2. **Primary framework** — the named proprietary framework introduced in the essay (e.g., "Prototype-Led Positioning")
3. **Operator takeaway** — the one-sentence insight Brian most wants operators to retain
4. **Receipt** (optional but preferred) — a specific operator metric or case study that grounds the framework

If Brian provides only a URL, fetch the essay content using the bundled `scripts/fetch-essay.sh` script and extract framework and takeaway candidates for Brian to confirm before proceeding.

## Output directory

Create a timestamped directory for this generation session:

```
.distribution-drafts/YYYY-MM-DD-[essay-slug]/
├── linkedin-post.md
├── x-thread.md
└── editorial-notes.md
```

Use `mkdir -p` to create the directory. If the directory already exists (retry scenario), append `-v2`, `-v3`, etc. to preserve prior generations for A/B comparison.

## Generation process

Follow this sequence precisely. Do not skip steps or consolidate phases.

### Step 1: Load voice calibration

Read `references/voice-markers.md` into context. This file contains Brian's specific lexical, structural, and tonal markers. Every artifact you generate must preserve these markers. If you find yourself writing language that violates voice markers, stop and rewrite the phrase.

### Step 2: Load the target surface template

For LinkedIn: read `references/linkedin-template.md`. This file contains the structural template, character budget, and two known-good example artifacts.

For X: read `references/x-thread-template.md`. Same pattern.

Load only the template for the surface you are generating for. If generating both, load them sequentially rather than simultaneously to avoid cross-contamination between formats.

### Step 3: Draft the LinkedIn post

Apply the LinkedIn template to the essay content. Character budget: 1,400–1,700 with 1,800 as hard ceiling. The post must:

- Open with a specific claim or observation, not a question
- Reference the primary framework by its exact name
- Include the receipt if available
- Close with a specific implication for the reader's decision-making
- Include the essay URL on the final line, separated from the body by a blank line
- Use sentence-per-line formatting for algorithmic readability
- Never use hashtags (violates Brian's voice markers)

### Step 4: Draft the X thread

Apply the X template. Thread length: 5–6 tweets, never more. Each tweet: 240–270 characters. The thread must:

- Open with an observation that generates curiosity without clickbait
- Build the framework progressively across tweets 2–4
- Ground in evidence in tweet 5
- Close with implication + essay link in tweet 6
- Use em-dashes rather than semicolons for mid-sentence pivots
- Never use emoji (violates Brian's voice markers)

### Step 5: Write editorial review notes

Create `editorial-notes.md` documenting:

1. **Voice drift flagged**: Specific phrases in your drafts that sound generic or AI-generated, with suggested replacements
2. **Framework compression loss**: Places where the framework was compressed in ways that might lose rigor
3. **Voice markers missing**: Opportunities where you could have strengthened Brian-specific lexical choices but didn't
4. **Alternative openings**: Two alternative first sentences for each artifact, for A/B consideration
5. **Context this misses**: One to three elements from the essay that did not translate to these surfaces but might warrant separate treatment

### Step 6: Present to Brian

After writing the three files, present a summary to Brian in the chat that includes:

- The file paths where drafts were saved
- A preview of the first 3 lines of the LinkedIn post
- A preview of the first 2 tweets of the X thread
- The top 2 items from editorial-notes.md that Brian should specifically review

Do not offer to publish or send the drafts. Brian will review, edit, and handle publication via Typefully on his own schedule.

## Failure modes — halt and surface rather than generate

Stop generation and flag the concern to Brian if any of these conditions are detected. Do not proceed silently. Read `references/failure-modes.md` for detailed handling.

1. **Epistemic overclaiming**: The generated copy would attribute certainty beyond what the source essay supports
2. **Framework proliferation**: More than one named framework would appear in a single artifact
3. **Voice performance**: The copy sounds like someone imitating Brian rather than Brian
4. **Citation gap**: Claims would require external validation not present in the source essay
5. **Essay not found**: The URL returns 404 or the essay content cannot be extracted
6. **Framework name mismatch**: The framework name Brian provides does not appear in the essay text

## What this skill does not do

To be explicit about boundaries:

- Does not publish to LinkedIn, X, or any external surface
- Does not send emails
- Does not modify the source essay on briantighe.design
- Does not generate artifacts for surfaces other than LinkedIn and X (YouTube Shorts, TikTok, Instagram, Threads, Bluesky, Mastodon are all explicitly out of scope)
- Does not schedule posts — Brian handles scheduling via Typefully after editorial review

If Brian asks for a surface outside LinkedIn and X, decline and note that the surface is intentionally excluded from the distribution strategy per his published operating principles.

## Tool requirements

This skill uses:

- `WebFetch` for retrieving essay content from briantighe.design
- `Read` for loading reference files and templates
- `Write` for creating the three output files
- `Bash` for creating output directories

No external API keys or credentials are required. The skill operates entirely on publicly-accessible essay content.
