import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { formatDate, getAllTags } from '@/lib/content';
import {
  breadcrumbListSchema,
  collectionPageSchema,
  graph,
} from '@/lib/seo';

type RouteParams = { slug: string };

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getAllTags();
  const entry = tags.find((t) => t.slug === slug);
  if (!entry) return {};
  const title = `${entry.tag} — essays`;
  const description = `Essays on briantighe.design tagged "${entry.tag}". ${entry.count} ${entry.count === 1 ? 'essay' : 'essays'}.`;
  return {
    title,
    description,
    alternates: { canonical: `/tags/${slug}` },
    openGraph: {
      type: 'website',
      url: `/tags/${slug}`,
      title: `${title} — Brian Tighe`,
      description,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const tags = await getAllTags();
  const entry = tags.find((t) => t.slug === slug);
  if (!entry) notFound();

  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Tags', href: '/tags' },
    { name: entry.tag, href: `/tags/${slug}` },
  ]);
  const collection = collectionPageSchema({
    href: `/tags/${slug}`,
    name: `${entry.tag} — essays`,
    description: `Essays tagged "${entry.tag}".`,
    items: entry.essays.map((e) => ({
      name: e.title,
      href: e.href,
      date: e.date,
    })),
  });

  return (
    <main className="essay">
      <JsonLd data={graph(collection, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/tags">← Tags</Link>
        </div>
        <h1>{entry.tag}</h1>
        <p className="subtitle">
          {entry.count} {entry.count === 1 ? 'essay' : 'essays'}.
        </p>
      </header>
      <ol className="list-none p-0">
        {entry.essays.map((e) => (
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
