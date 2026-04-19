import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiments',
  description:
    'Shippable prototypes and interactive proofs. Each is a working test of an essay thesis.',
  alternates: { canonical: '/experiments' },
  openGraph: {
    type: 'website',
    url: '/experiments',
    title: 'Experiments — Brian Tighe',
    description:
      'Shippable prototypes and interactive proofs. Each is a working test of an essay thesis.',
  },
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
          Shippable prototypes and interactive proofs — each one is a working
          test of a written thesis. None yet published.
        </p>
      </header>
      <section>
        <p>
          This section will fill as essays prompt prototypes. Experiments live
          at <code>/content/experiments/[slug]/</code> with their own React
          components. The first one ships alongside its originating essay.
        </p>
      </section>
    </main>
  );
}
