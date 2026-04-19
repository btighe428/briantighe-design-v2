import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbListSchema, graph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'The stack, typography, and publishing discipline behind briantighe.design.',
  alternates: { canonical: '/colophon' },
  openGraph: {
    type: 'article',
    url: '/colophon',
    title: 'Colophon — Brian Tighe',
    description:
      'The stack, typography, and publishing discipline behind briantighe.design.',
  },
};

export default function ColophonPage() {
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Colophon', href: '/colophon' },
  ]);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': 'https://v2.briantighe.design/colophon#techarticle',
    headline: 'Colophon — briantighe.design',
    description:
      'The stack, typography, and publishing discipline behind briantighe.design.',
    url: 'https://v2.briantighe.design/colophon',
    author: { '@id': 'https://v2.briantighe.design/#person' },
    publisher: { '@id': 'https://v2.briantighe.design/#organization' },
    inLanguage: 'en-US',
    proficiencyLevel: 'Expert',
  };

  return (
    <main className="essay">
      <JsonLd data={graph(schema, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Colophon</h1>
        <p className="subtitle">
          The stack, typography, and publishing discipline behind this site.
        </p>
      </header>

      <section>
        <h2>Stack</h2>
        <ul>
          <li>
            <strong>Framework:</strong> Next.js 16 (App Router, Turbopack).
          </li>
          <li>
            <strong>Content:</strong> MDX with YAML frontmatter;
            <code> content/essays/[year]/[slug].mdx</code>.
          </li>
          <li>
            <strong>Styles:</strong> Tailwind v4 with CSS-first theme tokens
            plus a hand-built Tufte typography system.
          </li>
          <li>
            <strong>Typography:</strong> ET Book (self-hosted WOFF2), with
            old-style figures and small caps via OpenType features.
          </li>
          <li>
            <strong>Analytics:</strong> Vercel Analytics + Speed Insights.
          </li>
          <li>
            <strong>Hosting:</strong> Vercel.
          </li>
        </ul>
      </section>

      <section>
        <h2>Distribution</h2>
        <ul>
          <li>
            <Link href="/feed.xml">RSS 2.0</Link>,{' '}
            <Link href="/atom.xml">Atom 1.0</Link>,{' '}
            <Link href="/feed.json">JSON Feed 1.1</Link> — all three with
            full <code>content:encoded</code>.
          </li>
          <li>
            <Link href="/sitemap.xml">sitemap.xml</Link> with{' '}
            <code>&lt;image:image&gt;</code> for every essay, framework, and
            tag page.
          </li>
          <li>
            <Link href="/robots.txt">robots.txt</Link> with an explicit
            allow-list for GPTBot, Claude-Web, PerplexityBot, and
            Google-Extended.
          </li>
          <li>Dynamic OpenGraph images via <code>next/og</code>.</li>
        </ul>
      </section>

      <section>
        <h2>Semantic layer</h2>
        <ul>
          <li>
            <strong>JSON-LD graph</strong>: Person, Organization, WebSite,
            Article, BreadcrumbList, CollectionPage, DefinedTerm,
            AboutPage, FAQPage, TechArticle — cross-linked via{' '}
            <code>@id</code>.
          </li>
          <li>
            <strong>Microformats</strong>: h-card on <Link href="/about">/about</Link>,{' '}
            <code>rel=me</code> on social profiles.
          </li>
          <li>
            <strong>Microdata</strong>: Schema.org Person / CreativeWork on
            the author block and inline citations.
          </li>
          <li>
            <strong>Speakable</strong> selectors on essay headlines for
            voice search.
          </li>
        </ul>
      </section>

      <section>
        <h2>Discipline</h2>
        <p>
          The site is an argument made in code. Every addition is measured
          against whether it serves one of three ends: publishing a new
          essay, distributing an existing one, or making the reading
          experience better.
        </p>
        <p>
          The{' '}
          <Link href="https://github.com/btighe428/briantighe-design-v2">
            source
          </Link>{' '}
          is public. The{' '}
          <Link href="/humans.txt">humans.txt</Link> acknowledges the
          lineage.
        </p>
      </section>

      <section>
        <h2>See also</h2>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/frameworks">Frameworks</Link>
          </li>
          <li>
            <Link href="/sitemap">Sitemap</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
