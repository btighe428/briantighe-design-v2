# Community Profiles — dev and technical communities

Each entry includes: submission mechanics, audience, acceptable formats, voice register, title norms, timing, moderation red lines, stale-as-of date.

## Hacker News
- **URL:** https://news.ycombinator.com
- **Submission:** news.ycombinator.com/submit — URL + title. First comment optional.
- **Audience:** ~5M monthly uniques; founders, engineers, investors; skews contrarian and technically literate
- **Acceptable formats:** Link submission (URL only); Show HN for demonstrable projects; Ask HN for discussion prompts
- **Voice register:** Plain. Terse. No editorializing. No marketing. Title editorialization is punished by mods who routinely rewrite titles back to article original.
- **Title norms:** Use the essay's exact title verbatim. Do not add "[Essay]" or "My thoughts on..." prefixes. If the essay's title starts with "The" or "A," leave it.
- **First comment policy:** A short submitter comment clarifying context is acceptable, but any hint of marketing destroys the submission. If no clean comment exists, submit URL only.
- **Timing:** Weekdays, 7:00–9:00am Pacific, is the canonical performant window. Weekends produce lower volume but less competition. Friday afternoons are near-dead. Avoid holidays.
- **Moderation red lines:** Title editorialization, multiple submissions of same URL within 48h, self-promotional first comments, URL shorteners, pay-walled content without warning
- **Voting dynamics:** Points in first hour are load-bearing; submissions that don't reach ~10 points in the first 45 minutes generally don't make the front page. Flagging is aggressive — any hint of "growth hack" or "best practices" titles gets flagged.
- **For Brian's essay types:** Long-form analytical essays with specific technical claims work well. Pure opinion or pure philosophy may miss. The Collapsing Abstraction Layer has strong HN fit; Prototype-Led Positioning has moderate fit.
- **Stale as of:** 2026-04-19

## Lobsters
- **URL:** https://lobste.rs
- **Submission:** lobste.rs/stories/new — requires account; accounts are invite-only
- **Audience:** ~20K; smaller and more senior than HN; higher technical bar
- **Acceptable formats:** Tagged URL submissions; meta posts for discussion
- **Voice register:** Plain technical. Less adversarial than HN. Discussion quality is higher; comments are generally substantive.
- **Title norms:** Exact article title. Tags are required (e.g., `practices`, `philosophy`, `design`, `web`, `culture`)
- **First comment policy:** Submitter may leave a 2–3 sentence intro comment. Expected in some subcommunities (philosophy essays typically get a brief context comment from the submitter).
- **Timing:** Less time-sensitive than HN. Front page has longer dwell time; a story can climb over days. No clear optimal window.
- **Moderation red lines:** Self-promotion without disclosure; mis-tagging; duplicate submissions
- **Invite status:** Lobsters is invite-only. If Brian is not a member, submission requires an invite from an existing user, or the skill should recommend HN + dev.to instead.
- **For Brian's essay types:** Thoughtful, technical, essayistic pieces fit well. Counter-periodization content (the Flash/Axure/Framer Classic asides in the Collapsing Abstraction Layer) fit the Lobsters register particularly well.
- **Stale as of:** 2026-04-19

## dev.to
- **URL:** https://dev.to
- **Submission:** Cross-post via dev.to's own editor; free to sign up
- **Audience:** ~1M+ registered; skews junior-to-mid engineers; algorithmic feed
- **Acceptable formats:** Full article republish (with canonical tag back to the original)
- **Voice register:** Friendly technical. Longer-form than HN comments. Markdown-formatted.
- **Title norms:** Can slightly editorialize for the dev.to audience (clarity-focused), but preserve substance. Add a subtitle/tagline if useful.
- **Canonical tag:** **Required.** Every cross-post MUST include a `canonical_url` in the article frontmatter pointing to briantighe.design. Missing this is an SEO-destructive error — it splits link equity and duplicates content signals.
- **Tags:** Up to 4 tags. Common: `webdev`, `design`, `ai`, `career`, `productivity`, `discuss`. Pick tags that describe the essay, not marketing tags.
- **Timing:** Algorithm rewards engagement-over-time, not launch-day spikes. Publish once; it may trend for days.
- **Cover image:** Optional but recommended. A simple text-on-gradient card is sufficient; do not use AI-generated cover images (dev.to community flags these).
- **For Brian's essay types:** Technical-leaning essays with practical application work well. Pure strategy/positioning content performs less well than craft-and-technique content.
- **Stale as of:** 2026-04-19

## Designer News
- **URL:** https://designernews.co
- **Submission:** designernews.co/submit
- **Audience:** ~30K registered; senior designers and design leadership
- **Acceptable formats:** Link submission
- **Voice register:** Design-first. Craft-focused. Register-aware — the audience values taste and process over growth tactics.
- **Title norms:** Exact title preferred; minor clarity edits acceptable if the original title is opaque without context
- **First comment policy:** Optional brief context from the submitter. Community expects self-disclosure if the author is the submitter.
- **Timing:** Morning Pacific is typical; weekends are lower volume but less noise. No strong pattern.
- **Moderation red lines:** Growth-hack titles, LinkedIn-style performative confidence, unabashed marketing
- **For Brian's essay types:** Design-practice and design-engineering content fit strongly. Growth-focused content without a design craft element may miss.
- **Stale as of:** 2026-04-19

## Indie Hackers
- **URL:** https://www.indiehackers.com
- **Submission:** indiehackers.com — post to the main feed or to a specific group
- **Audience:** ~200K+ bootstrappers and solo operators
- **Acceptable formats:** Link post; narrative post with embedded link; "build in public" update
- **Voice register:** Narrative. Personal. Build-in-public-friendly. Tolerates more first-person than HN/Lobsters.
- **Title norms:** Editorialization is acceptable; clickbait is punished. Title should telegraph the essay's operator-specific insight.
- **First comment policy:** Expected and substantial. The submission is the link; the first comment is the narrative context that explains why the community should care.
- **Timing:** Weekdays Pacific morning is typical. Less time-sensitive than HN.
- **Moderation red lines:** Self-promotion without substantive value; coin-operated posting
- **For Brian's essay types:** Essays with a concrete operator metric or case study fit strongly. Pure philosophy essays miss.
- **Stale as of:** 2026-04-19

## Product Hunt
- **URL:** https://www.producthunt.com
- **Submission:** producthunt.com/ship
- **Audience:** ~4M monthly uniques; product enthusiasts, early adopters
- **Acceptable formats:** Product launches — not essays. Launch a shippable project; essays can reference the launch.
- **For Brian's use:** Essays are **not** Product Hunt material. Interactive experiments in `/experiments/` (once published) are Product Hunt candidates. Flag to Brian if he asks to submit an essay to PH; recommend waiting until an experiment ships.
- **Timing:** Tuesdays–Thursdays, midnight Pacific, is the canonical launch window. Launches compete for daily top-5 rankings.
- **Stale as of:** 2026-04-19

## GitHub README
- **URL:** Specific repos — briantighe-design-v2, future experiment repos
- **Submission mechanism:** Edit README.md; commit; push
- **Audience:** Developers who land on the repo through search, citation, or referral
- **Acceptable formats:** A "Further Reading" or "Context" section with a markdown link to the essay
- **Voice register:** Plain technical. No marketing.
- **Template:** `## Context\nThis repository accompanies [*Essay Title*](https://briantighe.design/essays/[slug]), which argues [one-sentence thesis].`
- **For Brian's essay types:** Any essay with a corresponding repo benefits. The briantighe-design-v2 scaffold itself should reference The Collapsing Abstraction Layer and Prototype-Led Positioning in its README.
- **Stale as of:** 2026-04-19

## Default posture for unprofiled communities

When Brian names a community not profiled here:

1. Ask for submission URL and mechanics
2. Ask for a recent successful exemplar from someone in a similar category
3. Ask for voice register and title norms
4. Write a new profile entry after first successful submission

Never draft for an unprofiled community without this context — the failure modes are community-specific and unknown profiles produce predictable misfires.
