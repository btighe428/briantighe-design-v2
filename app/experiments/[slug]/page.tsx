import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type RouteParams = { slug: string };

type ExperimentDef = {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  relatedEssay?: { href: string; title: string };
  load: () => Promise<{ default: React.ComponentType }>;
};

const experiments: Record<string, ExperimentDef> = {
  'collapsing-abstraction-layer': {
    title: 'The Collapsing Abstraction Layer',
    subtitle: 'A thirty-year timeline of digital prototyping tools',
    date: '2026-04-19',
    description:
      'Interactive D3 timeline visualizing the essay: tool births, deaths, eras, and the compression of the abstraction layer between designer intent and running system.',
    relatedEssay: {
      href: '/essays/2026/collapsing-abstraction-layer',
      title: 'The Collapsing Abstraction Layer (essay)',
    },
    load: () => import('@/content/experiments/collapsing-abstraction-layer/chart'),
  },
};

export async function generateStaticParams() {
  return Object.keys(experiments).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = experiments[slug];
  if (!exp) return {};
  return {
    title: exp.title,
    description: exp.description,
    alternates: { canonical: `/experiments/${slug}` },
    openGraph: {
      type: 'article',
      title: exp.title,
      description: exp.description,
    },
  };
}

export default async function ExperimentPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const exp = experiments[slug];
  if (!exp) notFound();

  const mod = await exp.load();
  const Chart = mod.default;

  return (
    <main className="essay experiment">
      <header>
        <div className="essay-meta">
          <Link href="/experiments">← Experiments</Link>
          <span> · </span>
          <time dateTime={exp.date}>
            {new Date(exp.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
        </div>
        <h1>{exp.title}</h1>
        <p className="subtitle">{exp.subtitle}</p>
      </header>

      <section className="experiment-body">
        <Chart />
      </section>

      {exp.relatedEssay ? (
        <section>
          <h2>Related essay</h2>
          <p>
            <Link href={exp.relatedEssay.href}>{exp.relatedEssay.title}</Link>
          </p>
        </section>
      ) : null}
    </main>
  );
}
