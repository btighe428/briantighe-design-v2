import type { ReactNode } from 'react';
import Link from 'next/link';
import { Epigraph } from './epigraph';
import { formatDate, tagSlug } from '@/lib/content';
import type { EssaySummary } from '@/lib/content';

type EssayLayoutMetadata = {
  title: string;
  subtitle?: string;
  date: string | Date;
  description?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  dropCap?: boolean;
  tags?: string[];
  section?: string;
  readingMinutes?: number;
};

export function EssayLayout({
  metadata,
  related,
  children,
}: {
  metadata: EssayLayoutMetadata;
  related?: EssaySummary[];
  children: ReactNode;
}) {
  const classes = ['essay'];
  if (metadata.dropCap) classes.push('drop-cap');

  return (
    <article className={classes.join(' ')}>
      <header>
        <div className="essay-meta">
          <Link href="/essays">← Essays</Link>
          <span> · </span>
          <time dateTime={new Date(metadata.date).toISOString()}>
            {formatDate(metadata.date)}
          </time>
          {metadata.readingMinutes ? (
            <>
              <span> · </span>
              <span>{metadata.readingMinutes} min read</span>
            </>
          ) : null}
          {metadata.section ? (
            <>
              <span> · </span>
              <span className="sc">{metadata.section}</span>
            </>
          ) : null}
        </div>
        <h1>{metadata.title}</h1>
        {metadata.subtitle ? (
          <p className="subtitle">{metadata.subtitle}</p>
        ) : null}
        {metadata.epigraph ? (
          <Epigraph attribution={metadata.epigraphAttribution}>
            {metadata.epigraph}
          </Epigraph>
        ) : null}
      </header>
      {children}
      {metadata.tags && metadata.tags.length > 0 ? (
        <footer style={{ marginTop: '4rem' }}>
          <p className="essay-meta" style={{ textIndent: 0 }}>
            Tagged:{' '}
            {metadata.tags.map((tag, i) => (
              <span key={tag}>
                {i > 0 ? ', ' : ''}
                <Link href={`/tags/${tagSlug(tag)}`}>{tag}</Link>
              </span>
            ))}
          </p>
        </footer>
      ) : null}
      {related && related.length > 0 ? (
        <aside style={{ marginTop: '3rem' }}>
          <h2>See also</h2>
          <ul>
            {related.map((e) => (
              <li key={e.href}>
                <Link href={e.href}>{e.title}</Link>
                {e.subtitle ? (
                  <>
                    {' '}
                    —{' '}
                    <em className="essay-meta">{e.subtitle}</em>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
