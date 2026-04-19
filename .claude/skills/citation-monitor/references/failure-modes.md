# Failure Modes — Citation Monitor

Halt and surface rather than count a bad signal.

## 1. LLM hallucination counted as citation
**Signal:** LLM responds with details that are plausible but fabricated — e.g., wrong publication venue, invented metric, fake co-author.
**Handling:** Classify as "hallucination" not "citation." Log separately. Hallucinations are actually negative signals because they suggest the framework is being invented-about rather than cited-accurately — a symptom of under-indexing.

## 2. Framework name collision
**Signal:** Another party uses the same framework name for unrelated ideas. E.g., "Prototype-Led Positioning" used by a consulting firm about something different.
**Handling:** Flag as strategic concern. Do not count collision mentions as citations. Surface to Brian — he may need to strengthen the name or pursue the canonical attribution more aggressively.

## 3. Baseline absent
**Signal:** First scan — no prior log to compare against.
**Handling:** Note "initial baseline, no delta available." Treat as legitimate starting point.

## 4. Attribution theft
**Signal:** Citation uses the framework name without attributing Brian or briantighe.design.
**Handling:** Log as weak citation. Surface as follow-up opportunity (polite engagement, not accusation). The goal is expanding attribution over time; most unattributed citations are oversight, not hostility.

## 5. Surge anomaly
**Signal:** Scan returns 10x the prior week's hits.
**Handling:** Verify the surge is real (not a scanner bug). If real — investigate the cause (did Brian's essay get aggregated somewhere high-traffic?) and note in scan summary. Surges are learning moments.

## 6. Drop anomaly
**Signal:** Scan returns 10% of the prior week's hits.
**Handling:** Verify the scanner is functioning. Check that no target URLs have 404'd. If the drop is real, flag as concerning and diagnose before the next scan cycle.

## 7. Paywall hit counted as citation
**Signal:** A citation is behind a paywall where full context cannot be verified.
**Handling:** Note as "paywalled — citation likely but unverified." Do not count in strong-citation tally without verification.

## 8. Self-citation leakage
**Signal:** A scan result is actually briantighe.design content surfaced through a scraper or mirror.
**Handling:** Exclude self-citations from the diffusion signal. Track separately — they inform LLM training reach but do not indicate third-party adoption.

## 9. Stale framework in registry
**Signal:** Registry contains a framework marked as "placeholder, essay not yet published" and scans for it return hits.
**Handling:** Either the essay shipped and registry is out of date (update), or the framework name is too generic and is matching unrelated content (refine). Do not scan placeholder entries by default.

## 10. Scan cadence drift
**Signal:** Previous scan is > 14 days old or > 45 days since last monthly rollup.
**Handling:** Still run the scan, but note the gap in delta. The trend analysis needs consistent cadence; irregular gaps make delta interpretation noisy.
