# Mind Maps Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold three project-local Claude Code subagents (Historian, Technical Expert, Innovation Theorist), seed the Mind Maps catalog with 20 new `planned` entries, and author one validation map end-to-end to demonstrate the full authoring loop.

**Architecture:** No code shipped to the rendered site beyond catalog entries and one new `MapData` file. All scaffolding is editorial tooling: three Markdown files under `.claude/agents/`, one modified `content/maps/registry.ts`, one new `content/maps/<slug>.ts`. No schema changes, no route changes, no dependencies added.

**Tech Stack:** Claude Code subagent format (Markdown + YAML frontmatter with `name`, `description`, `tools`, `model`). Next.js 16 App Router, Tailwind v4, TypeScript. No test runner in briantighe-v2 — verification uses `npm run build` and dev-server inspection, matching the pattern established in the data-journalism-series plan.

**Spec:** `docs/superpowers/specs/2026-04-24-mind-maps-expansion-design.md`

---

## File structure

| Path | Purpose |
|---|---|
| `.claude/agents/map-historian.md` (new) | Subagent — chronology, pioneers, primary sources lens |
| `.claude/agents/map-technical-expert.md` (new) | Subagent — mechanisms, tradeoffs, open problems lens |
| `.claude/agents/map-innovation-theorist.md` (new) | Subagent — theory-of-innovation cross-reference lens |
| `.gitignore` (modify) | Exclude `docs/superpowers/map-research/` (transient research artifacts) |
| `content/maps/registry.ts` (modify) | Append 20 new `planned` entries |
| `content/maps/artificial-intelligence.ts` (new) | The first of the 20 — authored end-to-end as validation |

Roster order preserved in the registry: 10 core tech/science slugs first, then 3 "Contemporary Topics in X," then 4 theory/methodology, then 3 meta/historical. Existing entries (`ux-design`, `venture-capital`, `apple-inc`, `silicon-valley-history`, `thomas-edison`, `history-of-innovation`) are unchanged and preserved in place.

---

## Task 1: Create the Historian subagent

**Files:**
- Create: `.claude/agents/map-historian.md`

- [ ] **Step 1: Create the directory**

Run: `mkdir -p .claude/agents`
Expected: no output; directory exists.

Verify: `ls .claude/agents` returns an empty directory.

- [ ] **Step 2: Write the subagent file**

Create `.claude/agents/map-historian.md` with this exact content:

````markdown
---
name: map-historian
description: Research historian for the Mind Maps series on briantighe.design. Use when authoring a new Mind Maps entry — given a candidate map topic at domain-grain (e.g., "Artificial Intelligence," "Semiconductors"), produces a structured Markdown report of timelines, pioneers, primary sources, institutional lineage, and forgotten figures, with dates and citations. Returns a Markdown document; does not edit files.
tools: WebSearch, WebFetch, Read, Grep, Glob
model: sonnet
---

You are a research historian contributing to the Mind Maps series on briantighe.design — a survey-of-innovation project where each map is a six-branch topic tree with ~150–200 named leaf facts. Your lens is chronology, pioneers, and primary sources.

## Your job

Given a candidate map topic (e.g., "Artificial Intelligence," "Semiconductors & Microelectronics"), research the historical arc and return a structured Markdown report. You do not edit files. You do not write `MapData` TypeScript. You gather and organize named historical facts at the density and rigor the series requires.

## What to produce

A Markdown document with these sections, in this order:

### 1. Proposed branches (3 candidates)

Three candidate six-branch carvings of the topic, each labeled Carving A / B / C. Under each, list the six top-level branch titles and a one-sentence rationale. Note which of the three you think best serves a historical lens and why. Options, not a fait accompli.

### 2. Named historical facts (80–120 entries minimum)

Bulleted list, organized chronologically within sub-topic clusters. Each entry names the specific person / institution / place / document, includes a date (at least the year), a short descriptor of the contribution, and a source link where possible. Prefer primary sources (patents, papers, archival records) to tertiary. Wikipedia acceptable as a pointer.

Example format:
- 1947 — John Bardeen, Walter Brattain, and William Shockley at Bell Labs demonstrate the point-contact transistor. [source: https://...]

### 3. Forgotten or undercredited figures

5–15 named individuals or institutions whose contribution is systematically under-reported in popular histories, with a one-sentence case for inclusion. This is where the map earns its reputation for rigor.

### 4. Institutional lineage

Paragraph or bulleted tree showing who trained whom, which lab spawned which spinoff, which funding source enabled which discovery. ~10–25 lineage links.

### 5. Open questions

5–15 items your lens noticed but could not resolve — missing sources, conflicting dates, disputes in the literature. Flag for editorial decision.

### 6. Cross-references

Named links to other maps in the Mind Maps series where a connection exists. Series roster: ux-design, venture-capital, silicon-valley-history, history-of-innovation, systems-software-protocols, artificial-intelligence, robotics-and-automation, semiconductors, cryptography, quantum-technology, space-and-spaceflight, industrial-processes, medicine-and-biotech, energy, industrial-design, organizational-design, government, theory-of-innovation, information-theory, systems-thinking-cybernetics, paradigm-shifts, industrial-revolutions, industrial-research-labs, revolutionary-technologies.

## Rigor rules

- Every claim has a date or a source, preferably both.
- Prefer primary sources (patents, papers, archival records) to tertiary.
- If a popular story is likely apocryphal, flag it `[apocryphal — ...]` rather than repeat it.
- Do not invent facts. If unsure, mark `[uncertain]`.
- If the topic brief is narrower than map-grain (a single person, product, or company), reject the brief and explain why: this series maps domains, not entities.

## Density target

80–120 named historical facts in Section 2. Not 40. Not 200. Existing published maps average ~200 leaf facts across all branches — your lens supplies the historical half.

## What not to produce

- TypeScript, JSON, or `MapData` structure — that's the main thread's job.
- Prose essays or narratives — bulleted facts only.
- Speculation about future trends — Innovation Theorist's lens.
- Technical mechanisms or open research problems — Technical Expert's lens.
````

- [ ] **Step 3: Verify file is valid**

Run: `head -10 .claude/agents/map-historian.md`
Expected: YAML frontmatter with `name: map-historian`, `description:`, `tools: WebSearch, WebFetch, Read, Grep, Glob`, `model: sonnet`.

Run: `grep -c '^### ' .claude/agents/map-historian.md`
Expected: `6` (six section headings in the output format).

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/map-historian.md
git commit -m "feat(agents): add map-historian subagent for Mind Maps research"
```

---

## Task 2: Create the Technical Expert subagent

**Files:**
- Create: `.claude/agents/map-technical-expert.md`

- [ ] **Step 1: Write the subagent file**

Create `.claude/agents/map-technical-expert.md` with this exact content:

````markdown
---
name: map-technical-expert
description: Technical domain expert for the Mind Maps series on briantighe.design. Use when authoring a new Mind Maps entry — given a candidate map topic at domain-grain, produces a structured Markdown report of mechanisms, tradeoffs, open problems, benchmarks, and scaling laws. Returns a Markdown document; does not edit files.
tools: WebSearch, WebFetch, Read, Grep, Glob
model: opus
---

You are a technical domain expert contributing to the Mind Maps series on briantighe.design — a survey-of-innovation project where each map is a six-branch topic tree with ~150–200 named leaf facts. Your lens is mechanisms, tradeoffs, and open problems.

## Your job

Given a candidate map topic, explain how the technology or science actually works at the level a technical reader wants to see. You do not edit files. You do not write `MapData`. You gather technical facts at the depth the series requires.

## What to produce

A Markdown document with these sections, in this order:

### 1. Proposed branches (3 candidates)

Three candidate six-branch carvings, labeled Carving A / B / C, with a one-sentence rationale each. Note which best serves a technical-mechanism lens and why.

### 2. Sub-topic clusters (6–10 clusters, 5–10 facts each)

For each cluster:
- **Cluster name** — a technical sub-area (e.g., "Architectures," "Training objectives," "Evaluation")
- **5–10 specific technical facts** — each names a mechanism, tradeoff, benchmark, or open problem

Facts should be precise. "Transformers use self-attention" is not a fact. "Vanilla self-attention is O(n²) in sequence length, which is why long-context variants (Flash Attention 2, sliding window, Mamba) exist — each reduces cost with a tradeoff in expressiveness or recency bias" is a fact.

### 3. Scaling laws, benchmarks, and physical limits

5–15 named quantities where the topic has measurable limits or scaling behavior. Cite numbers with sources. Examples: Moore's Law, Dennard scaling breakdown, Chinchilla optimal ratio, thermodynamic floor for computation, MTTF for modern GPUs.

### 4. Open problems and frontier research

5–15 unsolved or partially-solved problems with named research directions and recent paper citations where possible.

### 5. Tradeoffs that define the field

5–10 canonical tradeoffs in this domain, each stated as "if you want X, you give up Y." This is the intellectual spine a reader remembers.

### 6. Cross-references

Named links to other maps in the series. Roster: ux-design, venture-capital, silicon-valley-history, history-of-innovation, systems-software-protocols, artificial-intelligence, robotics-and-automation, semiconductors, cryptography, quantum-technology, space-and-spaceflight, industrial-processes, medicine-and-biotech, energy, industrial-design, organizational-design, government, theory-of-innovation, information-theory, systems-thinking-cybernetics, paradigm-shifts, industrial-revolutions, industrial-research-labs, revolutionary-technologies.

## Rigor rules

- Specificity over generality. Named mechanisms, named benchmarks, named papers.
- Cite recent papers (last 5 years) where the frontier is active; cite classic papers where the foundation is mature.
- If you do not know, say so. Do not confabulate numbers or benchmarks.
- If the topic brief is narrower than map-grain, reject it and explain why.

## Density target

Sections 2–5 combined: 60–100 specific technical facts. This is the depth layer of the map.

## What not to produce

- History, dates, pioneers — Historian's lens.
- Theoretical-framework cross-references (Christensen, Kuhn) — Innovation Theorist's lens.
- TypeScript or `MapData` — main thread's job.
- Prose narratives — bulleted facts only.
````

- [ ] **Step 2: Verify file is valid**

Run: `head -10 .claude/agents/map-technical-expert.md`
Expected: YAML frontmatter with `name: map-technical-expert`, `tools: WebSearch, WebFetch, Read, Grep, Glob`, `model: opus`.

Run: `grep -c '^### ' .claude/agents/map-technical-expert.md`
Expected: `6`.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/map-technical-expert.md
git commit -m "feat(agents): add map-technical-expert subagent for Mind Maps research"
```

---

## Task 3: Create the Innovation Theorist subagent

**Files:**
- Create: `.claude/agents/map-innovation-theorist.md`

- [ ] **Step 1: Write the subagent file**

Create `.claude/agents/map-innovation-theorist.md` with this exact content:

````markdown
---
name: map-innovation-theorist
description: Innovation theorist for the Mind Maps series on briantighe.design. Use when authoring a new Mind Maps entry — given a candidate map topic at domain-grain, cross-references against the theory of innovation (Schumpeter, Christensen, Kuhn, Rogers, Kondratieff, Perez) and returns named thematic claims that connect the topic to the broader intellectual project. Returns a Markdown document; does not edit files.
tools: WebSearch, WebFetch, Read, Grep, Glob
model: opus
---

You are an innovation theorist contributing to the Mind Maps series on briantighe.design — a survey-of-innovation project. Your lens is theory: Kuhn-style paradigm shifts, Christensen-style disruption, Schumpeterian creative destruction, Rogers' diffusion of innovations, Kondratieff waves, Carlota Perez's technological surges, and their kin. Every map in this series should be cross-wired to this theoretical backbone so the series reads as a coherent intellectual project rather than 24 separate encyclopedias.

## Your job

Given a candidate map topic, identify which named innovation frameworks illuminate it, where the topic sits in each framework, and what the topic *means* in the broader theory. You do not edit files. You do not write `MapData`. You produce thematic claims that the author will weave into the map's theoretical spine.

## What to produce

A Markdown document with these sections, in this order:

### 1. Proposed branches (3 candidates)

Three candidate six-branch carvings labeled A / B / C, each with a one-sentence rationale. Note which best supports a theoretical / patterns lens and why.

### 2. Paradigm shifts (Kuhn)

Identify the major Kuhn-style paradigm shifts this topic has undergone. For each: what was the old paradigm, what anomalies accumulated, what the new paradigm replaced it with, and approximately when the shift crystallized. 3–8 shifts per topic depending on maturity.

### 3. Disruption dynamics (Christensen)

Identify disruptive entrants vs. incumbents. Where sustaining innovation dominates vs. where a new-market or low-end disruption took hold. Cite specific companies, products, and technologies with dates. 3–8 episodes.

### 4. S-curves and diffusion (Rogers, Wright, Metcalfe)

Locate the topic on S-curves — which technologies are in early-adopter phase, which are in the steep part of the curve, which are mature. Cite adoption data where available. Identify where network effects (Metcalfe) or learning-curve effects (Wright's Law) change the shape. 5–15 specific curve claims with named technologies.

### 5. Long waves (Kondratieff, Perez)

Place the topic on Kondratieff / Perez long waves. Which technological revolution (1st–5th per Perez) does this topic belong to? Where is it in the installation-vs-deployment phase? What is the current inflection? 3–6 claims tying topic to named Perez surges.

### 6. Analogies to other domains

5–15 cross-domain analogies — cases where the same pattern appears in another field. E.g., "this topic's platform dynamics resemble the shipping-container standardization of the 1960s" or "the current scaling laws echo the Moore's Law era of semis, with differences A, B, C." These analogies make the map legible across fields.

### 7. Cross-references

Named links to other maps in the series. Roster: ux-design, venture-capital, silicon-valley-history, history-of-innovation, systems-software-protocols, artificial-intelligence, robotics-and-automation, semiconductors, cryptography, quantum-technology, space-and-spaceflight, industrial-processes, medicine-and-biotech, energy, industrial-design, organizational-design, government, theory-of-innovation, information-theory, systems-thinking-cybernetics, paradigm-shifts, industrial-revolutions, industrial-research-labs, revolutionary-technologies.

## Rigor rules

- Named frameworks only. "Kuhn paradigm shift" not "big change." "Christensen low-end disruption" not "disruption."
- Where a framework does not fit the topic, say so explicitly rather than force-fit it.
- Cite the framework's canonical text or author when first invoked.
- Do not invent shifts, waves, or S-curves. If you are speculating about phase placement, mark `[speculative]`.

## Density target

Sections 2–6 combined: 30–60 named thematic claims tying the topic to theoretical frameworks. Quality over quantity — a sharp Christensen analysis beats five vague "disruption" claims.

## What not to produce

- Historical timelines — Historian's lens.
- Technical mechanisms — Technical Expert's lens.
- TypeScript or `MapData` — main thread's job.
- Prose essays — bulleted or sectioned claims only.
````

- [ ] **Step 2: Verify file is valid**

Run: `head -10 .claude/agents/map-innovation-theorist.md`
Expected: YAML frontmatter with `name: map-innovation-theorist`, `tools: WebSearch, WebFetch, Read, Grep, Glob`, `model: opus`.

Run: `grep -c '^### ' .claude/agents/map-innovation-theorist.md`
Expected: `7` (this agent has a seventh section for analogies).

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/map-innovation-theorist.md
git commit -m "feat(agents): add map-innovation-theorist subagent for Mind Maps research"
```

---

## Task 4: Gitignore transient research artifacts

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Inspect current .gitignore**

Run: `cat .gitignore`
Expected: some existing ignore patterns (node_modules, .next, etc.).

- [ ] **Step 2: Append research-artifacts path**

Append this block to `.gitignore`:

```
# Mind Maps research artifacts (transient agent outputs, not shipped)
docs/superpowers/map-research/
```

- [ ] **Step 3: Verify**

Run: `grep -n 'map-research' .gitignore`
Expected: a line matching `docs/superpowers/map-research/`.

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore Mind Maps agent research artifacts"
```

---

## Task 5: Validate subagent dispatch on a throwaway topic

This task has no commit — it's a manual checkpoint. The goal is to confirm all three subagents dispatch, produce output, and follow the prescribed section structure before the registry gets seeded. If output drifts from the schema, fix the subagent file before proceeding.

**Files:** none modified; outputs saved under the gitignored `docs/superpowers/map-research/`.

- [ ] **Step 1: Create the research-artifacts directory**

Run: `mkdir -p docs/superpowers/map-research`
Expected: no output.

- [ ] **Step 2: Dispatch all three subagents in parallel on a throwaway topic**

In a Claude Code session rooted at `/Users/briantighe/briantighe-v2`, send a single message containing three Agent tool calls — one per subagent — with the topic brief "Lasers & Photonics (research probe — not being authored today)."

Topic brief content, identical for all three:

> Topic: Lasers & Photonics. This is a dispatch probe to validate your output format. Produce your full structured report per your system prompt. Do not reduce density. The report will be read to check format compliance; no map is being authored from it.

Subagent types to dispatch (exact strings): `map-historian`, `map-technical-expert`, `map-innovation-theorist`.

Expected: three Markdown reports returned, each ~1.5–3k words.

- [ ] **Step 3: Save each report locally**

Save each returned report to:
- `docs/superpowers/map-research/probe-lasers-historian.md`
- `docs/superpowers/map-research/probe-lasers-technical-expert.md`
- `docs/superpowers/map-research/probe-lasers-innovation-theorist.md`

- [ ] **Step 4: Verify section compliance**

For `probe-lasers-historian.md`:

Run: `grep -c '^### ' docs/superpowers/map-research/probe-lasers-historian.md`
Expected: `6`.

Run: `grep -E '^### 1\. Proposed branches|^### 2\. Named historical facts|^### 3\. Forgotten|^### 4\. Institutional lineage|^### 5\. Open questions|^### 6\. Cross-references' docs/superpowers/map-research/probe-lasers-historian.md | wc -l`
Expected: `6`.

For `probe-lasers-technical-expert.md`:

Run: `grep -c '^### ' docs/superpowers/map-research/probe-lasers-technical-expert.md`
Expected: `6`.

For `probe-lasers-innovation-theorist.md`:

Run: `grep -c '^### ' docs/superpowers/map-research/probe-lasers-innovation-theorist.md`
Expected: `7`.

- [ ] **Step 5: Density sanity check**

Count bulleted facts in the Historian report:

Run: `grep -cE '^-\s' docs/superpowers/map-research/probe-lasers-historian.md`
Expected: ≥ `80`. If < 80, the Historian is under-producing; revise its prompt before continuing.

Count bulleted technical facts in the Technical Expert report:

Run: `grep -cE '^-\s' docs/superpowers/map-research/probe-lasers-technical-expert.md`
Expected: ≥ `50`.

- [ ] **Step 6: If any check fails, iterate on the offending subagent's system prompt and re-dispatch that one agent only.** Stop and fix before proceeding to Task 6. Do not commit revisions until probe compliance is clean.

- [ ] **Step 7: If all checks pass, note in the session and continue.** No commit — these artifacts are gitignored.

---

## Task 6: Seed the registry with 20 `planned` entries

**Files:**
- Modify: `content/maps/registry.ts`

- [ ] **Step 1: Read the current registry**

Run: `cat content/maps/registry.ts`
Expected: 6 existing entries (`ux-design`, `venture-capital`, `apple-inc`, `silicon-valley-history`, `thomas-edison`, `history-of-innovation`) inside `catalog`.

- [ ] **Step 2: Append the 20 new entries**

Open `content/maps/registry.ts`. Inside the `catalog` array, immediately after the `history-of-innovation` entry and before the closing `];`, insert the following 20 entries. Maintain existing TypeScript formatting (2-space indent, single quotes, trailing commas).

```typescript
  // --- Survey of Innovation expansion (2026-04-24) ---
  // Seeded as 'planned' per spec; each graduates to 'published' when its data file ships.
  {
    slug: 'systems-software-protocols',
    title: 'Systems Software & Protocols',
    subtitle: 'Operating systems, databases, networking — the substrate of modern computing',
    date: '2026-04-24',
    summary:
      'Survey of the systems-software layer: operating systems from batch-processing mainframes through Unix to mobile and cloud; database architectures from hierarchical to relational to NoSQL to vector; networking protocols from packet-switching through TCP/IP to modern satellite and mesh; the standards and organizations that made interoperability possible.',
    status: 'planned',
  },
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    subtitle: 'Symbolic AI through connectionism to deep learning to LLMs and agents',
    date: '2026-04-24',
    summary:
      'Survey of artificial intelligence: the symbolic era (logic, expert systems, GOFAI); the first and second connectionist waves; deep learning (ImageNet through transformers); large language models and foundation models; agentic systems; the alignment, evaluation, and scaling debates.',
    status: 'planned',
  },
  {
    slug: 'robotics-and-automation',
    title: 'Robotics & Automation',
    subtitle: 'Industrial arms, mobile robots, humanoids, swarms',
    date: '2026-04-24',
    summary:
      'Survey of robotics and automation: kinematics and control theory; industrial arms from Unimate to modern cobots; mobile and autonomous robots; humanoid and general-purpose platforms; swarm robotics; the sensing, actuation, and compute stacks that enable them.',
    status: 'planned',
  },
  {
    slug: 'semiconductors',
    title: 'Semiconductors & Microelectronics',
    subtitle: 'Transistor to integrated circuit to modern fabs',
    date: '2026-04-24',
    summary:
      'Survey of semiconductors and microelectronics: solid-state physics foundations; the transistor and the integrated circuit; photolithography and modern fabrication; Moore\'s Law, Dennard scaling, and the post-scaling era; specialized accelerators (GPU, TPU, custom silicon); the industry structure from IDM to fabless-foundry.',
    status: 'planned',
  },
  {
    slug: 'cryptography',
    title: 'Cryptography',
    subtitle: 'From ciphers and codebreaking through public-key to post-quantum',
    date: '2026-04-24',
    summary:
      'Survey of cryptography: classical ciphers and codebreaking; Shannon\'s information-theoretic foundations; public-key cryptography (Diffie-Hellman, RSA, elliptic-curve); protocols and standards (TLS, Signal, Tor); hash functions and digital signatures; zero-knowledge proofs; post-quantum cryptography.',
    status: 'planned',
  },
  {
    slug: 'quantum-technology',
    title: 'Quantum Technology',
    subtitle: 'Computing, sensing, communication, and the hard physics underneath',
    date: '2026-04-24',
    summary:
      'Survey of quantum technology: the physics (superposition, entanglement, decoherence); quantum computing architectures (superconducting, trapped-ion, photonic, topological); quantum algorithms (Shor, Grover, VQE) and complexity claims; quantum sensing (NV centers, atom interferometry); quantum communication (QKD, quantum repeaters).',
    status: 'planned',
  },
  {
    slug: 'space-and-spaceflight',
    title: 'Space & Spaceflight',
    subtitle: 'Rocketry, satellites, exploration, commercial space',
    date: '2026-04-24',
    summary:
      'Survey of space and spaceflight: chemical rocketry foundations; the Space Race and Apollo; the Shuttle and Station era; the commercial-space pivot (SpaceX, Rocket Lab, reusability); satellite constellations (GPS, Starlink); planetary exploration; the economics and geopolitics of modern space.',
    status: 'planned',
  },
  {
    slug: 'industrial-processes',
    title: 'Industrial Processes',
    subtitle: 'Chemical process, manufacturing, lean, additive — how things are actually made',
    date: '2026-04-24',
    summary:
      'Survey of industrial processes: chemical engineering unit operations (distillation, reaction, separation); the Haber-Bosch and catalytic cracking revolutions; interchangeable parts and the moving assembly line; the Toyota Production System and lean manufacturing; process control and Six Sigma; additive manufacturing; modern semiconductor fabrication.',
    status: 'planned',
  },
  {
    slug: 'medicine-and-biotech',
    title: 'Medicine & Biotech',
    subtitle: 'Drugs, devices, diagnostics, genetic medicine, public health',
    date: '2026-04-24',
    summary:
      'Survey of medicine and biotech: pharmaceuticals from natural-product isolation through rational drug design to AI-discovered candidates; medical devices and imaging; diagnostics from microscopy through sequencing; vaccines (classical through mRNA); genetic medicine and CRISPR therapeutics; public health and epidemiology.',
    status: 'planned',
  },
  {
    slug: 'energy',
    title: 'Energy',
    subtitle: 'Generation, storage, grid — from steam to solid-state',
    date: '2026-04-24',
    summary:
      'Survey of energy: thermodynamic foundations; generation technologies (fossil, hydro, nuclear fission, renewables, fusion); storage (pumped hydro, lithium-ion, solid-state, flow batteries, hydrogen); transmission and the grid; efficiency and demand-side management; the policy and economics of energy transitions.',
    status: 'planned',
  },
  {
    slug: 'industrial-design',
    title: 'Contemporary Topics in Industrial Design',
    subtitle: 'Materials, methods, manufacturing, sustainability, aesthetics, practice',
    date: '2026-04-24',
    summary:
      'Survey of contemporary industrial design: materials and processes; form-giving and ergonomics; design-for-manufacturing and design-for-assembly; sustainability and circularity; emerging aesthetics and movements; the structure of the modern industrial-design profession.',
    status: 'planned',
  },
  {
    slug: 'organizational-design',
    title: 'Contemporary Topics in Organizational Design',
    subtitle: 'Structure, coordination, culture, incentives, scale',
    date: '2026-04-24',
    summary:
      'Survey of contemporary organizational design: structural archetypes (functional, divisional, matrix, network, platform); coordination mechanisms and information flow; culture, identity, and selection; incentives and compensation design; scale transitions; remote and distributed work; the practitioner literature from Drucker through modern org-design consultancies.',
    status: 'planned',
  },
  {
    slug: 'government',
    title: 'Contemporary Topics in Government',
    subtitle: 'Constitutional design, administration, policy, technology, accountability',
    date: '2026-04-24',
    summary:
      'Survey of contemporary government: constitutional and administrative design; bureaucratic theory; public finance and regulation; policy innovation and implementation; technology in government and digital services; elections, representation, and legitimacy; the comparative study of governmental systems.',
    status: 'planned',
  },
  {
    slug: 'theory-of-innovation',
    title: 'The Theory of Innovation',
    subtitle: 'Schumpeter, Christensen, Rogers, Kondratieff, Perez, and the scholars who followed',
    date: '2026-04-24',
    summary:
      'Survey of the theory of innovation: Schumpeterian creative destruction; Christensen\'s disruption; Rogers\' diffusion of innovations; Kondratieff waves and Perez\'s technological surges; S-curves, learning curves, and network effects; Kuhn\'s paradigm shifts; combinatorial innovation; contemporary scholars (Christensen, Arthur, Thiel, Gordon, Mokyr) and their debates.',
    status: 'planned',
  },
  {
    slug: 'information-theory',
    title: 'Information Theory',
    subtitle: 'Shannon, entropy, coding, and the mathematics of signal',
    date: '2026-04-24',
    summary:
      'Survey of information theory: Shannon\'s 1948 foundations; entropy, mutual information, and channel capacity; source coding and data compression; error-correcting codes; Kolmogorov complexity; information theory in statistics, machine learning, and biology; modern extensions (rate-distortion, network information theory).',
    status: 'planned',
  },
  {
    slug: 'systems-thinking-cybernetics',
    title: 'Systems Thinking & Cybernetics',
    subtitle: 'Wiener, Forrester, Meadows, and the science of feedback',
    date: '2026-04-24',
    summary:
      'Survey of systems thinking and cybernetics: Wiener\'s cybernetics; control theory and feedback; system dynamics (Forrester, Meadows); complexity science and emergence; Ashby\'s law of requisite variety; soft systems methodology; applications in management, policy, and ecology.',
    status: 'planned',
  },
  {
    slug: 'paradigm-shifts',
    title: 'Paradigm Shifts',
    subtitle: 'Kuhn, Popper, Lakatos, and case studies across the history of science',
    date: '2026-04-24',
    summary:
      'Survey of paradigm shifts: Kuhn\'s Structure of Scientific Revolutions; Popper\'s falsifiability and Lakatos\' research programmes; case studies (Copernican, Darwinian, quantum, plate tectonics, germ theory, genetic); the sociology of scientific revolutions; contemporary debates on replication and reform.',
    status: 'planned',
  },
  {
    slug: 'industrial-revolutions',
    title: 'The Industrial Revolutions',
    subtitle: '1st through 4th — comparative survey',
    date: '2026-04-24',
    summary:
      'Survey of the four industrial revolutions: the First (1760–1840, steam and textiles); the Second (1870–1914, electricity, steel, chemistry); the Third (1950–2000, digital and automation); the Fourth (2000–present, AI, biotech, cyber-physical systems); the comparative patterns in geography, labor, capital, and social effects.',
    status: 'planned',
  },
  {
    slug: 'industrial-research-labs',
    title: 'The Great Industrial Research Labs',
    subtitle: 'Bell, PARC, Skunkworks, IBM Research, Microsoft Research, and their kin',
    date: '2026-04-24',
    summary:
      'Survey of the great industrial research labs: Edison\'s Menlo Park; GE Research; Bell Labs; Xerox PARC; IBM Research; Lockheed\'s Skunkworks; Microsoft Research; Google X and DeepMind; OpenAI and Anthropic; the institutional designs, funding mechanisms, and cultural conditions that produced durable invention — and their failure modes.',
    status: 'planned',
  },
  {
    slug: 'revolutionary-technologies',
    title: 'Revolutionary Technologies',
    subtitle: 'The transistor, the laser, the integrated circuit, GPS, the internet, CRISPR',
    date: '2026-04-24',
    summary:
      'Survey of a handful of world-changing technologies: the transistor and solid-state electronics; the laser; the integrated circuit and Moore\'s Law; GPS and satellite navigation; the internet and TCP/IP; CRISPR-Cas9 genome editing; the common pattern — decades of quiet foundational work followed by a rapid deployment phase.',
    status: 'planned',
  },
```

- [ ] **Step 3: Verify file parses**

Run: `npx tsc --noEmit --project tsconfig.json`
Expected: no TypeScript errors for `content/maps/registry.ts`.

If there are errors: check for trailing commas, mismatched quotes, unescaped apostrophes in summary strings (must use `\'` inside single-quoted strings).

- [ ] **Step 4: Verify `publishedSlugs()` still returns only the original 4 published**

Run: `grep -c "status: 'published'" content/maps/registry.ts`
Expected: `4`.

Run: `grep -c "status: 'planned'" content/maps/registry.ts`
Expected: `22` (2 pre-existing planned: apple-inc, thomas-edison; + 20 new).

- [ ] **Step 5: Commit**

```bash
git add content/maps/registry.ts
git commit -m "feat(maps): seed registry with 20 survey-of-innovation planned entries"
```

---

## Task 7: Verify the /maps index renders all 26 entries

**Files:** none modified — verification only.

- [ ] **Step 1: Start the dev server in the background**

Run: `npm run dev`
Expected: server listening on `http://localhost:3000` (or next available port).

- [ ] **Step 2: Fetch the /maps index**

Run: `curl -s http://localhost:3000/maps | grep -E 'systems-software-protocols|artificial-intelligence|theory-of-innovation|revolutionary-technologies' | head`
Expected: at least one line per checked slug, confirming the index renders all the new planned entries.

- [ ] **Step 3: Verify no build errors**

Run: `npm run build`
Expected: `Compiled successfully` and no errors. `.next/` produced.

- [ ] **Step 4: If all checks pass, stop the dev server. No commit.**

- [ ] **Step 5: If there are errors, stop and debug before proceeding.** Common failure modes: TypeScript errors in `registry.ts` (see Task 6 Step 3 recovery), or the `/maps/page.tsx` component not handling `status: 'planned'` entries correctly. If the latter, inspect `app/maps/page.tsx` and note the issue — but do not fix it here; file a follow-up.

---

## Task 8: Author the validation map (`artificial-intelligence`) — dispatch agents

**Files:**
- Create (transient, gitignored): `docs/superpowers/map-research/artificial-intelligence-{historian,technical-expert,innovation-theorist}.md`

- [ ] **Step 1: Dispatch all three subagents in parallel**

In a Claude Code session rooted at `/Users/briantighe/briantighe-v2`, send one message containing three Agent tool calls for subagent types `map-historian`, `map-technical-expert`, `map-innovation-theorist`. Use this topic brief, identical for all three:

> Topic: Artificial Intelligence. This is the first map being authored under the 2026 survey-of-innovation expansion. Produce your full structured report per your system prompt. Focus on the arc from symbolic AI through connectionism, deep learning, LLMs, and contemporary agentic systems. Include both the pre-1990 foundations and the modern era. Do not stop at LLMs — include alignment, evaluation, and agentic systems. Do not reduce density.

- [ ] **Step 2: Save each report**

Save each returned report to:
- `docs/superpowers/map-research/artificial-intelligence-historian.md`
- `docs/superpowers/map-research/artificial-intelligence-technical-expert.md`
- `docs/superpowers/map-research/artificial-intelligence-innovation-theorist.md`

- [ ] **Step 3: Run density checks**

Run: `grep -cE '^-\s' docs/superpowers/map-research/artificial-intelligence-historian.md`
Expected: ≥ `80`.

Run: `grep -cE '^-\s' docs/superpowers/map-research/artificial-intelligence-technical-expert.md`
Expected: ≥ `50`.

Run: `grep -c '^### ' docs/superpowers/map-research/artificial-intelligence-innovation-theorist.md`
Expected: `7`.

- [ ] **Step 4: If density fails, re-dispatch the offending agent with a sharper brief.** Do not proceed to Task 9 with thin inputs.

- [ ] **Step 5: No commit — research artifacts are gitignored.**

---

## Task 9: Author the validation map (`artificial-intelligence`) — synthesize `MapData`

**Files:**
- Create: `content/maps/artificial-intelligence.ts`

- [ ] **Step 1: Read an existing map file for reference**

Run: `head -60 content/maps/history-of-innovation.ts`
Expected: `export const map: MapData = { ... }` with `slug`, `title`, `date`, `description`, `branchColors`, and `root: { label: '...', children: [...] }`.

- [ ] **Step 2: Pick the six top-level branches**

Read the three "Proposed branches" sections across your three research reports (Historian, Technical Expert, Theorist). Pick one carving — either from a single report or synthesized from across them. The canonical shape for AI as of 2026 is approximately:

1. **Foundations** — early formalism, cybernetics, symbolic AI, expert systems
2. **Connectionism** — perceptrons, backprop, first and second neural-network waves
3. **Deep learning** — ImageNet era, CNNs, RNNs, attention, transformers
4. **Large language models and foundation models** — scaling laws, instruction tuning, RLHF, multimodality
5. **Agentic systems** — tool use, planning, multi-agent, autonomous agents
6. **Alignment, evaluation, and open problems** — interpretability, eval, safety, governance, scaling debates

Carving A above is a suggestion; replace with the carving your research supports.

- [ ] **Step 3: Write `content/maps/artificial-intelligence.ts`**

Create the file with this skeleton, filling in the `children` trees from your synthesized research. Target density: each top-level branch has 3–4 levels of nesting and 20–35 leaf facts, totaling ~150–200 leaves across the tree. Use `branchColors` consistent with existing maps' palette (see `history-of-innovation.ts` for reference).

```typescript
import type { MapData } from './types';

export const map: MapData = {
  slug: 'artificial-intelligence',
  title: 'Artificial Intelligence',
  subtitle: 'Symbolic AI through connectionism to deep learning to LLMs and agents',
  date: '2026-04-24',
  description:
    // 2–4 sentences summarizing the survey. Draw from the research reports.
    // Example: "Survey of artificial intelligence from its symbolic foundations through the modern era of large language models and agentic systems. Six branches covering foundations, connectionism, deep learning, foundation models, agents, and the open problems of alignment and evaluation. Approximately 180 named facts drawn from research across three research lenses: history, mechanism, and theory of innovation."
    'FILL IN',
  relatedEssays: [
    // Optional — link any published essays on briantighe.design that touch AI.
  ],
  branchColors: [
    // Six colors, one per top-level branch. Match the visual style of existing maps.
    // Example colors from history-of-innovation — replace with your choices:
    '#7b4a2c', // Foundations — earthy
    '#2d5f8b', // Connectionism — deep blue
    '#5a8c3a', // Deep learning — green
    '#c87a2c', // Foundation models — orange
    '#8e3a5f', // Agentic systems — magenta
    '#3a5a5a', // Alignment & open problems — muted teal
  ],
  root: {
    label: 'Artificial Intelligence',
    children: [
      {
        label: 'Foundations',
        children: [
          // ~30 leaves nested 2–3 deep. Pull from Historian report Section 2 entries
          // up to the mid-1980s, plus Technical Expert's foundational mechanisms.
        ],
      },
      {
        label: 'Connectionism',
        children: [
          // Perceptrons through the second NN wave. Pull from Historian + Technical Expert.
        ],
      },
      {
        label: 'Deep learning',
        children: [
          // ImageNet era through transformers. Pull heavily from Technical Expert.
        ],
      },
      {
        label: 'Large language models and foundation models',
        children: [
          // Scaling laws, RLHF, multimodality. Pull from Technical Expert + Theorist.
        ],
      },
      {
        label: 'Agentic systems',
        children: [
          // Tool use, planning, multi-agent. Pull from Technical Expert + Theorist.
        ],
      },
      {
        label: 'Alignment, evaluation, and open problems',
        children: [
          // Interpretability, eval benchmarks, safety. Pull from Technical Expert + Theorist.
        ],
      },
    ],
  },
};
```

Each `children` entry is a `MapNode` — `{ label: string; children?: MapNode[] }` per `content/maps/types.ts`. Leaf nodes have no `children`.

Fill in the `FILL IN` description string with 2–4 sentences drawn from the research.

Fill in each empty `children` array with the nested tree of labels from the three research reports, deduplicating where lenses overlap.

- [ ] **Step 4: Count leaf nodes**

Write the file, save it, then count leaves by running:

```bash
node -e "const {map} = require('./content/maps/artificial-intelligence.ts'); function count(n){return !n.children||n.children.length===0?1:n.children.reduce((s,c)=>s+count(c),0);} console.log('leaves:', count(map.root));"
```

Note: this invocation assumes a Node runtime that handles TS via loader. If it fails, use this alternate:

```bash
grep -cE '^\s+label: ' content/maps/artificial-intelligence.ts
```

Expected: ≥ `150` total nodes (leaves + intermediates). If below, the map is too thin — return to Task 8 reports and extract more facts.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If errors, fix syntax (missing commas, unclosed braces, mis-typed properties).

---

## Task 10: Register `artificial-intelligence` as published and verify rendering

**Files:**
- Modify: `content/maps/registry.ts`

- [ ] **Step 1: Flip the registry entry**

In `content/maps/registry.ts`, find the `artificial-intelligence` entry (the first of the 20 new entries). Change `status: 'planned',` to `status: 'published',` and add a `load` field immediately after. The entry should become:

```typescript
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    subtitle: 'Symbolic AI through connectionism to deep learning to LLMs and agents',
    date: '2026-04-24',
    summary:
      'Survey of artificial intelligence: the symbolic era (logic, expert systems, GOFAI); the first and second connectionist waves; deep learning (ImageNet through transformers); large language models and foundation models; agentic systems; the alignment, evaluation, and scaling debates.',
    status: 'published',
    load: () =>
      import('./artificial-intelligence').then((m) => ({ map: m.map })),
  },
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Start the dev server and verify the route**

Run: `npm run dev`

In another shell:

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/maps/artificial-intelligence`
Expected: `200`.

Run: `curl -s http://localhost:3000/maps/artificial-intelligence | grep -E 'Artificial Intelligence|Foundations|Connectionism|Deep learning' | head`
Expected: matches for the page title and at least some branch labels.

- [ ] **Step 4: Manual inspection in a browser**

Open `http://localhost:3000/maps/artificial-intelligence` in a browser. Confirm:
- Six top-level branches render with distinct colors
- 3–4 levels of nesting visible
- No overlapping or clipped labels
- Related essays render if any were set

If the render is broken (overlapping text, missing branches), the issue is likely in the density or structure of `root.children` — return to Task 9 Step 3 and rebalance.

- [ ] **Step 5: Stop the dev server. Commit.**

```bash
git add content/maps/artificial-intelligence.ts content/maps/registry.ts
git commit -m "feat(maps): publish Artificial Intelligence (first of 20 in survey expansion)"
```

---

## Task 11: Update project memory to reflect the new system

**Files:**
- Modify: `/Users/briantighe/.claude/projects/-Users-briantighe/memory/briantighe-v2-mind-maps.md`

- [ ] **Step 1: Read the current memory file**

Run: `cat /Users/briantighe/.claude/projects/-Users-briantighe/memory/briantighe-v2-mind-maps.md`

- [ ] **Step 2: Append a section describing the three subagents**

Add this section to the memory file (before the final `**Why:** / **How to apply:**` lines):

```markdown
## Research subagents (added 2026-04-24)

Three project-local Claude Code subagents live at `.claude/agents/` in the briantighe-v2 repo. Dispatch all three in parallel on a candidate topic brief; synthesize the three reports into a `MapData` file.

- `map-historian` (Sonnet) — chronology, pioneers, primary sources. Density target: 80–120 named historical facts.
- `map-technical-expert` (Opus) — mechanisms, tradeoffs, open problems. Density target: 60–100 specific technical facts across 6–10 sub-topic clusters.
- `map-innovation-theorist` (Opus) — Kuhn / Christensen / Rogers / Kondratieff / Perez cross-references. Density target: 30–60 named thematic claims.

Workflow: dispatch in parallel → save reports to `docs/superpowers/map-research/<slug>-<agent>.md` (gitignored) → main thread drafts `MapData` skeleton → author fills in children trees → flip registry entry to `published` + add `load()`.

## Survey of Innovation expansion (2026-04-24)

20 new planned entries seeded in `content/maps/registry.ts`: systems-software-protocols, artificial-intelligence, robotics-and-automation, semiconductors, cryptography, quantum-technology, space-and-spaceflight, industrial-processes, medicine-and-biotech, energy, industrial-design, organizational-design, government, theory-of-innovation, information-theory, systems-thinking-cybernetics, paradigm-shifts, industrial-revolutions, industrial-research-labs, revolutionary-technologies. First authored: artificial-intelligence.
```

- [ ] **Step 3: No commit required** — this is in `~/.claude/`, not in the repo.

---

## Self-review checklist (completed by plan author)

- [x] Spec section "Context and goal" → covered by Tasks 1–10 (scaffold + seed + validate).
- [x] Spec section "Non-goals" — no task creates a generator, touches MapData types, or adds routes. Confirmed.
- [x] Spec "Architecture" diagram — every new path in the diagram has a task:
  - `.claude/agents/map-historian.md` → Task 1.
  - `.claude/agents/map-technical-expert.md` → Task 2.
  - `.claude/agents/map-innovation-theorist.md` → Task 3.
  - `content/maps/registry.ts` modification → Task 6.
  - `content/maps/artificial-intelligence.ts` → Task 9.
- [x] Spec "The 20 maps" table — all 20 slugs present in Task 6 Step 2, verified by grep in Task 6 Step 4.
- [x] Spec "The three subagents" lens/responsibilities/tools/output format — each encoded into the subagent prompt body in Tasks 1–3.
- [x] Spec "Authoring workflow" 7 steps — mapped into Tasks 8–10.
- [x] Spec "Success criteria":
  - Three subagent files exist → Tasks 1–3 + verification greps.
  - Parallel dispatch produces structurally consistent reports → Task 5 (probe) + Task 8 (real run).
  - At least one new map authored end-to-end → Tasks 8–10.
  - Existing maps continue to render → implicit in Task 7 build verification.
- [x] Spec "Risks and mitigations" — density targets encoded in each subagent prompt (Tasks 1–3) and verified in Tasks 5 and 8.
- [x] Spec "Open questions":
  - Subagent model choice → resolved in the plan (Sonnet / Opus / Opus) with option to revisit in a follow-up.
  - Dispatch automation skill wrapper → deferred, not in this plan. OK per spec.
  - Registry seeding → resolved by seeding all 20 as `planned` up front in Task 6.
- [x] No "TBD" or "fill in details" tokens in any task code block. (Task 9 Step 3 contains explicit `FILL IN` markers in the template — these are the *content* the engineer generates from their own research reports, not a placeholder the plan failed to resolve. This is the content-authoring step and is deliberately instructional rather than code-prescriptive.)
- [x] Type consistency: `MapData` and `MapNode` property names match `content/maps/types.ts` (verified by reading the file at plan authoring time): `slug`, `title`, `subtitle`, `date`, `description`, `relatedEssays`, `branchColors`, `root`, and `MapNode = { label; children? }`. No invented fields.
- [x] Every code-change step has code. No "implement the function" placeholders.
- [x] Each task ends with either a commit or an explicit "no commit" annotation.
