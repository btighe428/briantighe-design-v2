import type { GapReport } from "./types";

const W = 340;
const H = 140;
const PAD = { top: 20, right: 40, bottom: 24, left: 10 };

export function CorpusScaleOverTime({ data }: { data: GapReport }) {
  const series = data.weeklyTotals;
  const n = series.length;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxPosts = Math.max(...series.map((s) => s.posts));
  const maxJds = Math.max(...series.map((s) => s.jds));
  const scale = (max: number) => (v: number) => PAD.top + chartH - (v / max) * chartH;
  const scaleX = (i: number) => PAD.left + (i / (n - 1)) * chartW;

  const postsPath = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scale(maxPosts)(s.posts).toFixed(1)}`)
    .join(" ");
  const jdsPath = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scale(maxJds)(s.jds).toFixed(1)}`)
    .join(" ");

  return (
    <figure className="inline-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={`Weekly corpus volumes over ${n} weeks. Posts and job listings, normalized to their own maxima.`}
      >
        <title>Corpus scale, weekly</title>
        <desc>Two overlaid time-series, each normalized to its own maximum to show shape rather than absolute scale.</desc>
        <path d={postsPath} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
        <path d={jdsPath} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
        <text x={PAD.left} y={PAD.top - 6} fontSize={9} fill="var(--color-accent)" style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}>posts</text>
        <text x={PAD.left + 40} y={PAD.top - 6} fontSize={9} fill="var(--color-ink)" style={{ fontVariantCaps: "all-small-caps", fontFeatureSettings: "'smcp'" }}>jds</text>
        <text x={W - PAD.right + 4} y={PAD.top + 4} fontSize={8} fill="var(--color-ink-muted)">peak {maxPosts}</text>
        <text x={W - PAD.right + 4} y={H - PAD.bottom + 2} fontSize={8} fill="var(--color-ink-muted)">peak {maxJds}</text>
      </svg>
      <figcaption>Weekly corpus volumes, each normalized to its own peak.</figcaption>
    </figure>
  );
}
