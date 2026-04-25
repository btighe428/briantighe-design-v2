import type { GapReport, GapRow } from "./types";

const FEATURED_SLUGS = [
  // Top 3 most overhyped
  // Bottom 3 most underhyped
  // Editorial choice at author time; initial defaults:
  "vibe-coding",
  "ai-agents",
  "mcp",
  "user-research",
  "prototyping",
  "figma",
];

const CELL_W = 200;
const CELL_H = 100;
const COLS = 3;
const PAD = 12;

export function TopicDivergenceDetails({ data }: { data: GapReport }) {
  const featured = FEATURED_SLUGS.map((slug) => data.rows.find((r) => r.slug === slug))
    .filter(Boolean) as GapRow[];
  const rows = Math.ceil(featured.length / COLS);
  const W = CELL_W * COLS + PAD * (COLS + 1);
  const H = CELL_H * rows + PAD * (rows + 1) + 20;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Weekly posts vs. job listings for ${featured.length} topics, each normalized to its own maxima.`}
      >
        <title>Topic-level divergence, weekly</title>
        <desc>Small multiples comparing weekly discourse volume to weekly hiring volume for featured topics.</desc>
        {featured.map((row, i) => {
          const col = i % COLS;
          const r = Math.floor(i / COLS);
          const x0 = PAD + col * (CELL_W + PAD);
          const y0 = PAD + r * (CELL_H + PAD);
          const series = row.weeklySeries ?? [];
          const maxPosts = Math.max(1, ...series.map((s) => s.posts));
          const maxJds = Math.max(1, ...series.map((s) => s.jds));
          const scaleX = (i: number) =>
            x0 + 8 + (i / Math.max(1, series.length - 1)) * (CELL_W - 16);
          const scaleY = (v: number, max: number) =>
            y0 + 30 + (CELL_H - 40) - (v / max) * (CELL_H - 40);
          const pPath = series
            .map((s, j) => `${j === 0 ? "M" : "L"} ${scaleX(j).toFixed(1)} ${scaleY(s.posts, maxPosts).toFixed(1)}`)
            .join(" ");
          const jPath = series
            .map((s, j) => `${j === 0 ? "M" : "L"} ${scaleX(j).toFixed(1)} ${scaleY(s.jds, maxJds).toFixed(1)}`)
            .join(" ");
          return (
            <g key={row.slug}>
              <text
                x={x0 + 4}
                y={y0 + 14}
                fontSize={11}
                fill="var(--color-ink)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {row.label}
              </text>
              <text
                x={x0 + CELL_W - 4}
                y={y0 + 14}
                fontSize={10}
                textAnchor="end"
                fill={row.logGap >= 0 ? "var(--color-accent)" : "var(--color-ink-muted)"}
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {(row.logGap >= 0 ? "+" : "") + row.logGap.toFixed(2)}
              </text>
              <path d={pPath} fill="none" stroke="var(--color-accent)" strokeWidth={1.2} />
              <path d={jPath} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
            </g>
          );
        })}
        <text
          x={PAD}
          y={H - 8}
          fontSize={9}
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          red = posts · black = jds · each normalized to its own peak
        </text>
      </svg>
      <figcaption>Weekly discourse volume vs. job-listing volume for six featured topics. Each pane scales independently.</figcaption>
    </figure>
  );
}
