import Link from 'next/link';
import { getAllEssays, formatDate } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';
import { SubscribeForm } from '@/components/subscribe-form';

export default async function HomePage() {
  const essays = await getAllEssays();
  const latest = essays[0];

  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <span>{siteConfig.author.role}</span>
        </div>
        <h1>{siteConfig.author.name}</h1>
        <p className="subtitle">
          Essays, experiments, and case studies on design engineering for
          growth.
        </p>
      </header>

      <section>
        <p>
          <span className="newthought">Design engineering</span> is the
          discipline of treating shippable prototypes as the primary artifact
          of a growth practice — not decks, not specs, not wireframes. This
          site is a working record of that practice: the frameworks, the
          experiments, and the case studies that make it legible.
        </p>
        <p>
          It is published weekly. It is written to be cited. It is built as a
          live demonstration of its own thesis.
        </p>
      </section>

      {latest ? (
        <section>
          <h2>Latest essay</h2>
          <p>
            <Link href={latest.href}>{latest.title}</Link>
            {latest.subtitle ? (
              <>
                {' '}
                —{' '}
                <em style={{ color: 'var(--color-ink-muted)' }}>
                  {latest.subtitle}
                </em>
              </>
            ) : null}
          </p>
          <p className="essay-meta">
            <time dateTime={new Date(latest.date).toISOString()}>
              {formatDate(latest.date)}
            </time>
          </p>
        </section>
      ) : null}

      <section>
        <h2>Index</h2>
        <ul>
          <li>
            <Link href="/essays">Essays</Link> — the written thesis in full.
          </li>
          <li>
            <Link href="/experiments">Experiments</Link> — shippable
            prototypes and interactive proofs.
          </li>
          <li>
            <Link href="/work">Work</Link> — case studies from twenty years of
            product design.
          </li>
          <li>
            <Link href="/feed.xml">RSS</Link> — full-text feed for Substack
            and LLMs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Newsletter</h2>
        <SubscribeForm source="homepage" />
      </section>
    </main>
  );
}
