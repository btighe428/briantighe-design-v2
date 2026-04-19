import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { getAllFrameworks } from '@/lib/frameworks';
import {
  breadcrumbListSchema,
  collectionPageSchema,
  definedTermSchema,
  graph,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Frameworks',
  description:
    'Definitions of the frameworks practiced on briantighe.design: prototype-led positioning, design engineering for growth, and the working prototype as primary artifact.',
  alternates: { canonical: '/frameworks' },
  openGraph: {
    type: 'website',
    url: '/frameworks',
    title: 'Frameworks — Brian Tighe',
    description:
      'Canonical definitions of the frameworks practiced on briantighe.design.',
  },
};

export default async function FrameworksIndex() {
  const frameworks = await getAllFrameworks();
  const termSet = {
    '@type': 'DefinedTermSet',
    '@id': 'https://v2.briantighe.design/frameworks#set',
    name: 'briantighe.design frameworks',
    url: 'https://v2.briantighe.design/frameworks',
    hasDefinedTerm: frameworks.map((f) =>
      definedTermSchema({
        href: f.href,
        name: f.title,
        description: f.definition,
        alternateName: f.shortName,
      }),
    ),
  };
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Frameworks', href: '/frameworks' },
  ]);
  const collection = collectionPageSchema({
    href: '/frameworks',
    name: 'Frameworks — Brian Tighe',
    description:
      'Canonical definitions of the frameworks practiced on briantighe.design.',
    items: frameworks.map((f) => ({ name: f.title, href: f.href })),
  });

  return (
    <main className="essay">
      <JsonLd data={graph(termSet, collection, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Frameworks</h1>
        <p className="subtitle">
          Canonical definitions. Each is a permanent URL for the idea.
        </p>
      </header>
      <section>
        <ol className="list-none p-0">
          {frameworks.map((f) => (
            <li key={f.href} className="mb-8">
              <p style={{ textIndent: 0, fontSize: '1.35rem' }}>
                <Link href={f.href}>{f.title}</Link>
                {f.shortName ? (
                  <span className="essay-meta"> ({f.shortName})</span>
                ) : null}
              </p>
              <p
                style={{
                  textIndent: 0,
                  fontStyle: 'italic',
                  color: 'var(--color-ink-muted)',
                }}
              >
                {f.definition}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
