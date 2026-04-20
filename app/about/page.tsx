import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Brian Tighe (pronounced "tie") is a Principal Product Designer at Yahoo Mail — Growth and Experimentation. Brooklyn-based. Fourteen years shipping interfaces across growth-stage startups and platforms. Harvard and Yale executive certificates, 2025.',
};

export default function AboutPage() {
  const { author, education, receipts } = siteConfig;

  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>{author.name}</h1>
        <p className="subtitle">
          Pronounced "<em>tie</em>". {author.role}, {author.company}.{' '}
          {author.location}.
        </p>
      </header>

      <section>
        <p>
          Fourteen years shipping interfaces. I started in front-end
          development at ExpandTheRoom (2011) building for Rolling Stone,
          Men's Weekly, and US Magazine; transitioned to UX at Criteo
          through its NASDAQ IPO; then joined <span className="sc">Loeb.nyc</span>{' '}
          — the family-office VC founded by Michael Loeb of Priceline.com —
          as their first UX designer.
        </p>
        <p>
          At Loeb.nyc I built <span className="sc">LxLabs</span>, an in-house
          product design agency of three to seven designers servicing the
          portfolio. The work across that period included UI for Fetch
          Rewards (a top-100 iOS shopping app), the brand identity for Boop
          (acquired by Chewy in 2023), the end-to-end platform for Firstleaf,
          the identity for Nunbelievable (with Tony Robbins' Trillions VC),
          conversion optimization for SiO Beauty, and the MVP for SearchRx —
          which I conceptualized, designed, and coded, and which Optum later
          acquired as Optum Perks. SingleCare grew{' '}
          <span className="sc">+700%</span> in that window via the go-to-market
          work I led; the Optimizely program I built ran across 11,000 pages
          for <span className="sc">+35%+</span> conversion.
        </p>
        <p>
          At <span className="sc">HelloFresh</span> (2020–2023), Senior and
          Staff Product Designer roles produced{' '}
          <span className="sc">+$75M</span> in conversion-optimization value
          and 100,000 additional monthly account creations — the most
          effective conversion tests in the company's history. At{' '}
          <span className="sc">Daily Harvest</span> (2023–2024), I was
          Principal Product Designer and Design Director across a $1.1B
          organic meal subscription service, partnered directly with founder
          Rachel Drori on the strategic Shopify migration.
        </p>
        <p>
          Currently Principal Product Designer at{' '}
          <span className="sc">Yahoo Mail</span>, Growth and Experimentation.{' '}
          <span className="sc">+$30M+</span> in incremental revenue to date
          through conversion optimization and growth initiatives. Co-founded
          the internal "Vibe Coding Club" and co-lead the AI design working
          group — teaching AI-augmented design workflows to designers, PMs,
          and engineers.
        </p>
        <p>
          This site — <em>briantighe.design</em> — is the research program
          those shipped outcomes compound into. The{' '}
          <Link href="/essays">essays</Link> articulate the frameworks. The{' '}
          <Link href="/experiments">experiments</Link> are the shippable
          prototypes that test them. The <Link href="/work">work</Link> is
          the receipts.
        </p>
      </section>

      <section>
        <h2>Receipts</h2>
        <ul>
          {receipts.map((r) => (
            <li key={`${r.company}-${r.metric}`}>
              <span className="sc">{r.metric}</span> — {r.description}{' '}
              <em style={{ color: 'var(--color-ink-muted)' }}>
                ({r.company}, {r.period})
              </em>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        <ul>
          {education.map((ed) => (
            <li key={ed.institution}>
              <strong>{ed.institution}</strong> —{' '}
              <em>{ed.credential}</em>, {ed.year}
              {'honors' in ed && ed.honors ? (
                <>
                  {' '}
                  · <span className="sc">{ed.honors}</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${author.email}`}>{author.email}</a>
          <br />
          {author.location}.
        </p>
        <p>
          Newsletter subscribe on the <Link href="/">homepage</Link>. RSS at{' '}
          <Link href="/feed.xml">/feed.xml</Link>. GitHub at{' '}
          <a href="https://github.com/btighe428" target="_blank" rel="noopener">
            github.com/btighe428
          </a>
          .
        </p>
      </section>
    </main>
  );
}
