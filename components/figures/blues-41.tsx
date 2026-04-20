// 41 shades of blue. A literal rendering of Bowman's story:
// the Google A/B test that prompted his resignation.

const N = 41;
const SWATCH = 26;
const SWATCH_H = 180;
const START = [66, 133, 244]; // Google blue
const END = [13, 71, 161]; // deeper indigo

function blend(t: number): string {
  const r = Math.round(START[0] + (END[0] - START[0]) * t);
  const g = Math.round(START[1] + (END[1] - START[1]) * t);
  const b = Math.round(START[2] + (END[2] - START[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function Blues41() {
  const swatches = Array.from({ length: N }, (_, i) => i / (N - 1));
  const W = N * SWATCH;
  const H = SWATCH_H + 40;
  return (
    <figure className="inline-figure blues-41">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="41 shades of blue, linearly interpolated between Google's original blue and a deeper indigo."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {swatches.map((t, i) => (
          <rect
            key={i}
            x={i * SWATCH}
            y={0}
            width={SWATCH}
            height={SWATCH_H}
            fill={blend(t)}
          />
        ))}
        {[1, 11, 21, 31, 41].map((n) => (
          <text
            key={n}
            x={(n - 1) * SWATCH + SWATCH / 2}
            y={SWATCH_H + 24}
            textAnchor="middle"
            fontSize={16}
            fill="var(--color-ink-muted)"
            style={{ fontFeatureSettings: "'onum'" }}
          >
            {n}
          </text>
        ))}
      </svg>
      <figcaption>
        Forty-one shades of blue, linearly interpolated. The one Google's A/B
        test sought was one of these; the human eye cannot reliably prefer
        among the middle thirty.
      </figcaption>
    </figure>
  );
}
