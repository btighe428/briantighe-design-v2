import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import {
  aboutPageSchema,
  breadcrumbListSchema,
  graph,
  personSchema,
} from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description: siteConfig.author.bio,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: '/about',
    title: `About — ${siteConfig.author.name}`,
    description: siteConfig.author.bio,
    firstName: 'Brian',
    lastName: 'Tighe',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About — ${siteConfig.author.name}`,
    description: siteConfig.author.bio,
  },
};

export default function AboutPage() {
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]);

  return (
    <main className="essay">
      <JsonLd data={graph(aboutPageSchema(), personSchema(), crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>About</h1>
        <p className="subtitle">
          {siteConfig.author.role}. Originator of prototype-led positioning.
        </p>
      </header>

      <section className="h-card" itemScope itemType="https://schema.org/Person">
        <p>
          <span className="newthought">
            <span className="p-name" itemProp="name">
              Brian Tighe
            </span>
          </span>{' '}
          is a{' '}
          <span className="p-job-title" itemProp="jobTitle">
            Principal Product Designer
          </span>{' '}
          at{' '}
          <span
            className="p-org"
            itemProp="worksFor"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <span itemProp="name">Yahoo Mail</span>
          </span>{' '}
          and the originator of <em>prototype-led positioning</em> — the
          practice of treating a working, shippable prototype as the primary
          artifact of a growth practice, in place of the legacy positioning
          deck.
        </p>
        <p className="p-note" itemProp="description">
          This site is the flagship demonstration of the category{' '}
          <em>design engineering for growth</em>: a discipline that sits
          between product design, front-end engineering, and growth, built on
          the premise that the shippable artifact — not the deck, the spec,
          or the wireframe — is the unit of account.
        </p>
        <a
          className="u-url"
          href={siteConfig.url}
          rel="me"
          itemProp="url"
          hidden
        >
          {siteConfig.url}
        </a>
        <a
          className="u-email"
          href={`mailto:${siteConfig.author.email}`}
          hidden
        >
          {siteConfig.author.email}
        </a>
      </section>

      <section>
        <h2>Frameworks</h2>
        <ul>
          {siteConfig.frameworks.map((f) => (
            <li key={f.id}>{f.label}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Elsewhere</h2>
        <ul>
          <li>
            <a
              className="u-url"
              href="https://www.linkedin.com/in/briantighe/"
              rel="me noopener"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="u-url"
              href="https://x.com/btighe428"
              rel="me noopener"
            >
              X (Twitter)
            </a>
          </li>
          <li>
            <a
              className="u-url"
              href="https://github.com/btighe428"
              rel="me noopener"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.author.email}`}>Email</a>
          </li>
          <li>
            <Link href="/feed.xml">RSS</Link>
          </li>
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          To subscribe to new essays, email{' '}
          <a href={`mailto:${siteConfig.author.email}?subject=Subscribe`}>
            {siteConfig.author.email}
          </a>{' '}
          with the subject <span className="sc">Subscribe</span>. For
          speaking, podcasts, and consulting: same address, subject line that
          makes sense.
        </p>
      </section>
    </main>
  );
}
