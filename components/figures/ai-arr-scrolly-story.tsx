'use client';

import type { ReactNode } from 'react';
import { ScrollyBlock, Step } from '@/components/scrolly';
import { AiArrScrolly } from './ai-arr-scrolly';

const FOCUS_ORDER = ['cursor', 'replit', 'bolt', 'lovable'];

/**
 * Client-side wrapper that owns both the scrolly block and the
 * AiArrScrolly chart state. MDX can pass in children (one <Step>
 * per tool) without serializing a render prop across the
 * server→client boundary.
 */
export function AiArrScrollyStory({ children }: { children: ReactNode }) {
  return (
    <ScrollyBlock
      render={(step) => (
        <AiArrScrolly
          focus={FOCUS_ORDER[Math.min(step, FOCUS_ORDER.length - 1)]}
        />
      )}
    >
      {children}
    </ScrollyBlock>
  );
}

export { Step };
