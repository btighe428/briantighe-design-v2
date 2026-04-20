// ARR trajectories for the Intelligence-Era AI coding tools,
// 2023 Q1 → 2026 Q2. Shows the acceleration that the prose lists
// as a sequence of numbers.

import { scaleLinear, scaleLog } from 'd3-scale';

type Point = { t: number; arr: number };
type Tool = {
  name: string;
  color: string;
  points: Point[];
  launch: number;
};

const tools: Tool[] = [
  {
    name: 'Cursor',
    color: 'var(--color-ink)',
    launch: 2023.17, // March 2023
    points: [
      { t: 2023.17, arr: 0.1e6 },
      { t: 2024.5, arr: 10e6 },
      { t: 2025.08, arr: 100e6 },
      { t: 2025.5, arr: 500e6 },
      { t: 2025.92, arr: 1e9 },
      { t: 2026.25, arr: 2e9 },
    ],
  },
  {
    name: 'Replit Agent',
    color: 'var(--color-accent)',
    launch: 2024.67, // September 2024
    points: [
      { t: 2024.67, arr: 0.5e6 },
      { t: 2025.08, arr: 30e6 },
      { t: 2025.5, arr: 100e6 },
      { t: 2026.0, arr: 180e6 },
    ],
  },
  {
    name: 'Bolt.new',
    color: 'var(--color-ink-muted)',
    launch: 2024.75, // October 2024
    points: [
      { t: 2024.75, arr: 0.1e6 },
      { t: 2024.83, arr: 4e6 },
      { t: 2024.92, arr: 20e6 },
      { t: 2025.21, arr: 40e6 },
      { t: 2026.0, arr: 80e6 },
    ],
  },
  {
    name: 'Lovable',
    color: '#9b6a3e',
    launch: 2024.92, // December 2024
    points: [
      { t: 2024.92, arr: 0.5e6 },
      { t: 2025.75, arr: 100e6 },
      { t: 2025.92, arr: 200e6 },
    ],
  },
];

const W = 1100;
const H = 480;
const PAD = { t: 40, r: 150, b: 60, l: 80 };

function formatUSD(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(v >= 10e9 ? 0 : 1)}B`;
  if (v >= 1e6) return `$${Math.round(v / 1e6)}M`;
  return `$${Math.round(v / 1e3)}K`;
}

export function AiArr() {
  const x = scaleLinear().domain([2023, 2026.5]).range([PAD.l, W - PAD.r]);
  const y = scaleLog()
    .domain([3e5, 3e9])
    .range([H - PAD.b, PAD.t]);

  const yTicks = [1e6, 1e7, 1e8, 1e9];

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="ARR trajectories for Cursor, Replit Agent, Bolt.new, and Lovable, 2023 through early 2026. Log scale."
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

        {/* x-axis */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule)"
        />
        {[2023, 2024, 2025, 2026].map((yr) => (
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

        {/* Tool lines */}
        {tools.map((tool) => {
          const last = tool.points[tool.points.length - 1];
          return (
            <g key={tool.name}>
              <polyline
                points={tool.points
                  .map((p) => `${x(p.t)},${y(p.arr)}`)
                  .join(' ')}
                fill="none"
                stroke={tool.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {tool.points.map((p, i) => (
                <circle
                  key={i}
                  cx={x(p.t)}
                  cy={y(p.arr)}
                  r={4}
                  fill={tool.color}
                />
              ))}
              <text
                x={x(last.t) + 10}
                y={y(last.arr) + 5}
                fontSize={15}
                fill={tool.color}
                style={{ fontStyle: 'italic', fontWeight: 500 }}
              >
                {tool.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Annualized revenue, Cursor and three prompt-to-app peers, 2023–2026,
        log scale. Cursor reached $100M ARR in January 2025 — the fastest SaaS
        milestone to that point in software history — and is approximately
        2000× the Photoshop Creative Cloud upgrade cycle's revenue velocity.
        None of the four lines predates 2023.
      </figcaption>
    </figure>
  );
}
