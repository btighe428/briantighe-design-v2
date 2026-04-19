import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Case studies from twenty years of product design, framed around prototype-led positioning.',
};

export default function WorkIndex() {
  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Work</h1>
        <p className="subtitle">
          Case studies from twenty years of product design. Migrating in over
          the coming quarters.
        </p>
      </header>
      <section>
        <p>
          Each case study will be framed around the thesis: the prototype that
          unlocked the position, the working artifact that replaced the deck,
          the shipped result and what moved as a consequence.
        </p>
      </section>
    </main>
  );
}
