---
name: dev-community-distributor
description: Generates submission drafts for developer and technical communities (Hacker News, Lobsters, dev.to, Designer News, Indie Hackers, Product Hunt, GitHub README) tied to a published briantighe.design essay. Use when Brian says "submit to HN," "cross-post to dev.to," "draft a Lobsters submission for [essay]," or "prep community distribution for [essay]." Produces drafts + submission guidance for Brian's review — never auto-submits.
---

# Dev Community Distributor

Generate submission drafts and timing guidance for developer and technical communities tied to a published briantighe.design essay. Each community has its own norms — a submission that works on Hacker News will fail on Lobsters and vice versa. The skill encodes per-community calibration so Brian does not repeatedly relearn the rules or get down-voted for voice mismatch.

Drafts only — Brian reviews and submits manually. Do not auto-submit to any community. Self-promotion signals kill submissions across every target.

## When this skill activates

Typical invocations:

- "Draft HN and Lobsters submissions for the new essay"
- "Cross-post the Collapsing Abstraction Layer to dev.to"
- "Designer News submission for the prototype-led positioning essay"
- "What's the best community play for this essay?"
- "Prep the GitHub README to reference the essay"

## Inputs collected

1. **Essay URL** — canonical published location
2. **Target community(ies)** — from the profiled list, or Brian's free-text
3. **Angle fit flag** — Brian's read on whether the essay fits the community (if unsure, the skill proposes fit ranking based on essay content)
4. **Cross-post intent** — Medium-style canonical republish (dev.to), link-only submission (HN, Lobsters, Designer News, Indie Hackers), or supporting reference (GitHub README)
5. **Brian's existing account status** per community — some communities (Lobsters, some private Slacks) are invite-only; flag if no account

## Output directory

```
.distribution-drafts/dev-communities/YYYY-MM-DD-[essay-slug]/
├── [community-slug]-submission.md     # one per target
├── cross-post-[community-slug].md     # full cross-post body for dev.to etc.
├── angle-fit-analysis.md              # why each community was chosen (or declined)
└── timing-guidance.md                 # when to submit per community
```

## Generation process

### Step 1: Load voice calibration

Read `references/voice-markers.md`. Different communities tolerate different voice registers — Lobsters expects plain technical register; Indie Hackers tolerates more narrative. Voice markers are the non-negotiable floor; community calibration adjusts above that floor.

### Step 2: Load community profile

For each target, read its entry in `references/community-profiles.md`. Each profile specifies:

- Submission mechanics (form URL, API, manual)
- Account requirement (open, paywall, invite-only)
- Typical audience composition
- Acceptable submission types (link-only, Show HN, cross-post with canonical, discussion thread)
- Voice register (plain technical, narrative, craft-focused)
- Title norms (editorialize vs verbatim)
- Timing norms (submission windows that typically perform)
- Moderation signals that would kill the submission
- Recent exemplars when available

If a community is not profiled, stop and ask Brian for the submission mechanics and a recent successful exemplar before drafting.

### Step 3: Run the angle-fit analysis

For each target × essay combination, evaluate fit on four axes:

1. **Topical fit** — does the essay's subject match the community's core interest?
2. **Register fit** — does the essay's voice match the community's register? (An essayistic piece may bomb on HN even if the topic fits.)
3. **Receipt fit** — does the essay have the concrete specifics the community rewards?
4. **Self-promo risk** — how will the community read Brian's submission: as a genuine contribution or as self-promotion?

Produce `angle-fit-analysis.md` with a ranking and rationale. Decline to draft for communities where fit is below a threshold; flag them to Brian rather than ship a low-fit draft.

### Step 4: Draft per-community submissions

Different file patterns per community. Read `references/submission-templates.md`.

For link-only submissions (HN, Lobsters, Designer News): `[community-slug]-submission.md` contains:

- Exact title to use (verbatim vs editorial rewrite per community)
- URL
- Optional first-comment text (some communities expect the submitter to leave a short seed comment to start discussion; others penalize that as self-promotion)
- Tags (Lobsters requires them)
- Submission timing recommendation

For cross-posts (dev.to, Medium): `cross-post-[community-slug].md` contains:

- Title (may be adjusted per surface norms; canonical title stays on briantighe.design)
- Body — full essay content reformatted for the surface (dev.to renders its own markdown; strip components the platform doesn't support)
- **Canonical URL tag** back to briantighe.design — critical for SEO, must not be omitted
- Tags per platform conventions
- Cover image or banner reference

For supporting references (GitHub README): `github-readme-addition-[repo].md` contains:

- Markdown snippet pointing to the essay
- Suggested README section (e.g., Context, Further Reading, Related Essays)
- Brief intro sentence

### Step 5: Write timing guidance

`timing-guidance.md`:

- Per-community optimal submission window (HN is roughly 8–10am PT weekdays; Lobsters is more forgiving; dev.to is slow-burn algorithmic)
- Sequencing recommendation across communities (dev.to cross-post same day; HN submit 1–3 days later to let Substack/newsletter wave settle; Lobsters can be any time)
- Anti-pattern flags (do not submit the same essay to multiple communities within the same hour — Brian should space by 24+ hours to avoid algorithmic cross-contamination signals)

### Step 6: Present to Brian

Summary in chat:

- Files produced
- Recommended submission sequence with dates
- Top-fit community identified
- Any communities declined and why
- One-sentence "what to watch for" — what signal from each community indicates the submission landed

Do not submit. Brian handles all manual submission.

## Failure modes — halt and surface

See `references/failure-modes.md`. Key categories:

1. **Poor angle fit** — the essay lacks the specifics or register the community rewards; surface rather than draft
2. **Self-promotion risk** — submission language reads as marketing; rewrite or decline to draft
3. **Title norm violation** — draft uses editorial title where community expects verbatim (HN penalizes editorialization)
4. **Canonical tag missing** — cross-post draft omits canonical URL back to briantighe.design; hard stop, this is an SEO-destructive error
5. **Multi-community simultaneous submission** — Brian asks to submit to 3 communities in the same hour; warn about algorithmic cross-signal
6. **Account-requirement mismatch** — target community is invite-only and Brian has no account; flag for a different plan (relationship-based introduction, or skip)
7. **Recent submission collision** — same essay or similar content submitted to the same community in recent window

## What this skill does not do

- Does not submit to any community; does not log into any account; does not post
- Does not generate engagement bait or "hot take" titles designed to farm votes
- Does not produce artifacts for communities outside the profiled list without Brian's explicit confirmation and profile
- Does not bypass the canonical-URL discipline on cross-posts — every cross-post points back to briantighe.design
- Does not edit the source essay to better fit a community; the essay is canonical

## Tool requirements

- `Read` for references and essay content
- `Write` for output files
- `Bash` for directory creation
- `WebFetch` for essay content retrieval and community exemplar sampling
