# Distribution Generator Skill — Installation and Operations Guide

This guide covers installation, daily operation, and maintenance of the distribution generator skill. Read this once before installing; refer back only for troubleshooting.

## Part I: Installation

### Prerequisites

Before installing, verify:

1. **Claude Code is installed** on your Mac and runs successfully from terminal with `claude` command
2. **~/.claude/skills/ directory exists** — if not, run `mkdir -p ~/.claude/skills/`
3. **Your briantighe.design site is deployed** and serving essays at the expected URL structure (`https://briantighe.design/essays/[slug]`)
4. **curl is available** — verify with `which curl`; it should output a path rather than an error

### Installation Steps

Step 1 — Create the skill directory structure:

```bash
mkdir -p ~/.claude/skills/distribution-generator/{references,scripts,assets/example-artifacts}
```

Step 2 — Place the files in their correct locations:

```bash
# Core SKILL.md at the skill root
cp SKILL.md ~/.claude/skills/distribution-generator/

# Reference files
cp voice-markers.md ~/.claude/skills/distribution-generator/references/
cp linkedin-template.md ~/.claude/skills/distribution-generator/references/
cp x-thread-template.md ~/.claude/skills/distribution-generator/references/
cp failure-modes.md ~/.claude/skills/distribution-generator/references/

# Fetch script with executable permission
cp fetch-essay.sh ~/.claude/skills/distribution-generator/scripts/
chmod +x ~/.claude/skills/distribution-generator/scripts/fetch-essay.sh

# Example artifacts
cp linkedin-example-1.md ~/.claude/skills/distribution-generator/assets/example-artifacts/
cp x-thread-example-1.md ~/.claude/skills/distribution-generator/assets/example-artifacts/
```

Step 3 — Verify the installation:

```bash
tree ~/.claude/skills/distribution-generator/
```

Expected output:

```
~/.claude/skills/distribution-generator/
├── SKILL.md
├── references/
│   ├── voice-markers.md
│   ├── linkedin-template.md
│   ├── x-thread-template.md
│   └── failure-modes.md
├── scripts/
│   └── fetch-essay.sh
└── assets/
    └── example-artifacts/
        ├── linkedin-example-1.md
        └── x-thread-example-1.md
```

Step 4 — Verify the fetch script runs correctly:

```bash
~/.claude/skills/distribution-generator/scripts/fetch-essay.sh https://briantighe.design/essays/prototype-led-positioning
```

If the script returns essay metadata, body text, and statistics, installation is complete. If the script returns an error, troubleshoot via Part III.

### Skill Discovery Verification

Open Claude Code and test that the skill is discoverable:

```bash
cd ~/Documents  # or any directory — the skill is user-level, not project-scoped
claude
```

Inside the Claude Code session, type:

```
List all skills available to you
```

The response should include `distribution-generator` in the list. If it does not appear, Claude Code may need a restart — exit with `/exit` and restart the session.

## Part II: Daily Operation

### Standard Invocation Pattern

After publishing a new essay on briantighe.design, invoke the skill with the essay URL:

```
Generate distribution artifacts for my latest essay at https://briantighe.design/essays/[slug]
```

Claude Code will detect the skill activation based on the description field, load SKILL.md, and proceed through the six-step generation process.

### Expected Interaction Flow

The skill will execute this sequence:

1. **Confirm inputs** — Claude will fetch the essay and extract title, framework, and receipt candidates, then confirm these with you before generating artifacts
2. **Load voice markers** — Claude loads references/voice-markers.md silently
3. **Load surface templates** — Claude loads the LinkedIn and X templates sequentially
4. **Generate LinkedIn draft** — Writes to `.distribution-drafts/YYYY-MM-DD-[slug]/linkedin-post.md`
5. **Generate X thread draft** — Writes to `.distribution-drafts/YYYY-MM-DD-[slug]/x-thread.md`
6. **Generate editorial notes** — Writes to `.distribution-drafts/YYYY-MM-DD-[slug]/editorial-notes.md`
7. **Present summary** — Provides file paths, preview of first lines, and top editorial concerns for your review

Total generation time: approximately 3–5 minutes from invocation to drafts ready.

### Your Review Process

After Claude presents the generated artifacts, your review should take approximately 15–20 minutes per essay and follow this sequence:

First — read the editorial notes file. This contains Claude's own flags about voice drift, framework compression, and alternative openings. Consider these before reading the main drafts.

Second — read the LinkedIn draft. Check against the voice markers: does it sound like you, or does it sound like someone imitating you? Edit the specific phrases that feel off. Resist rewriting the whole post — the draft is usually 80 percent correct and needs targeted fixes rather than wholesale rewriting.

Third — read the X thread draft. Check that each tweet stands alone and that Tweet 3 clearly names the framework. Edit any tweet that falls below 240 or above 270 characters.

Fourth — copy the edited versions into Typefully and schedule according to your distribution cadence (typically: LinkedIn Monday or Tuesday morning Eastern, X thread Wednesday or Thursday mid-morning Eastern).

Fifth — archive the original generated drafts by leaving the `.distribution-drafts/` directory intact. This creates a longitudinal record of Claude's generation quality that you can reference when refining the skill over time.

### Cadence Discipline

Given your 6-hour weekly distribution budget and the two-essays-per-month conservative cadence, the distribution generation workload is approximately:

- Twice per month: 3–5 minutes of skill invocation plus 15–20 minutes of editorial review equals roughly 45 minutes of distribution work per essay
- Total monthly distribution work from this skill: approximately 1.5 hours
- Remaining 4.5 hours per week available for Ring 3 relational distribution work

This allocation produces the correct balance between mechanical and relational distribution that the apparatus strategy requires.

## Part III: Troubleshooting

### Issue: Skill does not activate when invoked

**Diagnosis:** Check that the SKILL.md frontmatter is correctly formatted.

```bash
head -5 ~/.claude/skills/distribution-generator/SKILL.md
```

Should show:

```
---
name: distribution-generator
description: Generates LinkedIn and X distribution artifacts from published essays on briantighe.design...
---
```

If the frontmatter delimiters (`---`) are missing or malformed, the skill will not activate. Correct and retry.

### Issue: fetch-essay.sh returns HTTP errors

**Diagnosis:** The essay URL may be incorrect, or the site may be temporarily unavailable.

Try accessing the URL directly in a browser. If the essay loads, but the script fails, check that:

1. The URL begins with `https://briantighe.design/essays/` (the script rejects other URLs)
2. Your network connection is stable
3. The site is not rate-limiting your curl user agent — try with `-A "Mozilla/5.0"` to test

### Issue: Generated artifacts violate voice markers

**Diagnosis:** Voice drift can accumulate over many generations. If you find yourself editing the same types of drift repeatedly, update the voice-markers.md file to explicitly call out the drift pattern.

For example, if Claude keeps generating posts that open with "In 2026," add to voice-markers.md:

> Never open a post with a year reference ("In 2026," "This year," "Currently"). Opens should contain a specific noun or claim, not a temporal anchor.

Over time, your voice-markers.md file should evolve into an increasingly precise specification of your voice. This is the calibration loop that makes the skill more useful over 12+ months.

### Issue: Generated artifacts are too similar across essays

**Diagnosis:** The skill may be over-relying on structural templates and under-exercising variation.

If your last three LinkedIn posts all opened with "The fastest-moving question in [domain]..." or all ended with "Consider what [X] you have queued for Q2...", add variation examples to the linkedin-template.md reference file. Add at least three distinct opening patterns and three distinct closing patterns, and instruct the skill to rotate through them rather than defaulting to the first.

### Issue: Character counts are consistently off

**Diagnosis:** Claude's character estimates can drift from true counts, especially for tweets.

Add to SKILL.md:

> After generating each tweet, use `echo -n "[tweet text]" | wc -c` or equivalent verification to confirm character count before finalizing. Do not rely on visual estimation of length.

## Part IV: Maintenance Cadence

### Weekly (5 minutes)

- Review the editorial notes from the week's generations
- Note any recurring voice drift patterns for the monthly update

### Monthly (30 minutes)

- Read your last four generated LinkedIn posts in sequence — do they feel voice-consistent, or is drift visible?
- Read your last four generated X threads in sequence — same check
- Update voice-markers.md with any new drift patterns or calibration rules
- Review the example-artifacts directory — are the examples still representative of your best work, or should they be updated?

### Quarterly (2 hours)

- Full review of SKILL.md against recent performance
- Update the template files if platform algorithms have shifted (LinkedIn and X both modify their preferences approximately quarterly)
- Review distribution performance data from Plausible and Substack to understand what generation patterns produce the best engagement
- Retire any example artifacts that no longer represent your best work
- Consider whether the skill should be expanded to additional surfaces (answer: probably not, but the quarterly review is the correct time to evaluate)

### Annual (4 hours)

- Complete skill audit against your evolving positioning and voice
- Significant update to voice-markers.md reflecting a year of accumulated refinement
- Decision point: should the skill be split into specialized sub-skills (one for LinkedIn, one for X), or is the unified skill still serving correctly?
- Share the skill structure publicly as an artifact of your design-engineering-for-growth apparatus — this is itself a category-positioning move

## Part V: Strategic Context

The distribution skill is a single component of Ring 2 in the three-ring distribution architecture previously established. Its strategic purpose is not to maximize distribution reach but to make Ring 2 operationally sustainable at your 6-hour weekly budget.

The correct mental model: without this skill, generating LinkedIn and X artifacts for each essay would require approximately 60–90 minutes of work per essay. With this skill, the work compresses to 15–20 minutes of editorial review. The 60–70 minutes of saved time per essay is reallocated to Ring 3 relational distribution, which is where the compounding actually happens.

This reallocation is the strategic value of the skill, not the distribution artifacts themselves. A distribution system that produces LinkedIn and X posts but consumes all your distribution time on content generation is worse than this one, because it starves the higher-ROI Ring 3 work.

Track whether the skill is achieving this reallocation in your monthly review. If you find yourself spending 45+ minutes per essay on editorial review, the skill is not generating well enough to warrant its operational overhead, and the voice-markers.md file needs significant refinement. If review time drops below 10 minutes per essay, you may be under-reviewing and voice drift may be accumulating unnoticed — run a quarterly audit against your essay corpus to verify.

The correct steady-state is 15–25 minutes per essay of editorial review, producing artifacts that are recognizably yours and require only minor stylistic edits before publication.
