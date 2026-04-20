import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Twenty years of product design case studies. Migrating from the prior site through 2026; each will be reframed through the Prototype-Led Positioning thesis as it ships.',
};

type WorkItem = {
  title: string;
  company: string;
  role: string;
  period?: string;
  summary: string;
  slug?: string;
  receipt?: boolean;
};

const work: WorkItem[] = [
  {
    title: 'HelloFresh — Growth Engineering',
    company: 'HelloFresh',
    role: 'Principal Product Designer',
    period: '2020–2022',
    summary:
      'Conversion and retention work across the sign-up funnel and the meal selection surface. The canonical operator receipt for the Prototype-Led Positioning thesis.',
    receipt: true,
  },
  {
    title: 'Daily Harvest — Product Design Leadership',
    company: 'Daily Harvest',
    role: 'Principal Product Designer',
    period: '2019–2020',
    summary:
      'Subscription lifecycle, reorder flow, and plan configuration across iOS, Android, and web. The second receipt the essays lean on.',
    receipt: true,
  },
  {
    title: 'HelloNotifications',
    company: 'HelloFresh',
    role: 'Principal Product Designer',
    summary:
      'Cross-channel notification system — push, email, in-app — unified under a single preference surface. Example of the experiment-interface pattern before the framework was named.',
  },
  {
    title: 'Horizons',
    company: 'Yahoo',
    role: 'Principal Product Designer',
    summary: 'Yahoo Mail product design work.',
  },
  {
    title: 'Boop (acquired by Chewy)',
    company: 'Petabyte Technologies',
    role: 'Product Designer',
    summary:
      'Pet healthcare platform. Acquired by Chewy. Early operator work that informed the current research program.',
  },
  {
    title: 'First Place — Global Hackathon 2022',
    company: 'HelloFresh',
    role: 'Team Lead',
    summary: 'First place, global hackathon 2022.',
  },
  {
    title: 'Single Question Sign Up',
    company: 'HelloFresh',
    role: 'Principal Product Designer',
    summary:
      'A one-field sign-up flow that replaced a seven-step onboarding. Archetypal prototype-led positioning artifact: the prototype was the argument.',
  },
  {
    title: 'Multi-preference Sign Up',
    company: 'HelloFresh',
    role: 'Principal Product Designer',
    summary:
      'The counter-experiment to single-question sign-up: when multi-preference capture improves downstream personalization more than it costs in drop-off.',
  },
];

export default function WorkIndex() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Work</h1>
        <p className="subtitle">
          Twenty years of product design. Case studies are migrating from the
          prior site and are being reframed through the Prototype-Led
          Positioning thesis rather than republished verbatim.
        </p>
      </header>

      <section>
        <p>
          Each case study below will, when live, document the prototype that
          unlocked the position, the shipped result, and what moved as a
          consequence. Until then, this page is a manifest — proof that the
          frameworks did not arrive from nowhere.
        </p>
      </section>

      <section>
        <h2>Case studies</h2>
        <ul className="list-none p-0">
          {work.map((w) => (
            <li key={w.title} className="mb-6">
              <p
                style={{
                  textIndent: 0,
                  fontSize: '1.2rem',
                  marginBottom: '0.25rem',
                }}
              >
                {w.slug ? (
                  <Link href={`/work/${w.slug}`}>{w.title}</Link>
                ) : (
                  <span>{w.title}</span>
                )}
                {w.receipt ? (
                  <span
                    className="sc"
                    style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}
                  >
                    receipt
                  </span>
                ) : null}
              </p>
              <p
                className="essay-meta"
                style={{ marginBottom: '0.25rem', textIndent: 0 }}
              >
                {w.company}
                {w.role ? ` · ${w.role}` : null}
                {w.period ? ` · ${w.period}` : null}
              </p>
              <p
                style={{
                  textIndent: 0,
                  color: 'var(--color-ink-muted)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                }}
              >
                {w.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
