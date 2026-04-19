# Submission Templates — per-community structure

Each template specifies what goes in the submission form, the first comment (if any), and any metadata (tags, canonical URL, cover image).

## Hacker News

**Form fields:**
- **Title:** Essay's exact title. No prefix, no bracket tags, no " – briantighe.design" suffix.
- **URL:** Canonical essay URL on briantighe.design. Do not use a URL shortener.
- **Text:** Leave blank. Submit the URL; the essay speaks.

**First comment (optional, 60–120 words):**
- Only if it adds context the title cannot. Examples: "I wrote this after shipping X at Y — the receipt in section 3 is from that work."
- Never: "Would love your feedback" / "Thoughts?" / "I worked hard on this."
- Disclose authorship: "Author here." is acceptable; nothing more.

## Lobsters

**Form fields:**
- **Title:** Essay's exact title.
- **URL:** Canonical essay URL.
- **Tags:** Required. Choose from Lobsters' tag list. For Brian's essays, likely tags:
  - `practices` — engineering/design practice discussions
  - `philosophy` — higher-order reflective content
  - `web` — web-specific content
  - `design` — design content (verify tag exists; some communities have renamed)
  - `culture` — cultural/historical analysis
- **Description (optional):** 1–2 sentences of context if the title is opaque. Example: "An historical reading of why Figma won the Component Era and what that implies for the Intelligence Era."

**First comment (optional, 2–3 sentences):**
- More expected than on HN. Can briefly explain why this essay matters, or flag a specific section
- Author disclosure required if Brian is the author

## dev.to

**Cross-post frontmatter:**
```markdown
---
title: "[Essay title — may be lightly edited for dev.to audience]"
published: true
description: "[Meta description, max 140 chars]"
tags: webdev, design, ai, career
cover_image: "[Optional URL]"
canonical_url: https://briantighe.design/essays/[year]/[slug]
---
```

**Body:**
- Full essay content in markdown
- Preserve all structural elements (headings, blockquotes, lists, tables)
- Strip any components dev.to cannot render (custom React components like `<Sidenote>` → convert to inline parenthetical or footnote)
- Keep the `canonical_url` frontmatter — this is load-bearing for SEO

**First post-publish note:**
- Optional one-line acknowledgment: "Originally published at briantighe.design; discussion welcome here."
- No comment needed if the canonical tag is in frontmatter

## Designer News

**Form fields:**
- **Title:** Essay's exact title (designer audience tolerates longer titles; keep substance)
- **URL:** Canonical essay URL
- **Description (80–160 chars):** One-sentence summary of the essay's design-practice relevance

**First comment (optional, 1–2 sentences):**
- Only if there's a specific design-craft hook worth flagging
- Author disclosure expected: "Author here — wrote this to frame the design-engineering shift we're seeing at Yahoo Mail."

## Indie Hackers

**Form fields:**
- **Title:** Editorial title acceptable; frame around the operator insight
- **Link:** Canonical essay URL
- **Post body (required, 150–300 words):**
  - Opens with the operator takeaway — what this essay helps a bootstrapper or solo operator decide
  - Explains the framework briefly
  - Includes the specific receipt if essay has one
  - Closes with one open question or conversation prompt for the community
- **Group:** Select the most relevant Indie Hackers group (e.g., "Design," "SaaS," "Growth")

## GitHub README

**Template — "Context" section to add to a repo's README:**

```markdown
## Context

This repository accompanies [**The Collapsing Abstraction Layer**](https://briantighe.design/essays/2026/collapsing-abstraction-layer), which traces the thirty-year compression of the gap between designer intent and production software. The scaffold here is an illustration of the thesis: a publishing system that treats the running site as the primary artifact rather than a rendered approximation of one.

The full essay series — including [**Prototype-Led Positioning**](https://briantighe.design/essays/2026/prototype-led-positioning) — is at [briantighe.design](https://briantighe.design).
```

**Placement:** After the project description, before installation / getting-started sections. Keep short; the README's primary job is to help users use the repo, not to promote the essays.

## Universal anti-patterns

Across every community, drop these:

- Emoji in titles or submission text
- Hashtags anywhere
- "Check out my new essay on..."
- "I just published..."
- "Curious what you think..."
- Any phrasing that positions the essay as content marketing
- "10x," "game-changing," "revolutionary" — voice-marker violations everywhere
