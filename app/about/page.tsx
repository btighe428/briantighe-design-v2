import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { NewsletterForm } from '@/components/newsletter-form';
import {
  aboutPageSchema,
  breadcrumbListSchema,
  faqSchema,
  graph,
  personSchema,
} from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

const FAQS = [
  {
    q: 'Who is Brian Tighe?',
    a: 'Brian Tighe is a Principal Product Designer at Yahoo Mail and the originator of prototype-led positioning — the practice of treating a working, shippable prototype as the primary artifact of a growth practice.',
  },
  {
    q: 'What is design engineering for growth?',
    a: 'Design engineering for growth is a discipline that sits between product design, front-end engineering, and growth, built on the premise that the shippable artifact — not the deck, the spec, or the wireframe — is the unit of account.',
  },
  {
    q: 'What is prototype-led positioning?',
    a: 'Prototype-led positioning is the practice of treating a working, shippable prototype as the primary positioning artifact of a product or category, with the deck (if it exists at all) as a derivative summary written from the prototype.',
  },
  {
    q: 'How often are new essays published?',
    a: 'A new essay is published every Monday. Subscribe by email or via RSS, Atom, or JSON Feed.',
  },
  {
    q: 'How can I get in touch?',
    a: `Email ${siteConfig.author.email} with any subject line that makes sense: speaking, podcasts, consulting, or a simple note. For subscription, use the subject "Subscribe".`,
  },
  {
    q: 'Is the site open source?',
    a: 'Portions of the design system and publishing stack are open. See the colophon for stack details, and GitHub for the relevant repositories.',
  },
];

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
      <JsonLd
        data={graph(
          aboutPageSchema(),
          personSchema(),
          crumbs,
          faqSchema(FAQS.map((f) => ({ q: f.q, a: f.a }))),
        )}
      />
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
        <h2>Newsletter</h2>
        <p>
          One essay per Monday. No tracking beyond Vercel. Unsubscribe by
          reply.
        </p>
        <NewsletterForm />
      </section>

      <section>
        <h2>Frequently asked</h2>
        <dl>
          {FAQS.map((item) => (
            <div key={item.q} style={{ marginBottom: '1.5rem' }}>
              <dt style={{ fontWeight: 600 }}>{item.q}</dt>
              <dd style={{ marginLeft: 0 }}>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email{' '}
          <a href={`mailto:${siteConfig.author.email}`}>
            {siteConfig.author.email}
          </a>
          . For speaking, podcasts, and consulting: same address, subject
          line that makes sense.
        </p>
      </section>
    </main>
  );
}
