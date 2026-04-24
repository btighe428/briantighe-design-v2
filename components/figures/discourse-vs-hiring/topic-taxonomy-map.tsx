import type { GapReport } from "./types";

const CATEGORIES = [
  { slug: "ai", label: "AI" },
  { slug: "design-process", label: "Design process" },
  { slug: "tooling", label: "Tooling" },
  { slug: "growth-pm", label: "Growth / PM" },
  { slug: "emergent", label: "Emergent" },
] as const;

const W = 680;
const COL_W = W / CATEGORIES.length;
const ROW_H = 18;
const HEADER_H = 36;

export function TopicTaxonomyMap({ data }: { data: GapReport }) {
  const all = [...data.rows, ...data.excluded];
  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    topics: all
      .filter((t) => t.category === c.slug)
      .sort((a, b) => a.label.localeCompare(b.label)),
  }));
  const maxRows = Math.max(...byCategory.map((c) => c.topics.length));
  const H = HEADER_H + maxRows * ROW_H + 16;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Five categories of topics: ${CATEGORIES.map((c) => c.label).join(", ")}. ${all.length} topics total.`}
      >
        <title>Topic taxonomy</title>
        <desc>{all.length} topics grouped into five categories.</desc>
        {byCategory.map((c, i) => (
          <g key={c.slug} transform={`translate(${i * COL_W}, 0)`}>
            <text
              x={COL_W / 2}
              y={20}
              fontSize={11}
              textAnchor="middle"
              fill="var(--color-ink)"
              style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
            >
              {c.label}
            </text>
            <line x1={8} x2={COL_W - 8} y1={28} y2={28} stroke="var(--color-rule)" strokeWidth={0.5} />
            {c.topics.map((t, j) => (
              <text
                key={t.slug}
                x={COL_W / 2}
                y={HEADER_H + j * ROW_H}
                fontSize={10}
                textAnchor="middle"
                fill="var(--color-ink-muted)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {t.label}
              </text>
            ))}
          </g>
        ))}
      </svg>
      <figcaption>
        The ~40-term taxonomy used for classification, grouped by category. Full definitions and aliases live on the
        methodology page.
      </figcaption>
    </figure>
  );
}
