// Figma's post-money valuation across Series A → E, 2015–2021.
// Log scale makes the compounding legible; the last bar is ~200× the first.

import { scaleLog, scaleLinear } from 'd3-scale';

type Round = {
  label: string;
  date: number; // decimal year
  val: number; // post-money USD
  raised: number; // USD raised this round
  lead: string;
};

const rounds: Round[] = [
  { label: 'A', date: 2015, val: 48e6, raised: 14e6, lead: 'Greylock' },
  { label: 'B', date: 2018, val: 115e6, raised: 25e6, lead: 'Kleiner' },
  { label: 'C', date: 2019.08, val: 440e6, raised: 40e6, lead: 'Sequoia' },
  { label: 'D', date: 2020.33, val: 2e9, raised: 50e6, lead: 'a16z' },
  { label: 'E', date: 2021.5, val: 10e9, raised: 200e6, lead: 'Durable' },
];

const W = 1100;
const H = 420;
const PAD = { t: 40, r: 40, b: 60, l: 80 };

function formatUSD(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(v >= 10e9 ? 0 : 1)}B`;
  return `$${Math.round(v / 1e6)}M`;
}

export function FigmaValuation() {
  const x = scaleLinear().domain([2014.5, 2022]).range([PAD.l, W - PAD.r]);
  const y = scaleLog()
    .domain([3e7, 1.5e10])
    .range([H - PAD.b, PAD.t]);

  const yTicks = [1e8, 1e9, 1e10];

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Figma's post-money valuation from Series A 2015 to Series E 2021."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* y-axis gridlines */}
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
              fontSize={14}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {formatUSD(v)}
            </text>
          </g>
        ))}

        {/* connecting line between rounds */}
        <polyline
          points={rounds.map((r) => `${x(r.date)},${y(r.val)}`).join(' ')}
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth={1}
          strokeDasharray="2 3"
        />

        {/* round markers */}
        {rounds.map((r) => (
          <g key={r.label}>
            <circle
              cx={x(r.date)}
              cy={y(r.val)}
              r={8}
              fill="var(--color-ink)"
              stroke="var(--color-paper)"
              strokeWidth={3}
            />
            <text
              x={x(r.date)}
              y={y(r.val) - 18}
              textAnchor="middle"
              fontSize={15}
              fill="var(--color-ink)"
              style={{
                fontVariantCaps: 'all-small-caps',
                fontFeatureSettings: "'smcp'",
                letterSpacing: '0.06em',
              }}
            >
              Series {r.label}
            </text>
            <text
              x={x(r.date)}
              y={y(r.val) + 30}
              textAnchor="middle"
              fontSize={16}
              fill="var(--color-accent)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {formatUSD(r.val)}
            </text>
          </g>
        ))}

        {/* x-axis */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule)"
        />
        {[2015, 2017, 2019, 2021].map((yr) => (
          <g key={yr}>
            <line
              x1={x(yr)}
              x2={x(yr)}
              y1={H - PAD.b}
              y2={H - PAD.b + 6}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={x(yr)}
              y={H - PAD.b + 26}
              textAnchor="middle"
              fontSize={14}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {yr}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        Figma's post-money valuation on a log scale. Series E (June 2021) is
        roughly 208× the Series A (2015). The Adobe offer a year later — $20
        billion — was a 2× step above this trajectory's terminal velocity, and
        still could not survive regulatory review.
      </figcaption>
    </figure>
  );
}
