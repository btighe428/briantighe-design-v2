import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { formatDate, getAllEssays } from '@/lib/content';
import { getAllFrameworks } from '@/lib/frameworks';
import { breadcrumbListSchema, graph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Full-text search across every essay, framework, and page on briantighe.design.',
  alternates: { canonical: '/search' },
  robots: { index: true, follow: true },
};

type Hit = {
  href: string;
  title: string;
  subtitle?: string;
  kind: 'essay' | 'framework';
  snippet?: string;
  date?: string;
};

function highlight(text: string, query: string): string {
  const lower = text.toLowerCase();
  const i = lower.indexOf(query.toLowerCase());
  if (i === -1) return text.slice(0, 180);
  const start = Math.max(0, i - 60);
  const end = Math.min(text.length, i + query.length + 120);
  return (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
}

async function search(query: string): Promise<Hit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const [essays, frameworks] = await Promise.all([
    getAllEssays(),
    getAllFrameworks(),
  ]);
  const hits: Hit[] = [];

  for (const e of essays) {
    const haystack = [
      e.title,
      e.subtitle ?? '',
      e.description ?? '',
      e.body,
      (e.tags ?? []).join(' '),
      (e.keywords ?? []).join(' '),
    ]
      .join('\n')
      .toLowerCase();
    if (haystack.includes(q)) {
      hits.push({
        href: e.href,
        title: e.title,
        subtitle: e.subtitle,
        kind: 'essay',
        snippet: highlight(e.body, q),
        date: e.date,
      });
    }
  }

  for (const f of frameworks) {
    const haystack = [f.title, f.definition, f.description ?? '', f.body]
      .join('\n')
      .toLowerCase();
    if (haystack.includes(q)) {
      hits.push({
        href: f.href,
        title: f.title,
        subtitle: f.definition,
        kind: 'framework',
        snippet: highlight(f.body, q),
      });
    }
  }

  return hits;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const hits = query ? await search(query) : [];

  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Search', href: '/search' },
  ]);

  return (
    <main className="essay">
      <JsonLd data={graph(crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Search</h1>
        <p className="subtitle">
          Full-text across essays, frameworks, and the site.
        </p>
      </header>

      <form method="get" action="/search" role="search">
        <label htmlFor="q" style={{ display: 'block', marginBottom: '0.5rem' }}>
          <span className="sc">Query</span>
        </label>
        <input
          type="search"
          name="q"
          id="q"
          defaultValue={query}
          placeholder="e.g. positioning"
          required
          style={{
            width: '100%',
            maxWidth: '32rem',
            padding: '0.6rem 0.9rem',
            fontFamily: 'inherit',
            fontSize: '1.1rem',
            border: '1px solid var(--color-rule)',
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '0.5rem',
            padding: '0.6rem 1.2rem',
            fontFamily: 'inherit',
            fontSize: '1rem',
            border: '1px solid var(--color-ink)',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {query ? (
        <section style={{ marginTop: '2rem' }}>
          <h2>
            {hits.length} {hits.length === 1 ? 'result' : 'results'} for{' '}
            <em>{query}</em>
          </h2>
          {hits.length === 0 ? (
            <p>
              Nothing matched. Try <Link href="/essays">essays</Link> or{' '}
              <Link href="/frameworks">frameworks</Link>.
            </p>
          ) : (
            <ol className="list-none p-0">
              {hits.map((h) => (
                <li key={h.href} className="mb-8">
                  <p className="essay-meta" style={{ marginBottom: '0.25rem' }}>
                    <span className="sc">{h.kind}</span>
                    {h.date ? (
                      <>
                        {' · '}
                        <time dateTime={new Date(h.date).toISOString()}>
                          {formatDate(h.date)}
                        </time>
                      </>
                    ) : null}
                  </p>
                  <p style={{ textIndent: 0, fontSize: '1.3rem' }}>
                    <Link href={h.href}>{h.title}</Link>
                  </p>
                  {h.subtitle ? (
                    <p
                      style={{
                        textIndent: 0,
                        fontStyle: 'italic',
                        color: 'var(--color-ink-muted)',
                      }}
                    >
                      {h.subtitle}
                    </p>
                  ) : null}
                  {h.snippet ? (
                    <p
                      style={{
                        textIndent: 0,
                        color: 'var(--color-ink-muted)',
                        fontSize: '1rem',
                      }}
                    >
                      {h.snippet}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      ) : (
        <section style={{ marginTop: '2rem' }}>
          <p className="essay-meta">
            Try: <Link href="/search?q=positioning">positioning</Link>,{' '}
            <Link href="/search?q=prototype">prototype</Link>,{' '}
            <Link href="/search?q=growth">growth</Link>.
          </p>
        </section>
      )}
    </main>
  );
}
