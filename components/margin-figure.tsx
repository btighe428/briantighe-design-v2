import type { ReactNode } from 'react';

export function MarginFigure({
  src,
  alt,
  caption,
  children,
}: {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <figure className="margin-figure">
      {src ? <img src={src} alt={alt ?? ''} /> : children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
