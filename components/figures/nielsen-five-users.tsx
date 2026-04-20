// Nielsen's 5-user curve from the INTERCHI '93 model: P = 1 - (1 - L)^n.
// Faulkner 2003 showed that random subsets of 5 detect 55-99% of problems;
// the band shows that variance.

import { scaleLinear } from 'd3-scale';

const W = 900;
const H = 380;
const PAD = { t: 30, r: 140, b: 54, l: 70 };

const L = 0.31; // Nielsen's empirical probability per user per problem

function nielsenCoverage(n: number) {
  return 1 - Math.pow(1 - L, n);
}

const points: { n: number; p: number }[] = Array.from({ length: 21 }, (_, i) => ({
  n: i,
  p: nielsenCoverage(i),
}));

// Faulkner 2003 floor estimates for specific N:
const faulknerFloor: Record<number, number> = {
  5: 0.55,
  10: 0.8,
  15: 0.9,
  20: 0.95,
};

export function NielsenFiveUsers() {
  const x = scaleLinear().domain([0, 20]).range([PAD.l, W - PAD.r]);
  const y = scaleLinear().domain([0, 1]).range([H - PAD.b, PAD.t]);

  const curve = points.map((p) => `${x(p.n)},${y(p.p)}`).join(' ');

  const floorEntries = Object.entries(faulknerFloor).map(([n, p]) => ({
    n: Number(n),
    p,
  }));
  const floorLine = floorEntries.map((p) => `${x(p.n)},${y(p.p)}`).join(' ');

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Nielsen's 5-user coverage curve compared with Faulkner's 2003 empirical floor. The canonical curve claims 85% at 5 users; Faulkner's 60-user study showed the actual floor at 55% with wide variance."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* y-axis */}
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
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
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}

        {/* Nielsen curve */}
        <polyline
          points={curve}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight at n=5 */}
        <circle
          cx={x(5)}
          cy={y(nielsenCoverage(5))}
          r={7}
          fill="var(--color-ink)"
        />
        <line
          x1={x(5)}
          x2={x(5)}
          y1={y(nielsenCoverage(5))}
          y2={H - PAD.b}
          stroke="var(--color-ink-muted)"
          strokeWidth={0.75}
          strokeDasharray="2 3"
        />
        <text
          x={x(5)}
          y={y(nielsenCoverage(5)) - 14}
          textAnchor="middle"
          fontSize={14}
          fill="var(--color-ink)"
          style={{
            fontVariantCaps: 'all-small-caps',
            fontFeatureSettings: "'smcp', 'onum'",
            letterSpacing: '0.06em',
          }}
        >
          n=5, 85% claim
        </text>

        {/* Faulkner floor */}
        <polyline
          points={floorLine}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {floorEntries.map((p) => (
          <circle
            key={`f-${p.n}`}
            cx={x(p.n)}
            cy={y(p.p)}
            r={4}
            fill="var(--color-accent)"
          />
        ))}
        <text
          x={x(20) + 12}
          y={y(0.95) + 4}
          fontSize={14}
          fill="var(--color-accent)"
          style={{ fontStyle: 'italic', fontWeight: 500 }}
        >
          Faulkner 2003
        </text>
        <text
          x={x(20) + 12}
          y={y(0.95) + 22}
          fontSize={12}
          fill="var(--color-accent)"
          fillOpacity={0.8}
          style={{ fontStyle: 'italic' }}
        >
          empirical floor
        </text>
        <text
          x={x(20) + 12}
          y={y(nielsenCoverage(20)) + 4}
          fontSize={14}
          fill="var(--color-ink)"
          style={{ fontStyle: 'italic' }}
        >
          Nielsen 1993
        </text>

        {/* x-axis */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule)"
        />
        {[0, 5, 10, 15, 20].map((n) => (
          <g key={`ax-${n}`}>
            <line
              x1={x(n)}
              x2={x(n)}
              y1={H - PAD.b}
              y2={H - PAD.b + 6}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={x(n)}
              y={H - PAD.b + 24}
              textAnchor="middle"
              fontSize={13}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {n}
            </text>
          </g>
        ))}
        <text
          x={(x(0) + x(20)) / 2}
          y={H - 14}
          textAnchor="middle"
          fontSize={12}
          fill="var(--color-ink-muted)"
          style={{
            fontVariantCaps: 'all-small-caps',
            letterSpacing: '0.08em',
            fontFeatureSettings: "'smcp'",
          }}
        >
          Users tested
        </text>
      </svg>
      <figcaption>
        Nielsen's 1993 coverage curve (solid, <em>P = 1 − (1 − L)<sup>n</sup></em>,
        L = 0.31) predicts 85% problem coverage at five users. Faulkner's 2003
        empirical floor (dashed, N = 60 experiment) shows that random subsets
        of five users detect anywhere from 55% to 99% — the variance being the
        point. Ten users push the empirical floor to 80%, twenty to 95%.
      </figcaption>
    </figure>
  );
}
