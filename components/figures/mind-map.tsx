'use client';

import { useMemo, useState } from 'react';
import { hierarchy, tree, type HierarchyNode } from 'd3-hierarchy';
import { linkRadial } from 'd3-shape';
import type { MapData, MapNode } from '@/content/maps/types';

const W = 2400;
const H = 2400;
const CX = W / 2;
const CY = H / 2;
const MAX_R = 1050;
const CENTER_R = 180;

type PositionedNode = HierarchyNode<MapNode> & {
  __branchIndex: number;
  __id: string;
};

function compute(data: MapData) {
  const root = hierarchy<MapNode>(data.root) as PositionedNode;
  tree<MapNode>().size([2 * Math.PI, MAX_R]).separation((a, b) => {
    // Tighter angular separation for deep nodes, looser for siblings in different branches
    return (a.parent === b.parent ? 1 : 1.3) / a.depth;
  })(root);

  // Assign stable ids + branchIndex
  let counter = 0;
  root.each((node) => {
    const n = node as PositionedNode;
    n.__id = `n-${counter++}`;
    // Determine top-level branch
    if (n.depth === 0) {
      n.__branchIndex = -1;
    } else {
      // Walk up to find the depth-1 ancestor
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

  const hoveredNode = useMemo<PositionedNode | null>(() => {
    if (!hoveredId) return null;
    const all = root.descendants() as PositionedNode[];
    return all.find((n) => n.__id === hoveredId) ?? null;
  }, [hoveredId, root]);

  const ancestryIds = useMemo<Set<string> | null>(() => {
    if (!hoveredNode) return null;
    const ancestors = (hoveredNode.ancestors() as PositionedNode[]) ?? [];
    return new Set(ancestors.map((a) => a.__id));
  }, [hoveredNode]);

  const descendantIds = useMemo<Set<string> | null>(() => {
    if (!hoveredNode) return null;
    const descendants =
      (hoveredNode.descendants() as PositionedNode[]) ?? [];
    return new Set(descendants.map((a) => a.__id));
  }, [hoveredNode]);

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
    <figure className="mind-map-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Mind map: ${data.title}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          fontFamily: 'var(--font-serif)',
        }}
      >
        <g transform={`translate(${CX}, ${CY})`}>
          {/* Concentric depth rings — subtle guide rings */}
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

          {/* Links */}
          {allLinks.map((link, i) => {
            const targetNode = link.target;
            const color =
              data.branchColors[targetNode.__branchIndex] ?? 'var(--color-rule)';
            const inAncestry =
              ancestryIds?.has(targetNode.__id) ||
              ancestryIds?.has(link.source.__id);
            const inDescendant = descendantIds?.has(targetNode.__id);
            const active = inAncestry || inDescendant;
            const faded = hoveredNode && !active;

            return (
              <path
                key={`link-${i}`}
                d={linkGen(link) ?? ''}
                fill="none"
                stroke={color}
                strokeOpacity={faded ? 0.08 : targetNode.depth === 1 ? 0.75 : 0.55}
                strokeWidth={
                  targetNode.depth === 1
                    ? 3
                    : targetNode.depth === 2
                      ? 2
                      : 1.2
                }
                strokeLinecap="round"
              />
            );
          })}

          {/* Nodes */}
          {allNodes.map((n) => {
            if (n.depth === 0) return null;

            const angle = n.x ?? 0;
            const radius = n.y ?? 0;
            const { x, y } = polar(angle, radius);

            const color =
              data.branchColors[n.__branchIndex] ?? 'var(--color-ink)';
            const inAncestry = ancestryIds?.has(n.__id);
            const inDescendant = descendantIds?.has(n.__id);
            const active = inAncestry || inDescendant;
            const faded = hoveredNode && !active;

            const isBranch = n.depth === 1;
            const isSubBranch = n.depth === 2;
            const fontSize = isBranch ? 32 : isSubBranch ? 22 : 17;
            const fontWeight = isBranch ? 600 : isSubBranch ? 500 : 400;

            const sinA = Math.sin(angle);
            const onRight = sinA > 0.04;
            const onLeft = sinA < -0.04;
            const dx = onRight ? 16 : onLeft ? -16 : 0;
            const anchor = onRight ? 'start' : onLeft ? 'end' : 'middle';
            const cosA = Math.cos(angle);
            const verticalAdjust = anchor === 'middle' ? (cosA > 0 ? -18 : fontSize + 6) : fontSize / 3;

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
                  }}
                >
                  {n.data.label}
                </text>
                {/* Invisible hit target, larger than the node */}
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(fontSize * 4, 40)}
                  fill="transparent"
                  pointerEvents="all"
                />
              </g>
            );
          })}

          {/* Center root node */}
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
      </svg>
      <figcaption>
        Orbital mind map. The six top-level branches fan around the center
        on concentric depth rings; sub-branches extend outward in their
        wedge, color-coded by branch. Hover a node to highlight its path
        to the center and the subtree beneath it.
      </figcaption>
    </figure>
  );
}

// Wrap long center titles onto multiple lines for the center block.
function wrapCenterLabel(title: string): string[] {
  // Prefer splitting at " in " or the first natural break
  if (title.length <= 26) return [title];
  const inIdx = title.indexOf(' in ');
  if (inIdx > 0 && inIdx < 28) {
    return [title.slice(0, inIdx), title.slice(inIdx + 1)];
  }
  const words = title.split(' ');
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
}
