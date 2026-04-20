// Boehm cost-of-change curve. Defect correction cost rises
// log-linearly across the project lifecycle. Source: Boehm 1981
// Software Engineering Economics; Boehm & Basili 2001 IEEE Computer.

import { scaleLinear, scaleLog } from 'd3-scale';

type Phase = { label: string; small: number; large: number; x: number };

const phases: Phase[] = [
  { label: 'Requirements', small: 1, large: 1, x: 0 },
  { label: 'Design', small: 1.5, large: 5, x: 1 },
  { label: 'Code', small: 2.5, large: 10, x: 2 },
  { label: 'Test', small: 3.5, large: 25, x: 3 },
  { label: 'Deployment', small: 4.5, large: 100, x: 4 },
];

const W = 900;
const H = 380;
const PAD = { t: 40, r: 140, b: 60, l: 80 };

function formatX(v: number) {
  if (v >= 1) return `${v}×`;
  return `${v}×`;
}

export function BoehmCostCurve() {
  const x = scaleLinear().domain([0, 4]).range([PAD.l, W - PAD.r]);
  const y = scaleLog()
    .domain([0.8, 150])
    .range([H - PAD.b, PAD.t]);

  const yTicks = [1, 5, 10, 50, 100];

  const smallPoints = phases
    .map((p) => `${x(p.x)},${y(p.small)}`)
    .join(' ');
  const largePoints = phases
    .map((p) => `${x(p.x)},${y(p.large)}`)
    .join(' ');

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Boehm's cost-of-change curve: defect correction cost rises from 1x at requirements to 100x at deployment on large projects, but only 4-5x on small agile projects."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-rule)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
            />
            <text
              x={PAD.l - 12}
              y={y(v) + 5}
              textAnchor="end"
              fontSize={13}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {formatX(v)}
            </text>
          </g>
        ))}

        {/* Large-project line */}
        <polyline
          points={largePoints}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {phases.map((p) => (
          <circle
            key={`l-${p.x}`}
            cx={x(p.x)}
            cy={y(p.large)}
            r={5}
            fill="var(--color-accent)"
          />
        ))}
        <text
          x={x(phases[phases.length - 1].x) + 12}
          y={y(phases[phases.length - 1].large) + 5}
          fontSize={14}
          fill="var(--color-accent)"
          style={{ fontStyle: 'italic', fontWeight: 500 }}
        >
          Large / waterfall
        </text>

        {/* Small-project line */}
        <polyline
          points={smallPoints}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 4"
        />
        {phases.map((p) => (
          <circle
            key={`s-${p.x}`}
            cx={x(p.x)}
            cy={y(p.small)}
            r={4}
            fill="var(--color-ink)"
          />
        ))}
        <text
          x={x(phases[phases.length - 1].x) + 12}
          y={y(phases[phases.length - 1].small) + 5}
          fontSize={14}
          fill="var(--color-ink)"
          style={{ fontStyle: 'italic' }}
        >
          Small / agile
        </text>

        {/* X-axis phase labels */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule)"
        />
        {phases.map((p) => (
          <g key={`ax-${p.x}`}>
            <line
              x1={x(p.x)}
              x2={x(p.x)}
              y1={H - PAD.b}
              y2={H - PAD.b + 6}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={x(p.x)}
              y={H - PAD.b + 24}
              textAnchor="middle"
              fontSize={13}
              fill="var(--color-ink-muted)"
              style={{
                fontVariantCaps: 'all-small-caps',
                letterSpacing: '0.05em',
                fontFeatureSettings: "'smcp'",
              }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        Defect-correction cost across the project lifecycle, log scale. The
        large-waterfall curve (Boehm 1981) rises one hundred-fold from
        requirements to deployment; the small-agile curve (Boehm & Basili 2001)
        flattens the ratio to roughly four-to-one. The senior designer's
        leverage lives in knowing which phase a team is actually in.
      </figcaption>
    </figure>
  );
}
