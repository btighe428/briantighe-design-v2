import Link from 'next/link';
import type { Metadata } from 'next';
import { catalog } from '@/content/maps/registry';

export const metadata: Metadata = {
  title: 'Mind Maps',
  description:
    'Mind Maps on Contemporary Topics in Innovation — a series of structured visual maps by Brian Tighe. UX design, venture capital, Apple, Silicon Valley history, Thomas Edison, and more in progress.',
};

export default function MapsIndex() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Mind Maps</h1>
        <p className="subtitle">
          A working series on Contemporary Topics in Innovation. Each map
          distills a field into six branches and three levels of nesting —
          the shape a topic has when you ask "what are all the things a
          practitioner needs to hold in their head at once."
        </p>
      </header>

      <section>
        <p>
          The series began as a private research exercise in 2024 and is
          being migrated into this site one topic at a time. The maps are
          structured data, not PDFs — they render as interactive radial
          trees, hover-traceable to the center, and can be linked from
          within the essays when they ground a specific argument.
        </p>
      </section>

      <section>
        <h2>The series</h2>
        <ol className="list-none p-0" style={{ paddingLeft: 0 }}>
          {catalog.map((entry) => (
            <li
              key={entry.slug}
              className="mb-8"
              style={{ listStyle: 'none' }}
            >
              <p
                style={{
                  textIndent: 0,
                  fontSize: '1.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                {entry.status === 'published' ? (
                  <Link href={`/maps/${entry.slug}`}>{entry.title}</Link>
                ) : (
                  <span>{entry.title}</span>
                )}
                <span
                  className="sc"
                  style={{
                    marginLeft: '0.6rem',
                    fontSize: '0.8rem',
                    color:
                      entry.status === 'published'
                        ? 'var(--color-accent)'
                        : 'var(--color-ink-muted)',
                  }}
                >
                  {entry.status === 'published' ? 'live' : entry.status}
                </span>
              </p>
              {entry.subtitle ? (
                <p
                  className="essay-meta"
                  style={{ textIndent: 0, marginBottom: '0.25rem' }}
                >
                  {entry.subtitle}
                </p>
              ) : null}
              <p
                style={{
                  textIndent: 0,
                  color: 'var(--color-ink-muted)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                }}
              >
                {entry.summary}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
