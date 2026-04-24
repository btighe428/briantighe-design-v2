import type { GapReport } from "./types";

const W = 680;
const PAD = { top: 40, right: 24, bottom: 48, left: 180 };
const ROW_HEIGHT = 22;

const CATEGORY_COLORS: Record<string, string> = {
  ai: "var(--color-accent)",
  "design-process": "var(--color-ink)",
  tooling: "var(--color-ink-muted)",
  "growth-pm": "var(--color-ink)",
  emergent: "var(--color-accent)",
};

export function GapDumbbell({ data }: { data: GapReport }) {
  const rows = [...data.rows].sort((a, b) => b.logGap - a.logGap);
  const H = PAD.top + PAD.bottom + rows.length * ROW_HEIGHT;
  const chartW = W - PAD.left - PAD.right;

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.logGap)));
  const scaleX = (v: number) => PAD.left + (v / maxAbs) * (chartW / 2) + chartW / 2;
  const zeroX = scaleX(0);

  const ticks = [-Math.ceil(maxAbs), -1, 0, 1, Math.ceil(maxAbs)];

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`${rows.length} topics ranked by the log-ratio of influencer-post frequency to job-listing frequency. Topics with a positive log-gap are over-represented in design discourse relative to hiring; negative means under-represented.`}
      >
        <title>Discourse vs. hiring gap, ranked</title>
        <desc>
          Each row is a topic. A horizontal segment connects hire-share (left end) to discourse-share (right end).
          Positive log-gap means discourse out-talks hiring; negative means hiring out-mentions discourse.
        </desc>

        {/* Axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={scaleX(t)}
              x2={scaleX(t)}
              y1={PAD.top - 8}
              y2={H - PAD.bottom + 4}
              stroke="var(--color-rule)"
              strokeWidth={t === 0 ? 1 : 0.5}
              strokeDasharray={t === 0 ? "none" : "2 2"}
            />
            <text
              x={scaleX(t)}
              y={H - PAD.bottom + 18}
              fontSize={10}
              textAnchor="middle"
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {t === 0 ? "equal" : (t > 0 ? "+" : "") + t + "×"}
            </text>
          </g>
        ))}

        {/* Rows */}
        {rows.map((r, i) => {
          const y = PAD.top + i * ROW_HEIGHT + ROW_HEIGHT / 2;
          const xStart = Math.min(zeroX, scaleX(r.logGap));
          const xEnd = Math.max(zeroX, scaleX(r.logGap));
          const color = CATEGORY_COLORS[r.category] ?? "var(--color-ink)";
          return (
            <g key={r.slug}>
              <text
                x={PAD.left - 10}
                y={y + 4}
                fontSize={11}
                textAnchor="end"
                fill="var(--color-ink)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {r.label}
              </text>
              <line
                x1={xStart}
                x2={xEnd}
                y1={y}
                y2={y}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle cx={scaleX(r.logGap)} cy={y} r={4} fill={color} />
              <circle cx={zeroX} cy={y} r={2} fill="var(--color-ink-muted)" opacity={0.5} />
              <text
                x={scaleX(r.logGap) + (r.logGap >= 0 ? 8 : -8)}
                y={y + 4}
                fontSize={10}
                textAnchor={r.logGap >= 0 ? "start" : "end"}
                fill="var(--color-ink-muted)"
                style={{ fontFeatureSettings: "'onum'" }}
              >
                {(r.logGap >= 0 ? "+" : "") + r.logGap.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={PAD.left + chartW * 0.25}
          y={PAD.top - 20}
          fontSize={10}
          textAnchor="middle"
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          hiring out-mentions
        </text>
        <text
          x={PAD.left + chartW * 0.75}
          y={PAD.top - 20}
          fontSize={10}
          textAnchor="middle"
          fill="var(--color-ink-muted)"
          style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}
        >
          discourse out-talks
        </text>
      </svg>
      <figcaption>
        {rows.length} topics, ranked by log₂ of the ratio between discourse mentions and job-listing mentions.
        Anything above +1 appears twice as often in posts as in JDs. Data: 52-week window,
        Design Drift snapshot {new Date(data.snapshotDate).toLocaleDateString()}.
      </figcaption>
    </figure>
  );
}
