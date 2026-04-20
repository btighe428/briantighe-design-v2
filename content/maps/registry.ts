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
    subtitle: 'Emerging areas, strategies, players, risks, advancements, outlook',
    date: '2024-06-15',
    summary:
      'The six-branch shape of contemporary venture capital: emerging investment areas, investment strategies, key players, challenges and risks, technological advancements, and future outlook.',
    status: 'planned',
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
    subtitle: 'Origins through The Future of Silicon Valley',
    date: '2024-07-15',
    summary:
      'Five eras of Silicon Valley — early innovators, the microprocessor revolution, the Internet and dot-com boom, modern technological advances, and the future of the region.',
    status: 'planned',
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
];

export function findCatalogEntry(slug: string): MapCatalogEntry | undefined {
  return catalog.find((c) => c.slug === slug);
}

export function publishedSlugs(): string[] {
  return catalog.filter((c) => c.status === 'published').map((c) => c.slug);
}
