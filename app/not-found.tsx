import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not found',
  description: 'This page has moved or is being migrated from the prior site.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Not found</h1>
        <p className="subtitle">
          This page does not exist on the current site. It may be a migrated
          URL from the prior site, or it may simply not exist.
        </p>
      </header>

      <section>
        <p>
          The site is in active transition from briantighe.design v1
          (Squarespace portfolio) to v2 (the research program at this URL). If
          you arrived from a specific link, the most likely destinations are:
        </p>
        <ul>
          <li>
            <Link href="/essays">Essays</Link> — the written thesis.
          </li>
          <li>
            <Link href="/work">Work</Link> — case studies, some shipping, some
            migrating.
          </li>
          <li>
            <Link href="/">Home</Link> — if the URL was old, this is where
            you'd like to be.
          </li>
        </ul>
      </section>
    </main>
  );
}
