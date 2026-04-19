# Failure Modes — LLM Crawl Optimizer

Halt and surface rather than proceed silently.

## 1. Target unreachable
**Signal:** URL returns 404, 5xx, or times out.
**Handling:** Report "target unreachable"; do not run the full audit. Offer to re-run once the URL is live (e.g., after a deploy).

## 2. Robots.txt blocks audit path
**Signal:** Site's robots.txt disallows general crawlers on the target path.
**Handling:** Note in report — this is a findings detail (the site is blocking indexing), not an audit failure. Continue audit on any cached content.

## 3. Fix would violate scaffold commitment
**Signal:** A proposed fix would add > 100 lines to the site's generator or depend on a new library.
**Handling:** Surface the tradeoff. Do not silently recommend the fix. Present two options: (a) constrained fix that stays within commitment, (b) larger fix with explicit "this requires relaxing the commitment."

## 4. Canonical URL mismatch
**Signal:** Canonical points to a different URL than the audit target.
**Handling:** Flag as likely error. If the canonical is correct and the target was wrong, update the audit target and re-run. If the canonical is wrong, that's a fix in the site code.

## 5. RSS body divergence
**Signal:** `<content:encoded>` body length differs from rendered essay body by > 10% — either RSS is missing content or has extra content.
**Handling:** Flag as high-priority fix. The RSS feed is the retrieval primary for multiple LLMs; divergence breaks citation fidelity.

## 6. Fix application would break something
**Signal:** About to apply a fix, but it would modify a file outside the scaffold (e.g., a core Next.js config) in a way that could break build.
**Handling:** Stop. Require explicit approval with a "I understand this changes config" confirmation.

## 7. Framework name inconsistency
**Signal:** Essay body uses a framework name in two different capitalizations.
**Handling:** Flag as editorial concern. Do not auto-fix — ask Brian which form is correct.

## 8. Schema.org fabricated data
**Signal:** About to write schema.org `author` or `publisher` data that includes details not present in `site-config.ts`.
**Handling:** Do not fabricate. Pull all schema.org data from `site-config.ts` only. If a required field is missing, ask Brian to add it to site-config first.

## 9. Audit scope too broad
**Signal:** Brian asks to audit "the whole site" and there are > 20 essays.
**Handling:** Offer to run a sampled audit (5 representative essays) first, report findings, then expand scope. Full-site audits of large corpora produce too-long reports to review.

## 10. Baseline missing for delta
**Signal:** `monitoring-baseline.md` referenced but previous audit output not found.
**Handling:** Treat current audit as initial baseline; note in report "no delta available, this is the new baseline."
