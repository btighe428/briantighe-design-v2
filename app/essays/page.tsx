import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllEssays, formatDate } from '@/lib/content';
import { JsonLd } from '@/components/json-ld';
import {
  breadcrumbListSchema,
  collectionPageSchema,
  graph,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Essays',
  description:
    'Essays on design engineering for growth, prototype-led positioning, and the craft of shippable ideas.',
  alternates: { canonical: '/essays' },
  openGraph: {
    type: 'website',
    url: '/essays',
    title: 'Essays — Brian Tighe',
    description:
      'Essays on design engineering for growth, prototype-led positioning, and the craft of shippable ideas.',
  },
};

export default async function EssaysIndex() {
  const essays = await getAllEssays();
  const collection = collectionPageSchema({
    href: '/essays',
    name: 'Essays — Brian Tighe',
    description:
      'Essays on design engineering for growth, prototype-led positioning, and the craft of shippable ideas.',
    items: essays.map((e) => ({
      name: e.title,
      href: e.href,
      date: e.date,
    })),
  });
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Essays', href: '/essays' },
  ]);

  return (
    <main className="essay">
      <JsonLd data={graph(collection, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Essays</h1>
        <p className="subtitle">
          The written thesis. Updated weekly.
        </p>
      </header>

      {essays.length === 0 ? (
        <p>No essays yet.</p>
      ) : (
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
      )}
    </main>
  );
}
