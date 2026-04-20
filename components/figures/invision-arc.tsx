// InVision: rise to Series F peak, then collapse.
// Small arc with key events. Companion to the autopsy table, not
// a replacement — the table carries the prose-level detail; the
// arc carries the shape.

import { scaleLinear } from 'd3-scale';

type Point = { t: number; y: number; label?: string; dead?: boolean };

// y is a synthesized "company vitality" index on 0–100 for visual
// legibility — it is not a single metric but a qualitative blend
// of valuation, headcount, and user growth. The specific numbers
// each event corresponds to are in the adjacent prose.
const points: Point[] = [
  { t: 2011, y: 3, label: 'Founded' },
  { t: 2015, y: 28 },
  { t: 2016.5, y: 54, label: '$55M Series D, 2M users' },
  { t: 2017.8, y: 72, label: '$100M Series E' },
  { t: 2018.95, y: 95, label: '$1.9B Series F' },
  { t: 2020, y: 86, label: 'Peak ~1,200 employees' },
  { t: 2022, y: 52, label: 'Layoffs, CEO transition' },
  { t: 2023.9, y: 22, label: 'Freehand sold to Miro' },
  { t: 2024.99, y: 0, label: 'Shutdown', dead: true },
];

const W = 1100;
const H = 400;
const PAD = { t: 32, r: 48, b: 48, l: 48 };

export function InvisionArc() {
  const x = scaleLinear().domain([2011, 2025]).range([PAD.l, W - PAD.r]);
  const y = scaleLinear().domain([0, 100]).range([H - PAD.b, PAD.t]);

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t)},${y(p.y)}`)
    .join(' ');

  const area = `${path} L${x(points[points.length - 1].t)},${y(0)} L${x(points[0].t)},${y(0)} Z`;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="InVision from 2011 founding through 2024 shutdown. Vitality peaks at 2018 Series F then declines steadily to shutdown."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* baseline */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={y(0)}
          y2={y(0)}
          stroke="var(--color-rule)"
        />

        {/* area fill */}
        <path d={area} fill="var(--color-ink)" fillOpacity={0.08} />

        {/* arc */}
        <path
          d={path}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(p.t)}
              cy={y(p.y)}
              r={p.dead ? 7 : 5}
              fill={p.dead ? 'var(--color-accent)' : 'var(--color-ink)'}
              stroke="var(--color-paper)"
              strokeWidth={2}
            />
            {p.dead && (
              <text
                x={x(p.t) + 14}
                y={y(p.y) + 6}
                fontSize={22}
                fill="var(--color-accent)"
              >
                ×
              </text>
            )}
          </g>
        ))}

        {/* year labels */}
        {[2011, 2015, 2018, 2021, 2024].map((yr) => (
          <text
            key={yr}
            x={x(yr)}
            y={H - PAD.b + 24}
            textAnchor="middle"
            fontSize={14}
            fill="var(--color-ink-muted)"
            style={{ fontFeatureSettings: "'onum'" }}
          >
            {yr}
          </text>
        ))}

        {/* peak label */}
        <text
          x={x(2018.95)}
          y={y(95) - 16}
          textAnchor="middle"
          fontSize={15}
          fill="var(--color-ink)"
          style={{
            fontVariantCaps: 'all-small-caps',
            fontFeatureSettings: "'smcp', 'onum'",
            letterSpacing: '0.06em',
          }}
        >
          $1.9B peak, 2018
        </text>

        {/* shutdown label */}
        <text
          x={x(2024.99) - 14}
          y={y(0) - 12}
          textAnchor="end"
          fontSize={15}
          fill="var(--color-accent)"
          style={{
            fontVariantCaps: 'all-small-caps',
            fontFeatureSettings: "'smcp', 'onum'",
            letterSpacing: '0.06em',
          }}
        >
          shutdown, Dec 2024
        </text>
      </svg>
      <figcaption>
        InVision's vitality arc, 2011–2024. The rise took seven years; the
        collapse took six. Lifetime capital consumed, approximately $356M. The
        precise numbers and events are tabulated below.
      </figcaption>
    </figure>
  );
}
