import type { ReactNode } from 'react';
import Link from 'next/link';
import { Epigraph } from './epigraph';
import { formatDate } from '@/lib/content';

type EssayFrontmatter = {
  title: string;
  subtitle?: string;
  date: string | Date;
  description?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  dropCap?: boolean;
};

export function EssayLayout({
  metadata,
  children,
}: {
  metadata: EssayFrontmatter;
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
    </article>
  );
}
