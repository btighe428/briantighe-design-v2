# Query Patterns — LLM probes, WebSearch queries, aggregator checks

Phrasing matters. These are the canonical queries to issue per surface. Do not paraphrase — the framework is measuring citation over time, so probe consistency is as important as probe content.

## LLM knowledge probes

Three questions per framework, asked to each LLM. The three questions test different surfaces of the training corpus: recognition, attribution, and contextual knowledge.

### Question set for a given framework (example: Prototype-Led Positioning)

1. **Recognition:** "What is Prototype-Led Positioning?"
2. **Attribution:** "Who originated the term Prototype-Led Positioning and where is it published?"
3. **Contextual:** "How does Prototype-Led Positioning differ from traditional positioning approaches?"

Record the exact response. Classify each response:

- **Strong citation:** Accurate definition + names Brian Tighe + references briantighe.design
- **Weak citation:** Accurate definition + partial attribution (names either Brian OR the site) but not both
- **Recognition only:** Accurate definition, no attribution
- **Paraphrase without name:** The idea is reflected in the response but the named framework is not surfaced
- **Hallucination:** Response invents details (fabricated publisher, wrong attribution, invented metrics)
- **No knowledge:** Response says the framework is unfamiliar

### LLMs to probe (as of 2026-04-19)

- **Claude (current session):** Ask directly within the current chat; response is the substrate for ClaudeBot training corpus inclusion. Re-ask on new sessions when the model version changes (Opus/Sonnet/Haiku update).
- **ChatGPT (GPT-4o / GPT-5 as applicable):** Paste the response from a chat.openai.com session into `raw-responses/chatgpt-[framework]-recognition.md`
- **Perplexity:** Use the search interface; Perplexity combines retrieval + summarization, so record both the summary and the cited sources
- **Gemini:** Use gemini.google.com; note whether Google AI Overviews treats the framework as retrievable via search

If paid API access is wired later, automate the probe by calling each provider's API with the canonical question set on a weekly cadence.

## WebSearch queries

For each framework:

1. **Exact match:** `"Prototype-Led Positioning"` (quoted)
2. **Lowercase variant:** `"prototype-led positioning"` (quoted)
3. **Attributed search:** `"Prototype-Led Positioning" Brian Tighe`
4. **Domain-anchored:** `"Prototype-Led Positioning" site:briantighe.design`
5. **Competitive-space search:** `"Prototype-Led Positioning" -site:briantighe.design` (who else is citing it)

Run query 5 weekly as the primary diffusion signal.

## Aggregator archive checks

For each profiled aggregator in `aggregator-pitch-generator/references/aggregator-profiles.md`, search their archive for:

- Brian's domain: `site:[aggregator-domain] briantighe.design`
- Framework name: `site:[aggregator-domain] "Prototype-Led Positioning"`
- Canonical essay title: `site:[aggregator-domain] "Prototype-led positioning"`

### Aggregator-specific patterns

- **Lenny's Newsletter:** Scan lennysnewsletter.com for URL mentions + recent issues
- **Dense Discovery:** Scan densediscovery.com archive
- **Sidebar.io:** Scan sidebar.io issue archive
- **Kottke.org:** Scan kottke.org search
- **UX Collective (Medium):** Scan uxdesign.cc and Medium
- **Benedict Evans weekly:** Scan ben-evans.com weekly archive

## Social signal checks (low-weight)

- **LinkedIn:** Search posts for framework name (noisy — expect false positives on "prototype"-related keywords)
- **X:** Search tweets and quote-tweets of briantighe.design essays
- **Hacker News:** `site:news.ycombinator.com "Prototype-Led Positioning"` or canonical URL

Social mentions are logged at half-weight compared to LLM or aggregator citations — they're more volatile and less durable.

## Scholar / academic probes (quarterly cadence)

- **Google Scholar:** `"Prototype-Led Positioning"` quoted
- **Semantic Scholar:** same query
- Academic citation is the highest-durability signal; even one real academic cite compounds for years

## Monthly summary query

At month-end scan, run the canonical framework queries one more time against every surface to produce the monthly baseline. Store the verbatim responses in `monthly/YYYY-MM/raw-responses/` so future trend analysis can compare LLM response evolution over time.
