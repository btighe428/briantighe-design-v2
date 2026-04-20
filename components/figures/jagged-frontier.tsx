// Dell'Acqua et al. 2023 — "Navigating the Jagged Technological Frontier"
// HBS Working Paper 24-013. BCG consultants using GPT-4 on inside-frontier
// vs. outside-frontier tasks. Shows the sharp performance discontinuity.

const W = 900;
const H = 380;
const PAD = { t: 50, r: 60, b: 70, l: 90 };

const GROUPS = [
  {
    label: 'Non-AI control',
    inside: 0,
    outside: 0,
  },
  {
    label: 'AI-assisted',
    inside: 40,
    outside: -19,
  },
];

export function JaggedFrontier() {
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const groupW = innerW / GROUPS.length;
  const barW = 50;
  const gap = 14;
  const zeroY = PAD.t + innerH * (40 / (40 + 25));

  function y(v: number) {
    if (v >= 0) return zeroY - (v / 40) * (zeroY - PAD.t);
    return zeroY + (Math.abs(v) / 25) * (H - PAD.b - zeroY);
  }

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Dell'Acqua et al. 2023 BCG jagged frontier study: AI-assisted consultants gained 40% inside the AI frontier and lost 19 percentage points outside it, compared to non-AI controls at zero."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* y-axis gridlines */}
        {[-20, -10, 0, 10, 20, 30, 40].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-rule)"
              strokeWidth={v === 0 ? 1.25 : 0.5}
              strokeDasharray={v === 0 ? undefined : '2 3'}
            />
            <text
              x={PAD.l - 12}
              y={y(v) + 5}
              textAnchor="end"
              fontSize={13}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {v > 0 ? `+${v}` : v}
              {v === 0 ? '%' : '%'}
            </text>
          </g>
        ))}

        {/* Baseline axis label */}
        <text
          x={PAD.l - 56}
          y={zeroY + 5}
          fontSize={11}
          fill="var(--color-ink-muted)"
          textAnchor="start"
          style={{
            fontVariantCaps: 'all-small-caps',
            fontFeatureSettings: "'smcp'",
            letterSpacing: '0.05em',
          }}
        >
          baseline
        </text>

        {/* Bars per group */}
        {GROUPS.map((g, i) => {
          const cx = PAD.l + (i + 0.5) * groupW;
          const insideX = cx - barW - gap / 2;
          const outsideX = cx + gap / 2;
          return (
            <g key={g.label}>
              {/* Inside frontier bar */}
              <rect
                x={insideX}
                y={g.inside >= 0 ? y(g.inside) : zeroY}
                width={barW}
                height={Math.abs(y(g.inside) - zeroY)}
                fill="var(--color-ink)"
                fillOpacity={0.85}
              />
              {g.inside !== 0 && (
                <text
                  x={insideX + barW / 2}
                  y={y(g.inside) - 8}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill="var(--color-ink)"
                >
                  +{g.inside}%
                </text>
              )}

              {/* Outside frontier bar */}
              <rect
                x={outsideX}
                y={g.outside >= 0 ? y(g.outside) : zeroY}
                width={barW}
                height={Math.abs(y(g.outside) - zeroY)}
                fill="var(--color-accent)"
                fillOpacity={0.85}
              />
              {g.outside !== 0 && (
                <text
                  x={outsideX + barW / 2}
                  y={y(g.outside) + 20}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill="var(--color-accent)"
                >
                  {g.outside}%
                </text>
              )}

              <text
                x={cx}
                y={H - PAD.b + 28}
                textAnchor="middle"
                fontSize={14}
                fill="var(--color-ink)"
                style={{
                  fontVariantCaps: 'all-small-caps',
                  fontFeatureSettings: "'smcp'",
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                }}
              >
                {g.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PAD.l}, ${PAD.t - 20})`}>
          <rect x={0} y={-10} width={12} height={12} fill="var(--color-ink)" />
          <text
            x={18}
            y={0}
            fontSize={13}
            fill="var(--color-ink)"
            style={{
              fontVariantCaps: 'all-small-caps',
              fontFeatureSettings: "'smcp'",
              letterSpacing: '0.05em',
            }}
          >
            Inside AI frontier
          </text>
          <rect
            x={180}
            y={-10}
            width={12}
            height={12}
            fill="var(--color-accent)"
          />
          <text
            x={198}
            y={0}
            fontSize={13}
            fill="var(--color-accent)"
            style={{
              fontVariantCaps: 'all-small-caps',
              fontFeatureSettings: "'smcp'",
              letterSpacing: '0.05em',
            }}
          >
            Outside AI frontier
          </text>
        </g>
      </svg>
      <figcaption>
        Dell'Acqua et al. 2023, N = 758 BCG consultants with GPT-4. On tasks
        inside the AI's capability frontier, assisted consultants performed
        ~40% better on quality; on tasks outside the frontier, they performed
        19 percentage points <em>worse</em> than non-AI controls. The premium
        skill of the AI era is knowing which side of the frontier a given task
        actually sits on.
      </figcaption>
    </figure>
  );
}
