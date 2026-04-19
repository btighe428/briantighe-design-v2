import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { formatDate, getAllEssays } from '@/lib/content';
import {
  breadcrumbListSchema,
  collectionPageSchema,
  graph,
} from '@/lib/seo';

type RouteParams = { year: string };

export async function generateStaticParams() {
  const essays = await getAllEssays();
  const years = new Set(essays.map((e) => e.year));
  return Array.from(years).map((year) => ({ year }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { year } = await params;
  const title = `Essays from ${year}`;
  const description = `Every essay published on briantighe.design in ${year}, ordered by date.`;
  return {
    title,
    description,
    alternates: { canonical: `/essays/${year}` },
    openGraph: {
      type: 'website',
      url: `/essays/${year}`,
      title: `${title} — Brian Tighe`,
      description,
    },
  };
}

export default async function EssaysYearPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { year } = await params;
  const essays = (await getAllEssays()).filter((e) => e.year === year);
  if (essays.length === 0) notFound();

  const collection = collectionPageSchema({
    href: `/essays/${year}`,
    name: `Essays from ${year} — Brian Tighe`,
    description: `Every essay published on briantighe.design in ${year}, ordered by date.`,
    items: essays.map((e) => ({
      name: e.title,
      href: e.href,
      date: e.date,
    })),
  });
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Essays', href: '/essays' },
    { name: year, href: `/essays/${year}` },
  ]);

  return (
    <main className="essay">
      <JsonLd data={graph(collection, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/essays">← Essays</Link>
        </div>
        <h1>Essays from {year}</h1>
        <p className="subtitle">
          {essays.length} {essays.length === 1 ? 'essay' : 'essays'}.
        </p>
      </header>
      <ol className="list-none p-0">
        {essays.map((e) => (
          <li key={e.href} className="mb-8">
            <p className="essay-meta" style={{ marginBottom: '0.25rem' }}>
              <time dateTime={new Date(e.date).toISOString()}>
                {formatDate(e.date)}
              </time>
            </p>
            <p style={{ textIndent: 0, fontSize: '1.35rem' }}>
              <Link href={e.href}>{e.title}</Link>
            </p>
            {e.subtitle ? (
              <p
                style={{
                  textIndent: 0,
                  fontStyle: 'italic',
                  color: 'var(--color-ink-muted)',
                  fontSize: '1.05rem',
                }}
              >
                {e.subtitle}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </main>
  );
}
