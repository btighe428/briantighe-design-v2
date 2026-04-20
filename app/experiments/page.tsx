import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiments',
  description:
    'Shippable prototypes and interactive proofs. Working artifacts across real-estate, design-market, weather, and local-intelligence domains — each one a test of the design-engineering-for-growth thesis.',
};

type InternalExperiment = {
  type: 'internal';
  title: string;
  tagline: string;
  href: string;
  date: string;
  stack: string[];
};

type ExternalProject = {
  type: 'external';
  title: string;
  tagline: string;
  url?: string;
  status: 'live' | 'beta' | 'private';
  stack: string[];
  role: string;
  period: string;
};

type Item = InternalExperiment | ExternalProject;

const items: Item[] = [
  {
    type: 'internal',
    title: 'The Collapsing Abstraction Layer — data story',
    tagline:
      'Interactive D3 timeline of 24 prototyping tools across four eras, 1995–2026. The visual companion to the essay.',
    href: '/experiments/collapsing-abstraction-layer',
    date: '2026-04-19',
    stack: ['D3.js', 'Next.js', 'SVG'],
  },
  {
    type: 'external',
    title: 'DwellScore',
    tagline:
      'Real-estate listing intelligence. Scores NYC listings across six biophilic dimensions — financial, outdoor, commute, investment, ART restoration, practical — with peer-reviewed mechanism citations.',
    url: 'https://dwellscore.com',
    status: 'beta',
    stack: ['Next.js', 'Prisma', 'scoring engine', 'Claude'],
    role: 'Operator-researcher',
    period: '2025–',
  },
  {
    type: 'external',
    title: 'Design Drift',
    tagline:
      'Live designer-job-market intelligence. High-water-mark piece: the skills-vs-seniority heatmap at /trends. Weekly ingest of thousands of listings, Claude-driven normalization.',
    url: 'https://design-drift-two.vercel.app',
    status: 'live',
    stack: ['Next.js 16', 'Prisma', 'Trigger.dev', 'Apify', 'Haiku'],
    role: 'Operator-researcher',
    period: '2026',
  },
  {
    type: 'external',
    title: 'Faktory',
    tagline:
      'Deal-intelligence platform — scrapes marketplace listings to surface SaaS sectors with real revenue growth. Thesis: operator-led diligence beats list-based diligence in the current vintage.',
    status: 'private',
    stack: ['Scraper pipeline', 'Postgres', 'analysis layer'],
    role: 'Operator-researcher',
    period: '2025–',
  },
  {
    type: 'external',
    title: 'Weather Story',
    tagline:
      'E-ink weather instrument on reTerminal E1001 and Waveshare GDEY075T7. Custom ESP32 firmware; backend serves pre-rendered PNG frames per device configuration. Currently private while the form factor settles.',
    status: 'private',
    stack: ['ESP32', 'e-ink', 'Arduino', 'Next.js', 'Vercel'],
    role: 'Hardware + backend',
    period: '2025–',
  },
  {
    type: 'external',
    title: 'Cityping',
    tagline:
      'NYC daily digest. 311 alerts, environmental readings, events, airport status, and a Haiku-driven day score. Premium lifecycle, three time-slot sends.',
    url: 'https://cityping.net',
    status: 'live',
    stack: ['Next.js', 'Prisma', 'Resend', 'Trigger.dev', 'Claude Haiku'],
    role: 'Operator-researcher',
    period: '2025–',
  },
  {
    type: 'external',
    title: 'Cityping API',
    tagline:
      'The B2B surface of the Cityping platform — NYC intelligence as structured data + email digests. 30+ cron jobs; legacy SMS ASP alerts.',
    status: 'private',
    stack: ['Next.js 16', 'Prisma', 'Resend', 'Twilio', 'Stripe', 'Vercel crons'],
    role: 'Operator',
    period: '2025–',
  },
];

const statusLabel: Record<ExternalProject['status'], string> = {
  live: 'live',
  beta: 'beta',
  private: 'private',
};

export default function ExperimentsIndex() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Experiments</h1>
        <p className="subtitle">
          Shippable prototypes and interactive proofs. Some live at this
          domain, some live elsewhere; all are working artifacts that test the
          design-engineering-for-growth thesis in the specific.
        </p>
      </header>

      <section>
        <ul className="list-none p-0" style={{ paddingLeft: 0 }}>
          {items.map((item) => (
            <li key={item.title} className="mb-8" style={{ listStyle: 'none' }}>
              <p
                style={{
                  textIndent: 0,
                  fontSize: '1.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                {item.type === 'internal' ? (
                  <Link href={item.href}>{item.title}</Link>
                ) : item.url ? (
                  <a href={item.url} target="_blank" rel="noopener">
                    {item.title}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
                <span
                  className="sc"
                  style={{
                    marginLeft: '0.6rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-ink-muted)',
                  }}
                >
                  {item.type === 'internal'
                    ? 'on-site'
                    : statusLabel[item.status]}
                </span>
              </p>
              <p
                className="essay-meta"
                style={{ textIndent: 0, marginBottom: '0.25rem' }}
              >
                {item.type === 'internal'
                  ? `${item.stack.join(' · ')}`
                  : `${item.role} · ${item.period} · ${item.stack.join(' · ')}`}
              </p>
              <p
                style={{
                  textIndent: 0,
                  color: 'var(--color-ink-muted)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                }}
              >
                {item.tagline}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
