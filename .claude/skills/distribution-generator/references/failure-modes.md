# Failure Modes — When to Halt Distribution Generation

This file specifies the conditions under which the distribution skill must halt generation and surface a concern to Brian rather than producing artifacts. Halting is always preferable to generating artifacts that compromise editorial integrity or category positioning.

## Why explicit failure modes matter

The userStyle directive from Brian's operating principles states: "Never send half-baked responses." Applied to distribution generation, this means: better to produce no artifact than to produce an artifact that requires significant editorial repair. A halted generation with a clear concern is a useful signal; a generated artifact with subtle voice drift wastes Brian's editorial attention and risks category-dilution if he edits hastily.

The six failure modes below represent conditions that cannot be safely resolved through draft generation. Each requires explicit dialogue with Brian before proceeding.

## Failure Mode 1: Epistemic Overclaiming

**Detection:** The generated copy would attribute certainty beyond what the source essay supports. Specifically, if the essay hedges a claim ("likely produces," "tends to," "in most cases") but the compressed distribution artifact loses the hedge ("produces," "always," "in all cases"), this is epistemic overclaiming.

**Why halt:** Brian's positioning is grounded in analytical rigor. Distribution artifacts that overclaim damage the Julie Zhuo-to-Sundial trajectory because sophisticated readers — the search-committee constituency — detect overclaiming and discount the entire body of work.

**Surface to Brian:**
> The LinkedIn draft requires compressing "in most growth-stage B2B contexts" to fit the character budget. This compression would lose the hedge and produce overclaiming. Two options: (1) rewrite to preserve hedge at slight length cost, or (2) pick a different framework angle that doesn't require the hedged claim. Which direction?

## Failure Mode 2: Framework Proliferation

**Detection:** The generated artifact would mention more than one named framework from Brian's taxonomy. For example, a single LinkedIn post referencing both "Prototype-Led Positioning" and "Experiment Interfaces."

**Why halt:** Each named framework is a retrievable LLM object in Brian's apparatus. Diluting a single post with multiple frameworks weakens the retrieval signal for each and sends confusing category signals. Frameworks should be introduced one at a time with dedicated distribution treatment.

**Surface to Brian:**
> The essay introduces both Prototype-Led Positioning and Experiment Interfaces as connected frameworks. The LinkedIn format cannot support both without dilution. I can generate a post focused on Prototype-Led Positioning with a brief teaser to Experiment Interfaces, or vice versa. Which framework should be the primary focus for this post?

## Failure Mode 3: Voice Performance

**Detection:** The generated copy sounds like someone imitating Brian rather than Brian. Specifically: hedging language appears in quantities that feel performative, analytical rigor is claimed rather than demonstrated, or the post contains the phrase "as an analyst," "as an operator," "in my research," or similar self-referential register signals.

**Why halt:** Voice performance is worse than voice drift. A post with generic voice is merely weak; a post with performed voice actively damages the apparatus by signaling insecurity about authority. Real authority does not announce itself.

**Surface to Brian:**
> The X thread draft reads as performing analytical rigor rather than demonstrating it — specifically Tweet 3 contains "my research suggests" and Tweet 5 contains "as an operator." These are insecure-register markers. Can you clarify what concrete receipt or precedent should anchor Tweets 3 and 5 instead?

## Failure Mode 4: Citation Gap

**Detection:** The generated copy would contain claims that require external validation not present in the source essay. For example, a specific statistic ("47% of operators report...") that does not appear in the essay but that the generation process would invent to strengthen the argument.

**Why halt:** Uncited statistics in distribution artifacts are the single most common source of credibility collapse for operator-researchers. A fabricated statistic that goes viral becomes a permanent reputation liability. The essay is the source of truth; nothing appears in distribution that is not in the essay.

**Surface to Brian:**
> The draft LinkedIn post is strengthened by a specific statistic about design-engineering team productivity, but the source essay does not contain this statistic. I will not fabricate it. Can you either (1) confirm the statistic with a source and add it to the essay, or (2) regenerate the post without the statistic?

## Failure Mode 5: Essay Not Found

**Detection:** The provided URL returns 404, the essay has not yet been published, or the essay content cannot be extracted from the page.

**Why halt:** Distribution artifacts that link to non-existent essays damage trust with the audience and signal operational sloppiness. The mechanical verification that the essay is live must precede artifact generation.

**Surface to Brian:**
> The URL https://briantighe.design/essays/[slug] returned a 404. Has the essay been published yet, or did the slug get captured incorrectly? Confirming the live essay URL before generation prevents broken-link distribution.

## Failure Mode 6: Framework Name Mismatch

**Detection:** The framework name Brian provides does not appear verbatim in the essay text. For example, Brian says the framework is "Prototype-Led Positioning" but the essay consistently refers to it as "Prototype-First Positioning."

**Why halt:** Inconsistent framework naming across the apparatus damages the retrievable LLM object function that frameworks serve. Every mention of a framework should use identical capitalization and phrasing.

**Surface to Brian:**
> The framework name you provided ("Prototype-Led Positioning") does not match the essay text, which uses "Prototype-First Positioning" consistently. Before generating distribution artifacts, we should reconcile. Is the essay text correct, or does the essay need an editorial pass to match the canonical framework name?

## Escalation path

When any of these failure modes triggers, produce the following in place of the normal artifact output:

1. A single-sentence identification of which failure mode was detected
2. The specific evidence from the source essay or provided inputs that triggered detection
3. Two to three concrete resolution options with tradeoffs
4. A direct question to Brian asking for his decision

Do not proceed with partial artifact generation while awaiting Brian's response. Do not generate "best-guess" versions that compromise on the failure mode. The halt is the correct output until the underlying issue is resolved.

## What is NOT a failure mode

For clarity, these conditions do not require halting:

- **Short essays that compress well** — brevity is not a failure
- **Essays with complex arguments** — distribution is lossy by design; compression is expected
- **Unfamiliar frameworks** — if the framework is new to Brian's apparatus, proceed but note in editorial review that the framework is being introduced for the first time
- **Stylistic preferences** — Brian may prefer a slightly different opening; that is edit-level feedback, not a failure mode

The distinction: failure modes are conditions that cannot be resolved within the artifact; stylistic feedback is edit-level refinement that Brian handles during his review pass.
