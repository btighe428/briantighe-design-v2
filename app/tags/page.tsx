import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { getAllTags } from '@/lib/content';
import {
  breadcrumbListSchema,
  collectionPageSchema,
  graph,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Every tag used on briantighe.design, with essay counts. Each tag is a permanent URL.',
  alternates: { canonical: '/tags' },
  openGraph: {
    type: 'website',
    url: '/tags',
    title: 'Tags — Brian Tighe',
    description: 'Every tag used on briantighe.design, with essay counts.',
  },
};

export default async function TagsIndex() {
  const tags = await getAllTags();
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Tags', href: '/tags' },
  ]);
  const collection = collectionPageSchema({
    href: '/tags',
    name: 'Tags — Brian Tighe',
    description: 'Every tag used on briantighe.design.',
    items: tags.map((t) => ({ name: t.tag, href: `/tags/${t.slug}` })),
  });

  return (
    <main className="essay">
      <JsonLd data={graph(collection, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Tags</h1>
        <p className="subtitle">
          {tags.length === 0
            ? 'No tags yet.'
            : `${tags.length} tags, ordered alphabetically.`}
        </p>
      </header>
      {tags.length > 0 ? (
        <section>
          <ul>
            {tags.map((t) => (
              <li key={t.slug}>
                <Link href={`/tags/${t.slug}`}>{t.tag}</Link>{' '}
                <span className="essay-meta">
                  — {t.count} {t.count === 1 ? 'essay' : 'essays'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
