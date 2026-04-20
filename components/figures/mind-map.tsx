'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { hierarchy, tree, type HierarchyNode } from 'd3-hierarchy';
import { linkRadial } from 'd3-shape';
import { select } from 'd3-selection';
import {
  zoom as d3Zoom,
  zoomIdentity,
  type ZoomBehavior,
  type D3ZoomEvent,
} from 'd3-zoom';
import type { MapData, MapNode } from '@/content/maps/types';

const W = 2400;
const H = 2400;
const CX = W / 2;
const CY = H / 2;
const MAX_R = 1050;
const CENTER_R = 180;

const BRANCH_DASH_PATTERNS: (string | undefined)[] = [
  undefined,
  '14 5',
  '4 4',
  '14 4 3 4',
  '2 4',
  '10 4 2 4 2 4',
  '7 7',
  '16 3 1 3',
];

const ZOOM_MIN = 0.35;
const ZOOM_MAX = 5;

type PositionedNode = HierarchyNode<MapNode> & {
  __branchIndex: number;
  __id: string;
};

function compute(data: MapData) {
  const root = hierarchy<MapNode>(data.root) as PositionedNode;
  tree<MapNode>()
    .size([2 * Math.PI, MAX_R])
    .separation((a, b) => {
      // With horizontal labels, leaves need MORE angular room than
      // inner nodes because label text has the same screen width
      // regardless of depth. Scale separation up with depth.
      const sameParent = a.parent === b.parent;
      const base = sameParent ? 1 : 1.8;
      return base * (1 + (a.depth - 1) * 0.6);
    })(root);

  let counter = 0;
  root.each((node) => {
    const n = node as PositionedNode;
    n.__id = `n-${counter++}`;
    if (n.depth === 0) {
      n.__branchIndex = -1;
    } else {
      let cur: HierarchyNode<MapNode> = n;
      while (cur.depth > 1 && cur.parent) cur = cur.parent;
      n.__branchIndex =
        root.children?.indexOf(cur as PositionedNode) ?? -1;
    }
  });
  return root;
}

function polar(angle: number, radius: number) {
  return {
    x: radius * Math.sin(angle),
    y: -radius * Math.cos(angle),
  };
}

export function MindMap({ data }: { data: MapData }) {
  const root = useMemo(() => compute(data), [data]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomLayerRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(
    null,
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const svgEl = svgRef.current;
    const gEl = zoomLayerRef.current;
    if (!svgEl || !gEl) return;

    const behavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .filter((event: Event) => {
        // Don't capture text selection / right-click / ctrl-click
        if ((event as MouseEvent).button && (event as MouseEvent).button !== 0)
          return false;
        // Wheel always zooms; everything else passes
        return !((event as KeyboardEvent).ctrlKey && event.type !== 'wheel');
      })
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        select(gEl).attr('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    const svg = select(svgEl);
    svg.call(behavior);
    // Disable browser double-click zoom (d3-zoom sets its own; we turn it off
    // so single/double clicks on nodes stay click-only)
    svg.on('dblclick.zoom', null);

    zoomBehaviorRef.current = behavior;

    return () => {
      svg.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, []);

  const hoveredNode = useMemo<PositionedNode | null>(() => {
    if (!hoveredId) return null;
    const all = root.descendants() as PositionedNode[];
    return all.find((n) => n.__id === hoveredId) ?? null;
  }, [hoveredId, root]);

  const ancestryIds = useMemo<Set<string> | null>(() => {
    if (!hoveredNode) return null;
    return new Set(
      (hoveredNode.ancestors() as PositionedNode[]).map((a) => a.__id),
    );
  }, [hoveredNode]);

  const descendantIds = useMemo<Set<string> | null>(() => {
    if (!hoveredNode) return null;
    return new Set(
      (hoveredNode.descendants() as PositionedNode[]).map((a) => a.__id),
    );
  }, [hoveredNode]);

  function zoomBy(factor: number) {
    const svgEl = svgRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!svgEl || !behavior) return;
    select(svgEl).transition().duration(180).call(behavior.scaleBy, factor);
  }

  function zoomReset() {
    const svgEl = svgRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!svgEl || !behavior) return;
    select(svgEl).transition().duration(220).call(behavior.transform, zoomIdentity);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const t = e.target.tagName;
        if (t === 'INPUT' || t === 'TEXTAREA') return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomBy(1.35);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomBy(1 / 1.35);
      } else if (e.key === '0') {
        e.preventDefault();
        zoomReset();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const linkGen = linkRadial<
    { source: PositionedNode; target: PositionedNode },
    PositionedNode
  >()
    .angle((d) => d.x ?? 0)
    .radius((d) => d.y ?? 0);

  const allNodes = root.descendants() as PositionedNode[];
  const allLinks = root.links() as {
    source: PositionedNode;
    target: PositionedNode;
  }[];

  return (
    <figure className="mind-map-figure" style={{ position: 'relative' }}>
      <div className="mind-map-controls">
        <button
          type="button"
          className="mm-btn"
          onClick={() => zoomBy(1.35)}
          aria-label="Zoom in (+)"
          title="Zoom in · +"
        >
          +
        </button>
        <button
          type="button"
          className="mm-btn"
          onClick={() => zoomBy(1 / 1.35)}
          aria-label="Zoom out (−)"
          title="Zoom out · −"
        >
          −
        </button>
        <button
          type="button"
          className="mm-btn mm-btn-reset"
          onClick={zoomReset}
          aria-label="Reset view (0)"
          title="Reset · 0"
        >
          Reset
        </button>
        <span className="mm-zoom-readout" aria-hidden="true">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Mind map: ${data.title}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          fontFamily: 'var(--font-serif)',
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        <g ref={zoomLayerRef}>
          <g transform={`translate(${CX}, ${CY})`}>
            {[1, 2, 3, 4].map((d) => (
              <circle
                key={`ring-${d}`}
                cx={0}
                cy={0}
                r={(MAX_R * d) / 4}
                fill="none"
                stroke="var(--color-rule)"
                strokeOpacity={0.3}
                strokeDasharray="2 6"
                strokeWidth={0.75}
              />
            ))}

            {(() => {
              const decorated = allLinks.map((link, i) => {
                const targetNode = link.target;
                const inAncestry =
                  ancestryIds?.has(targetNode.__id) ||
                  ancestryIds?.has(link.source.__id);
                const inDescendant = descendantIds?.has(targetNode.__id);
                const active = !!(inAncestry || inDescendant);
                return { link, i, active };
              });
              const order = hoveredNode
                ? [
                    ...decorated.filter((d) => !d.active),
                    ...decorated.filter((d) => d.active),
                  ]
                : decorated;
              return order.map(({ link, i, active }) => {
                const targetNode = link.target;
                const color =
                  data.branchColors[targetNode.__branchIndex] ?? 'var(--color-rule)';
                const faded = hoveredNode && !active;
                const dash =
                  BRANCH_DASH_PATTERNS[
                    targetNode.__branchIndex % BRANCH_DASH_PATTERNS.length
                  ];
                return (
                  <path
                    key={`link-${i}`}
                    d={linkGen(link) ?? ''}
                    fill="none"
                    stroke={color}
                    strokeOpacity={
                      faded ? 0.08 : targetNode.depth === 1 ? 0.95 : 0.75
                    }
                    strokeWidth={
                      targetNode.depth === 1
                        ? 4
                        : targetNode.depth === 2
                          ? 2.5
                          : 1.6
                    }
                    strokeDasharray={dash}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              });
            })()}

            {(() => {
              const nonRoot = allNodes.filter((n) => n.depth > 0);
              const decorated = nonRoot.map((n) => {
                const inAncestry = ancestryIds?.has(n.__id);
                const inDescendant = descendantIds?.has(n.__id);
                const active = !!(inAncestry || inDescendant);
                return { n, active };
              });
              const order = hoveredNode
                ? [
                    ...decorated.filter((d) => !d.active),
                    ...decorated.filter((d) => d.active),
                  ]
                : decorated;
              return order.map(({ n, active }) => {
              const angle = n.x ?? 0;
              const radius = n.y ?? 0;
              const { x, y } = polar(angle, radius);
              const color =
                data.branchColors[n.__branchIndex] ?? 'var(--color-ink)';
              const faded = hoveredNode && !active;

              const isBranch = n.depth === 1;
              const isSubBranch = n.depth === 2;
              const fontSize = isBranch ? 32 : isSubBranch ? 22 : 17;
              const fontWeight = isBranch ? 600 : isSubBranch ? 500 : 400;

              // Horizontal labels anchored by which side of the
              // vertical axis the node sits on. Readable at any
              // zoom level because text is never rotated.
              const sinA = Math.sin(angle);
              const onRight = sinA > 0.04;
              const onLeft = sinA < -0.04;
              const dx = onRight ? 14 : onLeft ? -14 : 0;
              const anchor = onRight ? 'start' : onLeft ? 'end' : 'middle';
              const cosA = Math.cos(angle);
              const verticalAdjust =
                anchor === 'middle'
                  ? cosA > 0
                    ? -18
                    : fontSize + 6
                  : fontSize / 3;

              return (
                <g
                  key={n.__id}
                  onMouseEnter={() => setHoveredId(n.__id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: 'default' }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isBranch ? 12 : isSubBranch ? 7 : 4}
                    fill={color}
                    fillOpacity={faded ? 0.2 : 1}
                  />
                  <text
                    x={x + dx}
                    y={y + verticalAdjust}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fill={isBranch ? color : 'var(--color-ink)'}
                    fillOpacity={faded ? 0.25 : 1}
                    textAnchor={anchor}
                    style={{
                      letterSpacing: isBranch ? '-0.005em' : '0',
                      transition: 'fill-opacity 120ms ease',
                      paintOrder: 'stroke',
                      stroke: 'var(--color-paper)',
                      strokeWidth: isBranch ? 6 : 4,
                      strokeLinejoin: 'round',
                    }}
                  >
                    {n.data.label}
                  </text>
                  <circle
                    cx={x}
                    cy={y}
                    r={Math.max(fontSize * 3, 36)}
                    fill="transparent"
                    pointerEvents="all"
                  />
                </g>
              );
              });
            })()}

            <g>
              <circle
                cx={0}
                cy={0}
                r={CENTER_R}
                fill="var(--color-ink)"
                stroke="var(--color-paper)"
                strokeWidth={6}
              />
              {wrapCenterLabel(data.title).map((line, i, arr) => (
                <text
                  key={i}
                  x={0}
                  y={(i - (arr.length - 1) / 2) * 30 - 8}
                  textAnchor="middle"
                  fontSize={26}
                  fontWeight={600}
                  fill="var(--color-paper)"
                >
                  {line}
                </text>
              ))}
              <text
                x={0}
                y={CENTER_R * 0.55}
                textAnchor="middle"
                fontSize={15}
                fill="var(--color-paper)"
                fillOpacity={0.75}
                style={{
                  fontVariantCaps: 'all-small-caps',
                  letterSpacing: '0.1em',
                  fontFeatureSettings: "'smcp'",
                }}
              >
                Brian Tighe · Mind Maps
              </text>
            </g>
          </g>
        </g>
      </svg>
      <figcaption>
        Orbital mind map. Scroll to zoom, drag to pan, or use the buttons
        above (<span className="sc">+ / − / 0</span> keys also work). Hover a
        node to highlight its path to the center and the subtree beneath it.
      </figcaption>
    </figure>
  );
}

function wrapCenterLabel(title: string): string[] {
  if (title.length <= 26) return [title];
  const inIdx = title.indexOf(' in ');
  if (inIdx > 0 && inIdx < 28) {
    return [title.slice(0, inIdx), title.slice(inIdx + 1)];
  }
  const words = title.split(' ');
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
}
