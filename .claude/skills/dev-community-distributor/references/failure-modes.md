# Failure Modes — Dev Community Distributor

Halt and surface rather than ship a degraded submission. Developer communities are low-tolerance for self-promo; one bad submission can tag Brian's domain as marketing for months.

## 1. Poor angle fit
**Signal:** The essay does not match the community's core interest. Example: submitting a pure design-history essay to Hacker News when HN's current mix is skewed toward engineering specifics.
**Handling:** Decline to draft. Surface the fit analysis to Brian and recommend alternative community.

## 2. Self-promotion language
**Signal:** Draft contains phrases like "Check out my new essay," "I just published," "Would love your feedback," or any first-person enthusiasm that reads as marketing.
**Handling:** Rewrite. If unable to rewrite into a clean submission, decline.

## 3. Title editorialization on HN
**Signal:** Draft for Hacker News proposes a title different from the essay's actual title.
**Handling:** Rewrite to use verbatim title. HN moderators aggressively rewrite editorial titles back; submitting editorialized is a performance flag.

## 4. Canonical URL missing on cross-post
**Signal:** dev.to or other cross-post draft omits `canonical_url` frontmatter pointing to briantighe.design.
**Handling:** **Hard stop.** This is an SEO-destructive error that splits link equity and can cause Google to index the cross-post as the canonical, displacing briantighe.design. Never ship without canonical.

## 5. Multi-community simultaneous submission
**Signal:** Brian asks to submit the same essay to 2+ link-only communities (HN + Lobsters + Designer News) within the same hour.
**Handling:** Warn. Recommend 24+ hour spacing between link-only community submissions. Algorithmic systems cross-reference; simultaneous submissions can flag as coordinated promotion.

## 6. Invite-only community blocker
**Signal:** Target is Lobsters or another invite-only community and Brian has no account or invite.
**Handling:** Flag. Propose: (a) skip this community; (b) identify a potential inviter via mutual contacts; (c) redirect to open alternative.

## 7. Same-community recent submission
**Signal:** Brian recently (within 14 days for HN/Lobsters; 30 days for Designer News/Indie Hackers) submitted the same or a highly similar essay.
**Handling:** Warn. Over-submission triggers moderation attention. Recommend waiting or submitting different content.

## 8. Product Hunt mismatch
**Signal:** Brian asks to submit an essay to Product Hunt.
**Handling:** Decline. Product Hunt is for launchable products, not essays. Recommend: (a) submit the interactive experiment at `/experiments/[slug]/` when one ships; (b) skip PH for essay content.

## 9. Cover image fabrication
**Signal:** Generating a cover image for dev.to using AI image generation, or copying an image without attribution.
**Handling:** Decline to generate. Suggest a simple typography-only cover card (the essay title on the site's paper background) that Brian can create in seconds. No AI-generated cover images — dev.to community flags these.

## 10. Tagged content in wrong tag
**Signal:** Lobsters submission tagged `practices` when content is `philosophy`, or `design` when no design content exists.
**Handling:** Rewrite tags. Mis-tagging is a moderation red flag on Lobsters specifically.

## 11. Body divergence from canonical essay
**Signal:** Cross-post body for dev.to is "adapted for the dev.to audience" in ways that change substance, not just formatting.
**Handling:** Refuse substantive adaptation. Cross-post must be the same essay with only formatting adjustments (component-stripping, image re-hosting). If the essay needs "adaptation for the audience," it needs to be a different essay.

## 12. Title norm violation in Indie Hackers direction
**Signal:** Indie Hackers title draft is click-baity or growth-hack-adjacent ("I made $X doing Y," "How I shipped...").
**Handling:** Rewrite. Indie Hackers community tolerates first-person framing but not clickbait. Re-anchor to operator specifics, not dollar-signs.
