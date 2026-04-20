import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Fourteen years of product design case studies. Yahoo Mail, Daily Harvest, HelloFresh, Loeb.nyc / LxLabs, and the portfolio of growth-stage startups — including Boop (acquired by Chewy) and SearchRx (acquired by Optum as Optum Perks) — where the frameworks were shipped and tested.',
};

type Outcome =
  | string
  | {
      text: string;
      badge?: {
        label: string;
        detail?: string;
        variant: 'acquired' | 'sold' | 'note';
      };
    };

type Exit = {
  company: string;
  acquirer: string;
  year: number;
  detail?: string;
};

type Role = {
  company: string;
  role: string;
  period: string;
  location?: string;
  outcomes: Outcome[];
  receipt?: boolean;
  exits?: Exit[];
};

const roles: Role[] = [
  {
    company: 'Yahoo',
    role: 'Principal Product Designer, Growth and Experimentation',
    period: '2024 – present',
    location: 'New York City',
    receipt: true,
    outcomes: [
      '+$30M+ incremental revenue through conversion optimization and growth initiatives at Yahoo Mail, one of the world\'s largest email platforms.',
      'Strategic design across acquisition, activation, retention, and monetization, driven by rigorous experimentation and close collaboration with engineering, product, and senior leadership.',
      'Co-founded internal "Vibe Coding Club" and co-lead AI design working group — teaching and mentoring AI design workflows to designers, PMs, and engineers.',
    ],
  },
  {
    company: 'Daily Harvest',
    role: 'Principal Product Designer, Design Director',
    period: '2023 – 2024',
    location: 'New York City',
    outcomes: [
      'Digital Product Design leadership for an organic meal subscription service valued at $1.1B.',
      'Led strategic Shopify migration and continuous advancement of the digital product portfolio in direct partnership with founder Rachel Drori and executive leadership.',
    ],
  },
  {
    company: 'HelloFresh',
    role: 'Staff Product Designer → Senior Product Designer, Conversions/Activations',
    period: '2020 – 2023',
    location: 'New York City',
    receipt: true,
    outcomes: [
      '+$75M value increase and 100,000 additional monthly account creations — the most effective conversion optimization tests in HelloFresh history.',
      'International cross-alliance design strategy across the global Design Organization; partnered with senior product leadership on high-impact roadmaps.',
      'Managed three direct reports; mentored six junior designers.',
      'Led both moderated and unmoderated user research programs that informed data-driven design decisions across the funnel.',
    ],
  },
  {
    company: 'Loeb.nyc / LxLabs',
    role: 'Director, Digital Product Design',
    period: '2017 – 2020',
    location: 'New York City',
    exits: [
      {
        company: 'Boop',
        acquirer: 'Chewy',
        year: 2023,
        detail: 'Pet healthcare EHR startup; led brand identity.',
      },
    ],
    outcomes: [
      'Founded and led LxLabs — an in-house product design agency of 3–7 designers servicing the Loeb.nyc portfolio.',
      'Fetch Rewards: UI overhaul for a top-100 iOS shopping app.',
      {
        text: 'Boop: brand identity for a pet-healthcare EHR startup.',
        badge: {
          label: 'Acquired',
          detail: 'by Chewy · 2023',
          variant: 'acquired',
        },
      },
      'Firstleaf: end-to-end platform and launch for a premier wine subscription service.',
      'Nunbelievable: identity and branding for a socially conscious CPG cookie company in partnership with Tony Robbins\' Trillions VC.',
      'SiO Beauty: conversion optimization strategy and implementation.',
      'SingleCare: growth-stage healthcare product work.',
    ],
  },
  {
    company: 'Loeb.nyc',
    role: 'Senior UX Designer',
    period: '2015 – 2017',
    location: 'New York City',
    exits: [
      {
        company: 'SearchRx',
        acquirer: 'Optum',
        year: 2016,
        detail: 'Rebranded Optum Perks; conceptualized, designed, and coded the MVP.',
      },
    ],
    outcomes: [
      'First UX designer at Loeb.nyc — the family-office VC founded by Michael Loeb (Founder, Priceline.com).',
      'Optimizely A/B testing program across 11,000 pages → +35%+ conversion increases.',
      {
        text: 'Conceptualized, designed, and coded the MVP for SearchRx.',
        badge: {
          label: 'Acquired',
          detail: 'by Optum as Optum Perks',
          variant: 'acquired',
        },
      },
      'Streamlined 20+ brands into five distinct entities with unique value propositions.',
      'SingleCare GTM work: tripled daily acquisition volume, halved cost per acquisition, grew the brand by +700%.',
      'Instituted the first formal Agile process with an offshore partner using JIRA and Kanban.',
    ],
  },
  {
    company: 'Earlier career',
    role: 'UX Design + Front-End Development',
    period: '2011 – 2015',
    location: 'New York City',
    outcomes: [
      'SourceMedia (2014–2015) — UX Designer: article pages, registration flows, responsive B2B publishing microsite templates.',
      'Criteo (2014) — Interactive Designer: display ads, prototype and R&D on touch-specific multi-platform ad formats. Attended Criteo\'s NASDAQ IPO.',
      'ExpandTheRoom (2011–2013) — Front-End Developer → UX Designer for Rolling Stone, Men\'s Weekly, and US Magazine. Self-taught the development foundation that anchors the current practice.',
    ],
  },
];

function renderOutcome(o: Outcome, idx: number) {
  if (typeof o === 'string') {
    return (
      <li
        key={idx}
        style={{
          color: 'var(--color-ink)',
          marginBottom: '0.35rem',
          fontSize: '1rem',
          lineHeight: 1.5,
        }}
      >
        {o}
      </li>
    );
  }
  return (
    <li
      key={idx}
      style={{
        color: 'var(--color-ink)',
        marginBottom: '0.35rem',
        fontSize: '1rem',
        lineHeight: 1.5,
      }}
    >
      {o.text}
      {o.badge ? (
        <>
          {' '}
          <span
            className="exit-badge"
            style={{
              display: 'inline-block',
              marginLeft: '0.35rem',
              padding: '0.05rem 0.55rem',
              fontSize: '0.72rem',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: '0.08em',
              border: '1px solid var(--color-accent)',
              color: 'var(--color-accent)',
              borderRadius: '2px',
              verticalAlign: 'baseline',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {o.badge.label}
            {o.badge.detail ? (
              <span
                style={{
                  color: 'var(--color-ink-muted)',
                  marginLeft: '0.3em',
                  borderLeft: '1px solid var(--color-rule)',
                  paddingLeft: '0.3em',
                }}
              >
                {o.badge.detail}
              </span>
            ) : null}
          </span>
        </>
      ) : null}
    </li>
  );
}

export default function WorkIndex() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Work</h1>
        <p className="subtitle">
          Fourteen years of product design across Yahoo Mail, Daily Harvest,
          HelloFresh, and the Loeb.nyc / LxLabs portfolio of growth-stage
          startups. The receipts the essays reach for.
        </p>
      </header>

      <section>
        <p>
          The case studies below are the shipped work behind{' '}
          <Link href="/essays">the frameworks</Link>. Two employers are
          flagged as <span className="sc">receipt</span> because they produced
          named, measurable operator outcomes the essays specifically cite.
        </p>
      </section>

      <section>
        <ol className="list-none p-0" style={{ paddingLeft: 0 }}>
          {roles.map((r) => (
            <li
              key={`${r.company}-${r.period}`}
              className="mb-8"
              style={{ listStyle: 'none' }}
            >
              <p
                style={{
                  textIndent: 0,
                  fontSize: '1.3rem',
                  marginBottom: '0.15rem',
                }}
              >
                <strong>{r.company}</strong>
                {r.receipt ? (
                  <span
                    className="sc"
                    style={{
                      marginLeft: '0.55rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-accent)',
                    }}
                  >
                    receipt
                  </span>
                ) : null}
              </p>
              <p
                className="essay-meta"
                style={{ textIndent: 0, marginBottom: '0.35rem' }}
              >
                {r.role} · {r.period}
                {r.location ? ` · ${r.location}` : null}
              </p>
              <ul style={{ marginTop: 0, paddingLeft: '1.2rem' }}>
                {r.outcomes.map((o, idx) => renderOutcome(o, idx))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
