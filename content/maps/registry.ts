import type { MapData } from './types';

export type MapCatalogEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  summary: string;
  status: 'published' | 'drafting' | 'planned';
  load?: () => Promise<{ map: MapData }>;
};

// The Mind Maps series. Each entry corresponds to a topic covered in
// Brian's 2024 PREVIEW PDF. As each is encoded as structured data it
// graduates from 'planned' to 'published' and gains a load() function.
export const catalog: MapCatalogEntry[] = [
  {
    slug: 'ux-design',
    title: 'Contemporary Topics in User Experience Design',
    subtitle: 'Principles, methods, tools, trends, challenges, directions',
    date: '2024-06-01',
    summary:
      'Six branches the UX field currently organizes around — principles, research methods, tools, emerging trends, challenges, and future directions — with three to four levels of nesting under each.',
    status: 'published',
    load: () =>
      import('./ux-design').then((m) => ({ map: m.map })),
  },
  {
    slug: 'venture-capital',
    title: 'Contemporary Topics in Venture Capital',
    subtitle: 'Six branches — emerging areas, strategies, players, risks, advancements, outlook',
    date: '2026-04-19',
    summary:
      'Expanded mind map of contemporary venture capital as it stands in 2026. Six branches and ~150 named facts: AI + climate + bio + defense emerging areas; stage-focused, thesis-driven, alternative-structure, and specialized strategies; legacy + growth + ascendant + solo players; valuation, regulatory, exit, and LP risks; AI deal sourcing, portfolio tooling, data platforms, and on-chain structures; AI-native firms, geographic diffusion, evolving fund structures, and power-law dynamics.',
    status: 'published',
    load: () =>
      import('./venture-capital').then((m) => ({ map: m.map })),
  },
  {
    slug: 'apple-inc',
    title: 'Apple Inc.',
    subtitle: 'Founding philosophy through future speculations',
    date: '2024-07-01',
    summary:
      'Apple as a mind map: founding and philosophy, product innovation, software innovation, services and ecosystem, sustainability and social responsibility, and future trends.',
    status: 'planned',
  },
  {
    slug: 'silicon-valley-history',
    title: 'Silicon Valley Innovation History',
    subtitle: 'Seven eras, 1900–2030 — radio tubes to post-AGI economies',
    date: '2026-04-19',
    summary:
      'Expanded mind map across seven eras of Silicon Valley — radio origins (1900–1955), the Semiconductor Era (1955–75), Microprocessor + PC (1971–95), Internet + Dot-Com (1993–2007), Mobile + Social (2007–20), the AI Era (2015–26), and the 2020–2030 future-and-challenges horizon. ~200 named facts.',
    status: 'published',
    load: () =>
      import('./silicon-valley-history').then((m) => ({ map: m.map })),
  },
  {
    slug: 'thomas-edison',
    title: 'Thomas Edison and Innovation',
    subtitle: 'Early life, inventions, ventures, impact, controversies, legacy',
    date: '2024-08-01',
    summary:
      'Edison as a mind map across six dimensions: early life, major inventions, business ventures and partnerships, impact on technology and society, challenges and controversies, legacy and recognition.',
    status: 'planned',
  },
  {
    slug: 'history-of-innovation',
    title: 'The History of Innovation',
    subtitle: 'Seven epochs from pre-industrial foundations through 2026 plus the theory',
    date: '2026-04-19',
    summary:
      'Expanded mind map of innovation across human history: pre-industrial foundations (pre-1760), First Industrial Revolution (1760–1840), Second Industrial Revolution (1870–1914), 20th-century science and engineering (1914–1970), Information Age (1970–2010), Contemporary Era (2010–2026), and the theoretical patterns (Kondratieff, Schumpeter, Christensen, S-curves, combinatorial innovation) that organize the whole.',
    status: 'published',
    load: () =>
      import('./history-of-innovation').then((m) => ({ map: m.map })),
  },
];

export function findCatalogEntry(slug: string): MapCatalogEntry | undefined {
  return catalog.find((c) => c.slug === slug);
}

export function publishedSlugs(): string[] {
  return catalog.filter((c) => c.status === 'published').map((c) => c.slug);
}
