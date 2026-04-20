// 41 shades of blue. A literal rendering of Bowman's story:
// the Google A/B test that prompted his resignation.

const N = 41;
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
  return (
    <figure className="inline-figure blues-41">
      <svg
        viewBox={`0 0 ${N * 18} 64`}
        role="img"
        aria-label="41 shades of blue, linearly interpolated between Google's original blue and a deeper indigo."
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {swatches.map((t, i) => (
          <rect
            key={i}
            x={i * 18}
            y={0}
            width={18}
            height={56}
            fill={blend(t)}
          />
        ))}
        <text
          x={0}
          y={62}
          fontSize={9}
          fill="var(--color-ink-muted)"
          style={{ fontFeatureSettings: "'onum'" }}
        >
          1
        </text>
        <text
          x={N * 18}
          y={62}
          textAnchor="end"
          fontSize={9}
          fill="var(--color-ink-muted)"
          style={{ fontFeatureSettings: "'onum'" }}
        >
          41
        </text>
      </svg>
      <figcaption>
        Forty-one shades of blue, linearly interpolated. The one Google's A/B
        test sought was one of these; the human eye cannot reliably prefer
        among the middle thirty.
      </figcaption>
    </figure>
  );
}
