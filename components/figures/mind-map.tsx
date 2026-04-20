'use client';

import { useMemo, useState } from 'react';
import { hierarchy, tree } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';
import type { MapData, MapNode } from '@/content/maps/types';

const W = 2800;
const H = 2200;
const CX = W / 2;
const CY = H / 2;
const DEPTH_STEP = 340;
const NODE_GAP = 58;

type PositionedNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  depth: number;
  branchIndex: number;
  path: string[]; // chain of ids from root
};

function compute(
  data: MapData,
): { nodes: PositionedNode[]; links: { source: PositionedNode; target: PositionedNode; branchIndex: number }[] } {
  const rootChildren = data.root.children ?? [];
  const half = Math.ceil(rootChildren.length / 2);
  const rightBranches = rootChildren.slice(0, half);
  const leftBranches = rootChildren.slice(half);

  const allNodes: PositionedNode[] = [];
  const allLinks: { source: PositionedNode; target: PositionedNode; branchIndex: number }[] = [];

  const rootNode: PositionedNode = {
    id: 'root',
    label: data.root.label,
    x: CX,
    y: CY,
    depth: 0,
    branchIndex: -1,
    path: [],
  };
  allNodes.push(rootNode);

  function layoutSide(
    branches: MapNode[],
    direction: 1 | -1,
    branchOffset: number,
  ) {
    const sideRoot: MapNode = { label: 'side-root', children: branches };
    const rootH = hierarchy(sideRoot);
    const layout = tree<MapNode>().nodeSize([NODE_GAP, DEPTH_STEP]);
    const laid = layout(rootH);

    // Center the side vertically around CY
    const values = laid.descendants().map((d) => d.x);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mid = (min + max) / 2;

    laid.each((d) => {
      if (d.depth === 0) return; // virtual side-root; skip
      const depth = d.depth;
      const branchIndex = branchOffset + (d.ancestors().slice(-2)[0].parent?.children?.indexOf(d.ancestors().slice(-2)[0]) ?? 0);
      // ancestors()[0] is the node itself; ancestors.last is side-root
      // The branch-level ancestor (depth 1 under side-root) tells us branch index
      const ancestors = d.ancestors();
      const branchAncestor = ancestors[ancestors.length - 2];
      const actualBranchIndex =
        branchOffset + (sideRoot.children!.indexOf(branchAncestor.data as MapNode));

      const pathIds: string[] = [];
      ancestors.slice(0, -1).reverse().forEach((a) => pathIds.push((a as any).__id ?? a.data.label));

      const svgX = CX + direction * (depth * DEPTH_STEP);
      const svgY = CY + (d.x - mid);

      const node: PositionedNode = {
        id: `${direction === 1 ? 'r' : 'l'}-${depth}-${d.data.label}-${svgY.toFixed(0)}`,
        label: d.data.label,
        x: svgX,
        y: svgY,
        depth,
        branchIndex: actualBranchIndex,
        path: [],
      };
      (d as any).__positioned = node;
      allNodes.push(node);

      if (d.parent && d.parent.depth >= 1) {
        const parentNode = (d.parent as any).__positioned as PositionedNode;
        if (parentNode) {
          allLinks.push({
            source: parentNode,
            target: node,
            branchIndex: actualBranchIndex,
          });
        }
      } else if (d.depth === 1) {
        // link from center root to this branch
        allLinks.push({
          source: rootNode,
          target: node,
          branchIndex: actualBranchIndex,
        });
      }
    });
  }

  layoutSide(rightBranches, 1, 0);
  layoutSide(leftBranches, -1, rightBranches.length);

  // Build ancestor paths
  const byId = new Map(allNodes.map((n) => [n.id, n]));
  for (const link of allLinks) {
    // stitch ancestry
    link.target.path = [...link.source.path, link.source.id];
  }

  return { nodes: allNodes, links: allLinks };
}

export function MindMap({ data }: { data: MapData }) {
  const { nodes, links } = useMemo(() => compute(data), [data]);
  const [hovered, setHovered] = useState<PositionedNode | null>(null);

  const hoveredAncestry = hovered ? new Set([hovered.id, ...hovered.path]) : null;

  const linkGen = linkHorizontal<
    { source: PositionedNode; target: PositionedNode },
    PositionedNode
  >()
    .x((n) => n.x)
    .y((n) => n.y);

  return (
    <figure className="mind-map-figure">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Mind map: ${data.title}`}
        style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'var(--font-serif)' }}
      >
        {/* Links */}
        {links.map((link, i) => {
          const color = data.branchColors[link.branchIndex] ?? 'var(--color-rule)';
          const active =
            hoveredAncestry?.has(link.target.id) || hoveredAncestry?.has(link.source.id);
          return (
            <path
              key={`link-${i}`}
              d={
                linkGen({
                  source: link.source,
                  target: link.target,
                }) ?? ''
              }
              fill="none"
              stroke={color}
              strokeOpacity={hovered ? (active ? 0.95 : 0.12) : 0.55}
              strokeWidth={link.target.depth === 1 ? 3 : link.target.depth === 2 ? 2 : 1.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          if (n.depth === 0) return null; // draw root last
          const color = data.branchColors[n.branchIndex] ?? 'var(--color-ink)';
          const active = hoveredAncestry?.has(n.id);
          const faded = hovered && !active;
          const isBranch = n.depth === 1;
          const isSubBranch = n.depth === 2;

          const fontSize = isBranch ? 28 : isSubBranch ? 20 : 16;
          const fontWeight = isBranch ? 600 : isSubBranch ? 500 : 400;

          // Determine text anchor by side
          const onRight = n.x >= CX;
          const textAnchor = onRight ? 'start' : 'end';
          const dx = onRight ? 12 : -12;

          return (
            <g
              key={n.id}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* hit target */}
              <rect
                x={n.x - 80}
                y={n.y - 14}
                width={160}
                height={28}
                fill="transparent"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={isBranch ? 9 : isSubBranch ? 6 : 3.5}
                fill={color}
                fillOpacity={faded ? 0.25 : 1}
              />
              <text
                x={n.x + dx}
                y={n.y + fontSize / 3}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fill={isBranch ? color : 'var(--color-ink)'}
                fillOpacity={faded ? 0.3 : 1}
                textAnchor={textAnchor}
                style={{
                  letterSpacing: isBranch ? '-0.005em' : '0',
                  transition: 'fill-opacity 120ms ease',
                }}
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Center root */}
        <g>
          <rect
            x={CX - 280}
            y={CY - 56}
            width={560}
            height={112}
            rx={10}
            fill="var(--color-ink)"
          />
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize={26}
            fontWeight={600}
            fill="var(--color-paper)"
          >
            {data.title.length > 40
              ? data.title.slice(0, data.title.indexOf(' in ')) || data.title.slice(0, 40)
              : data.title}
          </text>
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            fontSize={18}
            fill="var(--color-paper)"
            fillOpacity={0.75}
            style={{
              fontVariantCaps: 'all-small-caps',
              letterSpacing: '0.08em',
              fontFeatureSettings: "'smcp'",
            }}
          >
            Brian Tighe · Mind Maps
          </text>
        </g>
      </svg>
      <figcaption>
        Hover a node to highlight its path to the center. Six top-level
        branches, color-coded; nesting goes three levels deep under each.
      </figcaption>
    </figure>
  );
}
