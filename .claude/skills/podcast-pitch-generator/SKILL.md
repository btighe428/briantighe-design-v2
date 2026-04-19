---
name: podcast-pitch-generator
description: Generates podcast guest-pitch drafts for named shows (Lenny's Podcast, The Pragmatic Engineer, Design Details, Dive Club, Reforge, Latent Space, My First Million, Devouring Details, Off the Record, and others) tied to a published briantighe.design essay. Use when Brian says "pitch me to [podcast]," "draft a podcast pitch for [essay]," or "generate host outreach for [show]." Produces drafts for Brian's review — never auto-sends.
---

# Podcast Pitch Generator

Generate guest-pitch drafts for named podcasts tied to a published briantighe.design essay. Drafts only — Brian reviews, edits, and sends via his own email, DM, or warm intro. Never send automatically.

Podcasts are the single highest-leverage distribution surface for operator positioning: one hour produces 3K–500K qualified listener impressions with 5–15x higher subscription-conversion than equivalent social impressions. The pitch quality and host-specific angle alignment determine whether the ask converts.

## When this skill activates

Brian published an essay that could seed a podcast conversation, and wants outreach to specific shows. Typical invocation: "Pitch me to Lenny's Podcast on prototype-led positioning," "Draft Design Details and Dive Club pitches for the typography essay," or "Who should I pitch for this essay?"

## Inputs collected before generation

Confirm five inputs. Ask rather than guess:

1. **Essay URL** — canonical published location
2. **Target podcast(s)** — one or more from `references/podcast-profiles.md`, or Brian's free-text show name
3. **Primary framework** — exact capitalized framework name
4. **Brian's credentials framing** — which of his credentials to lead with for each show (operator-at-Yahoo-Mail vs. design-engineering-category vs. writing-on-briantighe.design — different hosts weight these differently)
5. **Warm intro available?** — per show: does Brian have a mutual connection who can broker?

If Brian says "who should I pitch?" rather than naming shows, fetch the essay via `scripts/fetch-essay.sh`, cross-reference the framework against `references/podcast-profiles.md`, and propose 3–5 targets with angle-fit ranking before drafting.

## Output directory

```
.distribution-drafts/podcasts/YYYY-MM-DD-[essay-slug]/
├── [podcast-slug]-pitch.md              # one per show
├── [podcast-slug]-warm-intro-ask.md     # only when mutual contact identified
├── angle-diversification.md             # how angles differ per show
└── follow-up-calendar.md                # timing per show
```

## Generation process

### Step 1: Load voice calibration

Read `references/voice-markers.md`. Apply. Voice drift halts generation.

### Step 2: Load target profiles

For each requested show, read its entry in `references/podcast-profiles.md`. Each profile specifies:

- Host(s) and affiliations as of stale-as-of date
- Audience size and composition
- Format (interview length, live vs produced, solo vs co-host)
- Guest criteria (seniority, category fit, previous guests)
- Booker / host contact mechanics
- Three most recent guests + their episode angles
- Warm-intro probability (how closed/open the booking channel is)
- Relationship signal (has Brian interacted with host publicly? flag it)

If a requested show is not profiled, ask Brian for host name, format, and a recent episode that shares the proposed angle before drafting.

### Step 3: Build the angle for this essay × this show

The angle is the single sentence a host must believe is true after reading the pitch: "this guest can fill an interesting hour on [topic] that our audience will sit through." Each show requires a different angle even from the same essay.

Example: a Prototype-Led Positioning essay generates different angles per show:
- **Lenny's Podcast:** How prototype-first positioning changes product-market fit timelines
- **Design Details:** How design engineers are replacing design deliverables with shippable code
- **Dive Club:** The craft of converting a positioning thesis into a functional prototype in a week
- **Reforge Podcast:** Why positioning research ROI has inverted in 2026
- **Latent Space:** How AI coding tools are changing the design-to-production boundary

Reuse the framework name across angles; diversify the interrogation axis.

### Step 4: Draft per-show pitches

Each pitch file must:

- Subject line: show-specific (see template)
- Personalized opening referencing a specific recent episode, guest, or observation from the host — not "big fan of the show"
- Three proposed angles tied to the essay's framework, each 1–2 sentences; lead with the strongest fit for this show
- Brian's credentials framed for this audience (operator > category-researcher > writer, reordered per show)
- Social proof if available (other appearances, citations), omitted if not
- Easy ask: 15-minute topic-refinement call, not full interview commitment
- Sign-off per voice markers

Length budget: 200–300 words for email pitches; 100–150 for DMs; 50–80 for producer form fields.

### Step 5: Generate warm-intro asks when applicable

For each show with an identified mutual connection, produce a separate `[podcast-slug]-warm-intro-ask.md`:

- Address the mutual contact, not the host
- Two-paragraph ask: why Brian thinks he'd fit this show (the angle), and whether the contact would be willing to broker a brief intro
- Make it easy to say no — explicit opt-out framing
- Include the pitch as an attachment reference so the contact can forward if they say yes

### Step 6: Write angle diversification notes

`angle-diversification.md` explains how angles differ across targeted shows so that if two hosts compare notes, each has a distinct framing. Flags any cases where angle overlap is unavoidable (the framework is new and its legible framings are limited).

### Step 7: Write follow-up calendar

`follow-up-calendar.md` with per-show suggested follow-up windows.

### Step 8: Present to Brian

Summary:

- Files produced
- Per-show recommended pitch order based on fit strength
- Any warm-intro asks awaiting Brian's decision on which contact to approach
- Top 2 concerns in angle-diversification notes

Do not send anything. Brian sends.

## Failure modes — halt and surface

See `references/failure-modes.md`. Key categories:

1. **Guest-criteria mismatch** — show only books seniority tier Brian has not yet reached
2. **Episode-count saturation** — show recently hosted guest on similar angle
3. **Host/booker change** — profile is stale
4. **No receipt for operator-focused shows** — Lenny / Reforge require concrete operator specifics
5. **Warm intro misidentification** — the "mutual contact" is not actually connected or not in a position to broker
6. **Multi-framework dilution** — pitch should ride one framework, not bundle several

## What this skill does not do

- Does not send pitches or book meetings
- Does not auto-email mutual contacts
- Does not fabricate angles, receipts, or host affinities not supported by the essay and profile
- Does not pitch shows outside the profiled list without Brian confirming host name and recent episode context
- Does not write flattery or fan mail — warmth without specificity fails on podcast booking specifically, where hosts receive saturated pitches

## Tool requirements

- `Read` for references and essay
- `Write` for output files
- `Bash` for directories
- `WebFetch` for recent-episode checks when profile data is thin

No credentials. Drafts are local.
