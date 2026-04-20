import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { catalog, findCatalogEntry, publishedSlugs } from '@/content/maps/registry';
import { MindMap } from '@/components/figures/mind-map';

type RouteParams = { slug: string };

export async function generateStaticParams() {
  return publishedSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findCatalogEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/maps/${slug}` },
    openGraph: {
      type: 'article',
      title: entry.title,
      description: entry.summary,
      publishedTime: new Date(entry.date).toISOString(),
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const entry = findCatalogEntry(slug);
  if (!entry || entry.status !== 'published' || !entry.load) notFound();
  const { map } = await entry.load();

  return (
    <main className="essay map-page">
      <header>
        <div className="essay-meta">
          <Link href="/maps">← Mind Maps</Link>
          <span> · </span>
          <time dateTime={entry.date}>
            {new Date(entry.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
        </div>
        <h1>{map.title}</h1>
        {map.subtitle ? <p className="subtitle">{map.subtitle}</p> : null}
      </header>

      <section>
        <p>{map.description}</p>
      </section>

      <section className="map-container">
        <MindMap data={map} />
      </section>

      <section>
        <h2>How to read this</h2>
        <p>
          The center holds the topic. The six branches fan out bilaterally —
          three on each side — each in its own color. Sub-branches nest three
          levels deep under each top-level branch. Hover a leaf to trace the
          path back to the center; hover a branch to see everything it
          contains.
        </p>
        <p>
          This is the shape the topic has when you try to hold the whole
          field in your head at once. It is not an argument; it is a
          scaffold. The{' '}
          {map.relatedEssays && map.relatedEssays.length > 0 ? (
            <>
              essays below use this scaffold to make specific arguments —{' '}
              {map.relatedEssays.map((r, i) => (
                <span key={r.href}>
                  <Link href={r.href}>{r.title}</Link>
                  {i < map.relatedEssays!.length - 1 ? ', ' : ''}
                </span>
              ))}
              .
            </>
          ) : (
            <>
              <Link href="/essays">essays</Link> argue against or within
              scaffolds like this one.
            </>
          )}
        </p>
      </section>

      <section>
        <h2>More in the series</h2>
        <ul>
          {catalog
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <li key={c.slug}>
                {c.status === 'published' ? (
                  <Link href={`/maps/${c.slug}`}>{c.title}</Link>
                ) : (
                  <>
                    <span>{c.title}</span>{' '}
                    <span
                      className="sc"
                      style={{ color: 'var(--color-ink-muted)' }}
                    >
                      ({c.status})
                    </span>
                  </>
                )}
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
