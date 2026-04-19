import { useId } from 'react';
import type { ReactNode } from 'react';

export function Sidenote({ children }: { children: ReactNode }) {
  const id = useId();
  return (
    <span className="sidenote-ref">
      <label
        htmlFor={id}
        className="sidenote-number"
        aria-label="Toggle sidenote"
      />
      <input
        type="checkbox"
        id={id}
        className="sidenote-toggle"
        aria-hidden="true"
        tabIndex={-1}
      />
      <small className="sidenote">{children}</small>
    </span>
  );
}
