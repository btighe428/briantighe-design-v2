import Link from 'next/link';
import type { ReactNode } from 'react';

type RefProps = {
  to: string;
  children: ReactNode;
  title?: string;
};

export function Ref({ to, children, title }: RefProps) {
  const isExternal = /^https?:\/\//i.test(to);
  if (isExternal) {
    return (
      <a
        href={to}
        rel="noopener external cite"
        className="ref"
        title={title}
        itemScope
        itemType="https://schema.org/CreativeWork"
      >
        <span itemProp="name">{children}</span>
      </a>
    );
  }
  return (
    <Link
      href={to}
      className="ref"
      title={title}
      rel="cite"
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <span itemProp="name">{children}</span>
    </Link>
  );
}
