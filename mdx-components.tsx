import type { MDXComponents } from 'mdx/types';
import { Sidenote } from '@/components/sidenote';
import { MarginFigure } from '@/components/margin-figure';
import { Epigraph } from '@/components/epigraph';
import { PullQuote } from '@/components/pull-quote';

const components: MDXComponents = {
  Sidenote,
  MarginFigure,
  Epigraph,
  PullQuote,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
