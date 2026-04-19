import type { ReactNode } from 'react';

export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: ReactNode;
}) {
  return (
    <blockquote className="pull-quote">
      {children}
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  );
}
