import { notFound } from "next/navigation";
import fixture from "@/components/figures/discourse-vs-hiring/__fixtures__/sample.json";
import { GapDumbbell } from "@/components/figures/discourse-vs-hiring/gap-dumbbell";
import { TopicTaxonomyMap } from "@/components/figures/discourse-vs-hiring/topic-taxonomy-map";
import { CorpusScaleOverTime } from "@/components/figures/discourse-vs-hiring/corpus-scale-over-time";
import { TopicDivergenceDetails } from "@/components/figures/discourse-vs-hiring/topic-divergence-details";
import type { GapReport } from "@/components/figures/discourse-vs-hiring/types";

export const dynamicParams = false;
export const metadata = { robots: "noindex" };

export async function generateStaticParams() {
  return [{ slug: "discourse-vs-hiring" }];
}

export default async function DevFigures({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "discourse-vs-hiring") notFound();
  const data = fixture as unknown as GapReport;
  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <p className="label">DEV: {slug}</p>
      <h1>Figures preview — fixture data</h1>
      <p className="subtitle">
        All four figures render against a hand-authored fixture.
      </p>
      <hr />
      <h2>F1 — Gap Dumbbell (hero)</h2>
      <GapDumbbell data={data} />
      <h2>F2 — Topic Taxonomy Map</h2>
      <TopicTaxonomyMap data={data} />
      <h2>F3 — Corpus Scale Over Time</h2>
      <div style={{ maxWidth: 340 }}>
        <CorpusScaleOverTime data={data} />
      </div>
      <h2>F4 — Topic Divergence Details</h2>
      <TopicDivergenceDetails data={data} />
    </div>
  );
}
