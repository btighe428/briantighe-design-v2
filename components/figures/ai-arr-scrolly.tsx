'use client';

// Interactive variant of the AI ARR trajectory chart.
// Accepts a `focus` prop naming which tool to highlight; other tools fade.
// Designed to be driven by a ScrollyBlock as the reader scrolls through
// the Intelligence Era section of the Collapsing Abstraction Layer essay.

import { scaleLinear, scaleLog } from 'd3-scale';

type Point = { t: number; arr: number };
type Tool = {
  id: string;
  name: string;
  color: string;
  points: Point[];
};

const tools: Tool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    color: 'var(--color-ink)',
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
    id: 'replit',
    name: 'Replit Agent',
    color: 'var(--color-accent)',
    points: [
      { t: 2024.67, arr: 0.5e6 },
      { t: 2025.08, arr: 30e6 },
      { t: 2025.5, arr: 100e6 },
      { t: 2026.0, arr: 180e6 },
    ],
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    color: 'var(--color-ink-muted)',
    points: [
      { t: 2024.75, arr: 0.1e6 },
      { t: 2024.83, arr: 4e6 },
      { t: 2024.92, arr: 20e6 },
      { t: 2025.21, arr: 40e6 },
      { t: 2026.0, arr: 80e6 },
    ],
  },
  {
    id: 'lovable',
    name: 'Lovable',
    color: '#9b6a3e',
    points: [
      { t: 2024.92, arr: 0.5e6 },
      { t: 2025.75, arr: 100e6 },
      { t: 2025.92, arr: 200e6 },
    ],
  },
];

const W = 760;
const H = 360;
const PAD = { t: 40, r: 150, b: 50, l: 80 };

function formatUSD(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(v >= 10e9 ? 0 : 1)}B`;
  if (v >= 1e6) return `$${Math.round(v / 1e6)}M`;
  return `$${Math.round(v / 1e3)}K`;
}

function formatDateFrac(frac: number) {
  const year = Math.floor(frac);
  const monthIdx = Math.round((frac - year) * 12);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[Math.min(11, Math.max(0, monthIdx))]} ${year}`;
}

export function AiArrScrolly({ focus }: { focus?: string | null }) {
  const x = scaleLinear().domain([2023, 2026.5]).range([PAD.l, W - PAD.r]);
  const y = scaleLog()
    .domain([3e5, 3e9])
    .range([H - PAD.b, PAD.t]);

  const yTicks = [1e6, 1e7, 1e8, 1e9];

  const isFocused = (id: string) => !focus || focus === id;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="ARR trajectories for Cursor, Replit Agent, Bolt.new, and Lovable from 2023 through early 2026. Log scale. Hover data points for exact values."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* y gridlines */}
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

        {/* x axis */}
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

        {/* Lines and points */}
        {tools.map((tool) => {
          const last = tool.points[tool.points.length - 1];
          const focused = isFocused(tool.id);
          return (
            <g
              key={tool.id}
              style={{
                opacity: focused ? 1 : 0.18,
                transition: 'opacity 280ms ease',
              }}
            >
              <polyline
                points={tool.points
                  .map((p) => `${x(p.t)},${y(p.arr)}`)
                  .join(' ')}
                fill="none"
                stroke={tool.color}
                strokeWidth={focused && focus === tool.id ? 3.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke-width 280ms ease' }}
              />
              {tool.points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={x(p.t)}
                    cy={y(p.arr)}
                    r={focused && focus === tool.id ? 6 : 4}
                    fill={tool.color}
                    style={{ transition: 'r 280ms ease' }}
                  >
                    <title>
                      {`${tool.name} — ${formatUSD(p.arr)} (${formatDateFrac(p.t)})`}
                    </title>
                  </circle>
                </g>
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
        log scale. Scroll the prose to focus each line in turn; hover any
        point for the exact month and ARR.
      </figcaption>
    </figure>
  );
}
