'use client';

import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  categories,
  eras,
  events,
  present,
  tools,
  type Tool,
} from './data';

const WIDTH = 1200;
const LABEL_WIDTH = 170;
const RIGHT_PAD = 40;
const ROW_HEIGHT = 22;
const HEADER = 90;
const FOOTER = 80;

function ordered(): Tool[] {
  const orderOf = new Map(categories.map((c) => [c.id, c.order]));
  return [...tools].sort((a, b) => {
    const oa = orderOf.get(a.category) ?? 99;
    const ob = orderOf.get(b.category) ?? 99;
    if (oa !== ob) return oa - ob;
    return a.start - b.start;
  });
}

export default function CollapsingAbstractionChart() {
  const [hovered, setHovered] = useState<Tool | null>(null);

  const sorted = useMemo(ordered, []);
  const height = HEADER + sorted.length * ROW_HEIGHT + FOOTER;

  const x = useMemo(
    () =>
      scaleLinear()
        .domain([1995, 2027])
        .range([LABEL_WIDTH, WIDTH - RIGHT_PAD]),
    [],
  );

  const ticks = [1995, 2000, 2005, 2010, 2015, 2020, 2025];

  const catRows = useMemo(() => {
    const map = new Map<string, { first: number; last: number }>();
    sorted.forEach((t, i) => {
      const cur = map.get(t.category);
      if (!cur) map.set(t.category, { first: i, last: i });
      else map.set(t.category, { first: cur.first, last: i });
    });
    return map;
  }, [sorted]);

  return (
    <figure className="data-story">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Timeline of digital prototyping tools, 1995 to 2026, grouped by category."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Era backgrounds */}
        {eras.map((era) => (
          <rect
            key={era.name}
            x={x(era.start)}
            y={HEADER - 20}
            width={x(era.end) - x(era.start)}
            height={sorted.length * ROW_HEIGHT + 28}
            fill="var(--color-paper-dim)"
            fillOpacity={0.55}
          />
        ))}

        {/* Era labels */}
        {eras.map((era) => (
          <text
            key={`era-label-${era.name}`}
            x={(x(era.start) + x(era.end)) / 2}
            y={HEADER - 42}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-ink-muted)"
            style={{
              fontVariantCaps: 'all-small-caps',
              letterSpacing: '0.08em',
              fontFeatureSettings: "'smcp'",
            }}
          >
            {era.name}
          </text>
        ))}

        {/* Axis line */}
        <line
          x1={LABEL_WIDTH}
          x2={WIDTH - RIGHT_PAD}
          y1={HEADER - 20}
          y2={HEADER - 20}
          stroke="var(--color-rule)"
          strokeWidth={1}
        />

        {/* Axis ticks */}
        {ticks.map((year) => (
          <g key={`tick-${year}`}>
            <line
              x1={x(year)}
              x2={x(year)}
              y1={HEADER - 24}
              y2={HEADER - 20}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={x(year)}
              y={HEADER - 28}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {year}
            </text>
          </g>
        ))}

        {/* Event lines */}
        {events.map((ev) => (
          <line
            key={`ev-${ev.year}-${ev.label}`}
            x1={x(ev.year)}
            x2={x(ev.year)}
            y1={HEADER - 20}
            y2={HEADER + sorted.length * ROW_HEIGHT + 8}
            stroke="var(--color-accent)"
            strokeOpacity={0.35}
            strokeWidth={0.75}
            strokeDasharray="2 3"
          />
        ))}

        {/* Category labels */}
        {categories.map((cat) => {
          const rows = catRows.get(cat.id);
          if (!rows) return null;
          const midRow = (rows.first + rows.last) / 2;
          const yCenter = HEADER + midRow * ROW_HEIGHT + ROW_HEIGHT / 2 + 4;
          return (
            <text
              key={`cat-${cat.id}`}
              x={LABEL_WIDTH - 14}
              y={yCenter}
              textAnchor="end"
              fontSize={11}
              fill="var(--color-ink-muted)"
              style={{
                fontVariantCaps: 'all-small-caps',
                letterSpacing: '0.08em',
                fontFeatureSettings: "'smcp'",
              }}
            >
              {cat.label}
            </text>
          );
        })}

        {/* Tool bars */}
        {sorted.map((tool, i) => {
          const y = HEADER + i * ROW_HEIGHT;
          const dead = !!tool.died;
          const barX = x(tool.start);
          const barW = Math.max(x(tool.end) - x(tool.start), 2);
          const isHovered = hovered?.name === tool.name;
          return (
            <g
              key={tool.name}
              onMouseEnter={() => setHovered(tool)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            >
              {/* Row hit area (for easier hovering) */}
              <rect
                x={LABEL_WIDTH}
                y={y}
                width={WIDTH - RIGHT_PAD - LABEL_WIDTH}
                height={ROW_HEIGHT}
                fill="transparent"
              />
              <rect
                x={barX}
                y={y + 3}
                width={barW}
                height={ROW_HEIGHT - 6}
                fill={dead ? 'var(--color-paper-dim)' : 'var(--color-ink)'}
                fillOpacity={isHovered ? (dead ? 0.8 : 0.95) : dead ? 0.55 : 0.8}
                stroke={dead ? 'var(--color-accent)' : 'var(--color-ink)'}
                strokeWidth={dead ? 1 : 0}
                strokeDasharray={dead ? '3 2' : undefined}
              />
              <text
                x={barX + 6}
                y={y + ROW_HEIGHT / 2 + 4}
                fontSize={11}
                fill={dead ? 'var(--color-ink)' : 'var(--color-paper)'}
                pointerEvents="none"
              >
                {tool.name}
              </text>
              {dead && (
                <text
                  x={x(tool.end) - 2}
                  y={y + ROW_HEIGHT / 2 + 5}
                  textAnchor="end"
                  fontSize={15}
                  fill="var(--color-accent)"
                  pointerEvents="none"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  ×
                </text>
              )}
            </g>
          );
        })}

        {/* Hovered tooltip at bottom */}
        {hovered && (
          <g>
            <text
              x={LABEL_WIDTH}
              y={HEADER + sorted.length * ROW_HEIGHT + 30}
              fontSize={12}
              fill="var(--color-ink)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              <tspan style={{ fontStyle: 'italic' }}>{hovered.name}</tspan>
              <tspan dx="6">
                {Math.floor(hovered.start)}
                –
                {hovered.end >= present
                  ? 'present'
                  : Math.floor(hovered.end)}
              </tspan>
              {hovered.died && (
                <tspan
                  dx="10"
                  fill="var(--color-accent)"
                  style={{
                    fontVariantCaps: 'all-small-caps',
                    fontFeatureSettings: "'smcp'",
                    letterSpacing: '0.05em',
                  }}
                >
                  died — {hovered.died}
                </tspan>
              )}
              {!hovered.died && hovered.note && (
                <tspan
                  dx="10"
                  fill="var(--color-ink-muted)"
                  style={{ fontStyle: 'italic' }}
                >
                  {hovered.note}
                </tspan>
              )}
            </text>
          </g>
        )}
      </svg>

      <figcaption>
        Thirty-one years of digital prototyping tools. Each bar marks a tool's
        active life. Red dashed bars with a cross are tools that died. Era
        shading shows the four-epoch periodization from{' '}
        <em>The Collapsing Abstraction Layer</em>. Hover a bar for details.
        The tight cluster at the bottom-right is the Intelligence Era — the
        collapse itself.
      </figcaption>

      <ul className="event-list">
        {events.map((ev) => (
          <li key={`evl-${ev.year}-${ev.label}`}>
            <span className="event-year">{Math.floor(ev.year)}</span>{' '}
            <span className="event-label">{ev.label}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
