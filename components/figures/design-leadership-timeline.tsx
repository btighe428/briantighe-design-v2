// Design leadership emergence, 1964-2024.

import { scaleLinear } from 'd3-scale';

const W = 900;
const H = 300;
const PAD = { t: 30, r: 40, b: 70, l: 40 };

type Event = { year: number; label: string; side: 'top' | 'bottom' };

const events: Event[] = [
  { year: 1964, label: 'RSA Design Mgmt medal', side: 'top' },
  { year: 1975, label: 'DMI founded', side: 'bottom' },
  { year: 1987, label: 'Apple HIG 1st ed.', side: 'top' },
  { year: 1992, label: 'Jony Ive joins Apple', side: 'bottom' },
  { year: 2010, label: '3M first CDO (Porcini)', side: 'top' },
  { year: 2012, label: 'IBM Design Program (Gilbert)', side: 'bottom' },
  { year: 2015, label: 'Ive → Apple CDO', side: 'top' },
  { year: 2018, label: 'InVision Design Leadership Forum', side: 'bottom' },
  { year: 2021, label: 'IBM: 3,000 designers', side: 'top' },
  { year: 2024, label: 'InVision shutdown', side: 'bottom' },
];

export function DesignLeadershipTimeline() {
  const x = scaleLinear()
    .domain([1964, 2026])
    .range([PAD.l, W - PAD.r]);
  const axisY = H / 2;

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Timeline of design leadership emergence from 1964 to 2024, annotated with ten milestones."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Axis line */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={axisY}
          y2={axisY}
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />

        {/* Decade ticks */}
        {[1970, 1980, 1990, 2000, 2010, 2020].map((yr) => (
          <g key={`dec-${yr}`}>
            <line
              x1={x(yr)}
              x2={x(yr)}
              y1={axisY - 5}
              y2={axisY + 5}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={x(yr)}
              y={axisY + 20}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {yr}
            </text>
          </g>
        ))}

        {/* Events */}
        {events.map((ev, i) => {
          const top = ev.side === 'top';
          const lineY = top ? axisY - 10 : axisY + 10;
          const endY = top ? 40 + (i % 3) * 20 : H - 50 - (i % 3) * 20;
          const labelY = top ? endY - 8 : endY + 14;
          return (
            <g key={ev.year + ev.label}>
              <circle
                cx={x(ev.year)}
                cy={axisY}
                r={4}
                fill="var(--color-accent)"
                stroke="var(--color-paper)"
                strokeWidth={1.5}
              />
              <line
                x1={x(ev.year)}
                x2={x(ev.year)}
                y1={lineY}
                y2={endY}
                stroke="var(--color-rule)"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <text
                x={x(ev.year)}
                y={labelY}
                textAnchor="middle"
                fontSize={12}
                fill="var(--color-ink)"
              >
                <tspan
                  fill="var(--color-accent)"
                  style={{
                    fontVariantCaps: 'all-small-caps',
                    fontFeatureSettings: "'smcp', 'onum'",
                    letterSpacing: '0.04em',
                  }}
                >
                  {ev.year}
                </tspan>
                <tspan dx="4" fill="var(--color-ink)">
                  {ev.label}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Design leadership as a formal discipline, 1964 to 2024. Ten milestones
        trace the arc from Royal Society of Arts medals through the
        Porcini-Ive-Gilbert CDO era to the collapse of the InVision
        generation's tooling.
      </figcaption>
    </figure>
  );
}
