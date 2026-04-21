'use client';

import {
  Children,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  isValidElement,
} from 'react';
import scrollama from 'scrollama';

type ScrollyBlockProps = {
  /**
   * Render function for the sticky chart. Receives the active step index
   * (0-based) and should return the chart React element for that state.
   */
  render: (activeStep: number, totalSteps: number) => ReactNode;
  /**
   * Step children — each <Step> is a scroll-tracked block that triggers a
   * render-callback transition when it enters the viewport.
   */
  children: ReactNode;
  /** Extra CSS class on the outer wrapper. */
  className?: string;
};

/**
 * ScrollyBlock — the NYT / Pudding "pinned chart, scrolling text" pattern.
 * Charts re-render via the render prop as each Step enters view. The chart
 * is visually sticky during the scroll; steps scroll past it.
 *
 * Usage (MDX):
 *   <ScrollyBlock render={(step) => <MyChart highlight={step} />}>
 *     <Step>Paragraph 1 — chart is in state 0</Step>
 *     <Step>Paragraph 2 — chart transitions to state 1</Step>
 *     <Step>Paragraph 3 — chart transitions to state 2</Step>
 *   </ScrollyBlock>
 */
export function ScrollyBlock({
  render,
  children,
  className,
}: ScrollyBlockProps) {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const totalSteps = Children.toArray(children).filter(
    (c) => isValidElement(c) && (c.type as { displayName?: string }).displayName === 'Step',
  ).length;

  useEffect(() => {
    const container = stepsRef.current;
    if (!container) return;
    const scroller = scrollama();
    scroller
      .setup({
        step: container.querySelectorAll('.scrolly-step'),
        offset: 0.5,
        threshold: 1,
      })
      .onStepEnter(({ index }: { index: number }) => {
        setActiveStep(index);
      });
    const onResize = () => scroller.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      scroller.destroy();
    };
  }, []);

  return (
    <div className={`scrolly-block ${className ?? ''}`}>
      <div className="scrolly-sticky" aria-hidden="false">
        {render(activeStep, totalSteps)}
      </div>
      <div className="scrolly-steps" ref={stepsRef}>
        {Children.map(children, (child, idx) => {
          if (
            isValidElement(child) &&
            (child.type as { displayName?: string }).displayName === 'Step'
          ) {
            return (
              <div
                className={`scrolly-step ${
                  idx === activeStep ? 'is-active' : ''
                }`}
                data-index={idx}
              >
                {child}
              </div>
            );
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function Step({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
Step.displayName = 'Step';
