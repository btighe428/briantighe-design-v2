// FAANG+Booking.com experimentation volume.

const W = 900;
const H = 340;
const PAD = { t: 50, r: 30, b: 80, l: 220 };

type Row = { label: string; value: number; note?: string };

const rows: Row[] = [
  { label: 'Microsoft', value: 10000 },
  { label: 'Amazon', value: 10000 },
  { label: 'Google', value: 10000 },
  { label: 'Facebook / Meta', value: 10000 },
  { label: 'Booking.com', value: 1000, note: 'concurrent at any moment' },
];

const MAX = 12000;

export function FaangExperiments() {
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const rowH = innerH / rows.length;

  function xOfValue(v: number) {
    return PAD.l + (v / MAX) * innerW;
  }

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="FAANG experimentation volumes: Microsoft, Amazon, Google, and Meta each run 10,000+ online controlled experiments annually; Booking.com reports over 1,000 concurrent experiments at any given moment."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* Axis */}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={H - PAD.b}
          y2={H - PAD.b}
          stroke="var(--color-rule)"
        />
        {[0, 2500, 5000, 7500, 10000].map((v) => (
          <g key={v}>
            <line
              x1={xOfValue(v)}
              x2={xOfValue(v)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--color-rule)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
            />
            <text
              x={xOfValue(v)}
              y={H - PAD.b + 22}
              textAnchor="middle"
              fontSize={12}
              fill="var(--color-ink-muted)"
              style={{ fontFeatureSettings: "'onum'" }}
            >
              {v.toLocaleString()}
            </text>
          </g>
        ))}
        <text
          x={PAD.l + innerW / 2}
          y={H - 32}
          textAnchor="middle"
          fontSize={13}
          fill="var(--color-ink-muted)"
          style={{
            fontVariantCaps: 'all-small-caps',
            fontFeatureSettings: "'smcp'",
            letterSpacing: '0.06em',
          }}
        >
          Online controlled experiments annually (or concurrent)
        </text>

        {/* Bars */}
        {rows.map((r, i) => {
          const y = PAD.t + i * rowH + rowH * 0.15;
          const barH = rowH * 0.55;
          const isBook = r.label === 'Booking.com';
          return (
            <g key={r.label}>
              <text
                x={PAD.l - 16}
                y={y + barH / 2 + 5}
                textAnchor="end"
                fontSize={15}
                fill="var(--color-ink)"
                fontWeight={500}
              >
                {r.label}
              </text>
              <rect
                x={PAD.l}
                y={y}
                width={xOfValue(r.value) - PAD.l}
                height={barH}
                fill={isBook ? 'var(--color-accent)' : 'var(--color-ink)'}
                fillOpacity={0.85}
              />
              <text
                x={xOfValue(r.value) + 10}
                y={y + barH / 2 + 5}
                fontSize={14}
                fill={isBook ? 'var(--color-accent)' : 'var(--color-ink)'}
                style={{
                  fontFeatureSettings: "'onum'",
                  fontWeight: 600,
                }}
              >
                {r.value.toLocaleString()}
                {r.note ? (
                  <tspan
                    fill="var(--color-ink-muted)"
                    fontWeight={400}
                    style={{ fontStyle: 'italic' }}
                  >
                    {' '}
                    {r.note}
                  </tspan>
                ) : null}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Kohavi and Thomke (HBR Sep–Oct 2017) and practitioner reports
        (Booking.com via Lukas Vermeer). Four platforms each run 10,000+
        online controlled experiments annually; Booking.com reports in excess
        of 1,000 concurrent at any moment. The break with Lean Startup's
        pivot-or-persevere rhetoric is quantitative: <em>validated
        learning</em> in 2026 is always-on causal inference at scale.
      </figcaption>
    </figure>
  );
}
