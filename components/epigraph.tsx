import type { ReactNode } from 'react';

export function Epigraph({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: ReactNode;
}) {
  return (
    <blockquote className="epigraph">
      <span className="epigraph-text">{children}</span>
      {attribution ? (
        <cite className="epigraph-attribution">{attribution}</cite>
      ) : null}
    </blockquote>
  );
}
