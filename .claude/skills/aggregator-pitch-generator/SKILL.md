---
name: aggregator-pitch-generator
description: Generates pitch drafts to curated newsletters and aggregators (Lenny's, Not Boring, Sidebar.io, Dense Discovery, UX Collective, Smashing, A List Apart, Pragmatic Engineer, Stratechery, Kottke) asking them to feature, link to, or excerpt a briantighe.design essay. Use when Brian has published a new essay and says "pitch it to the aggregators," "draft a Lenny pitch," "generate curator outreach for [essay]," or references a specific aggregator. Produces drafts for Brian's review — never auto-sends.
---

# Aggregator Pitch Generator

Generate pitch drafts to named aggregators asking them to feature, link to, or excerpt a published briantighe.design essay. Drafts only — Brian reviews, edits, and sends via his own email or submission form. Never send automatically.

## When this skill activates

Brian published a new essay and wants to send it to curators. Typical invocation: "Draft a Lenny pitch for my latest essay," "Pitch this to Dense Discovery and Sidebar," or "Generate aggregator outreach for https://briantighe.design/essays/[slug]."

## Inputs collected before generation

Confirm four inputs. Ask rather than guess:

1. **Essay URL** — canonical published location on briantighe.design
2. **Target aggregator(s)** — one or more from `references/aggregator-profiles.md`, or Brian's free-text name
3. **Primary framework** — the exact capitalized framework name introduced in the essay
4. **Angle of interest** (optional) — the specific hook Brian thinks matches this aggregator's editorial voice

If Brian supplies only the URL + aggregator, fetch the essay with `scripts/fetch-essay.sh` and propose an angle before drafting.

## Output directory

Create a session directory:

```
.distribution-drafts/aggregators/YYYY-MM-DD-[essay-slug]/
├── [aggregator-slug]-pitch.md      # one file per target
├── editorial-notes.md              # reviewer guidance across all pitches
└── follow-up-calendar.md           # suggested follow-up timing per pitch
```

Use `mkdir -p`. If directory exists from a prior run, append `-v2`, `-v3`.

## Generation process

### Step 1: Load voice calibration

Read `references/voice-markers.md`. Apply to every pitch. Voice violations halt generation — rewrite rather than ship drift.

### Step 2: Load target profile

For each requested aggregator, read its entry in `references/aggregator-profiles.md`. Each profile specifies:

- Curator's name and current-as-of date
- Audience size and composition
- Editorial angle (what they feature, what they skip)
- Submission mechanics (email, form, DM, social)
- Recent feature exemplars when known
- Warm vs cold posture — some curators prefer unsolicited, some reject it

If the requested aggregator is not profiled, stop and ask Brian for the curator's name, submission mechanics, and a recent feature exemplar before drafting.

### Step 3: Load the pitch template

Read `references/aggregator-pitch-template.md`. Apply its structure; adapt tone and emphasis per the target profile.

### Step 4: Draft per-aggregator pitches

For each aggregator, produce one file: `[aggregator-slug]-pitch.md`. Each must:

- Subject line or intro line calibrated to the curator's surface (email subject, DM opener, submission form field)
- Personalized opening referencing specific recent work by the curator (no generic "love your newsletter")
- One-paragraph essay summary calibrated to their editorial angle
- The receipt — specific operator metric or case study from the essay — if essay contains one
- Clear ask framed as an offer, not a demand (e.g., "for consideration" not "please feature")
- Brian's positioning signal in one line (operator-researcher at Yahoo Mail, establishing "design engineering for growth" category)
- Essay URL on its own line
- Sign-off using Brian's standard closing (see voice-markers.md)

Length budget: 150–250 words for email pitches; 80–120 words for DM/social pitches; form fields match field caps.

### Step 5: Write editorial notes

Produce `editorial-notes.md` covering:

1. **Aggregator selection rationale** — why these targets for this essay
2. **Voice drift flagged** — specific phrases to re-read before sending
3. **Angle diversification** — how angles differ across pitches so curators who know each other do not see identical framing
4. **Receipt reuse concerns** — if the same receipt is used across multiple pitches, note which target gets which
5. **Relationship notes** — flag any target where Brian has prior contact (from project memory) and tailor the warmth accordingly

### Step 6: Write follow-up calendar

Produce `follow-up-calendar.md` with suggested follow-up windows per aggregator (e.g., Lenny responds within 10 days or not at all; Dense Discovery prefers 3-week silence before a nudge). Pull from profile metadata.

### Step 7: Present to Brian

Summary to chat:

- File paths for all pitches
- For each pitch: subject line + first sentence preview
- Top 2 editorial-notes items to reconsider
- Suggested send order (highest-fit target first)

Do not offer to send. Brian sends from his own email client or submission forms.

## Failure modes — halt and surface

Stop and ask rather than proceed silently when:

1. **Profile stale** — the requested aggregator's profile has a stale-as-of date older than 6 months; flag for refresh
2. **Essay mismatch** — the essay's primary framework does not plausibly fit the aggregator's editorial angle; do not force-fit
3. **Curator change** — public signal suggests the curator has changed since profile was last updated; halt
4. **Same-week collision** — Brian recently pitched the same target with a different essay; warn about outreach fatigue
5. **Voice performance** — draft reads as performative warmth rather than genuine engagement with the curator's work
6. **No receipt, framework is soft** — essay lacks a concrete metric AND the framework is speculative; some aggregators (Lenny, Pragmatic Engineer) require receipts

Read `references/failure-modes.md` for detailed handling of each.

## What this skill does not do

- Does not send email, submit forms, or DM on any platform
- Does not schedule follow-ups
- Does not fabricate receipts, metrics, or case studies not present in the source essay
- Does not pitch surfaces outside the profiled list without Brian's explicit confirmation and curator context
- Does not write flattery that crosses into performance — genuine engagement with the curator's work is the only acceptable register

## Tool requirements

- `Read` for loading references and essay content
- `Write` for output files
- `Bash` for directory creation
- `WebFetch` for retrieving essay content when `fetch-essay.sh` is insufficient

No credentials required. Skill operates on publicly-accessible essay content and stores drafts locally.
