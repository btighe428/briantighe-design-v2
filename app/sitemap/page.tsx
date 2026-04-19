import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { formatDate, getAllEssays } from '@/lib/content';
import { getAllFrameworks } from '@/lib/frameworks';
import { breadcrumbListSchema, graph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Every public page on briantighe.design, organized.',
  alternates: { canonical: '/sitemap' },
};

export default async function SitemapPage() {
  const essays = await getAllEssays();
  const frameworks = await getAllFrameworks();
  const years = Array.from(new Set(essays.map((e) => e.year))).sort(
    (a, b) => Number(b) - Number(a),
  );
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Sitemap', href: '/sitemap' },
  ]);

  return (
    <main className="essay">
      <JsonLd data={graph(crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Sitemap</h1>
        <p className="subtitle">
          Every public page, organized. Machine-readable version at{' '}
          <Link href="/sitemap.xml">/sitemap.xml</Link>.
        </p>
      </header>

      <section>
        <h2>Top level</h2>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/essays">Essays</Link>
          </li>
          <li>
            <Link href="/frameworks">Frameworks</Link>
          </li>
          <li>
            <Link href="/experiments">Experiments</Link>
          </li>
          <li>
            <Link href="/work">Work</Link>
          </li>
        </ul>
      </section>

      <section>
        <h2>Frameworks</h2>
        <ul>
          {frameworks.map((f) => (
            <li key={f.href}>
              <Link href={f.href}>{f.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {years.map((year) => (
        <section key={year}>
          <h2>
            <Link href={`/essays/${year}`}>Essays from {year}</Link>
          </h2>
          <ul>
            {essays
              .filter((e) => e.year === year)
              .map((e) => (
                <li key={e.href}>
                  <Link href={e.href}>{e.title}</Link>{' '}
                  <span className="essay-meta">— {formatDate(e.date)}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section>
        <h2>Feeds</h2>
        <ul>
          <li>
            <Link href="/feed.xml">RSS (/feed.xml)</Link>
          </li>
          <li>
            <Link href="/atom.xml">Atom (/atom.xml)</Link>
          </li>
          <li>
            <Link href="/feed.json">JSON Feed (/feed.json)</Link>
          </li>
          <li>
            <Link href="/sitemap.xml">XML sitemap</Link>
          </li>
          <li>
            <Link href="/robots.txt">robots.txt</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
