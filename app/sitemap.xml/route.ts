import { getAllEssays } from '@/lib/content';
import { getAllFrameworks } from '@/lib/frameworks';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

type Entry = {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
  image?: { loc: string; title?: string };
};

export async function GET() {
  const essays = await getAllEssays();
  const frameworks = await getAllFrameworks();
  const years = Array.from(new Set(essays.map((e) => e.year)));

  const staticUrls: Entry[] = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/essays', changefreq: 'weekly', priority: '0.9' },
    { loc: '/frameworks', changefreq: 'monthly', priority: '0.9' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/sitemap', changefreq: 'monthly', priority: '0.4' },
    { loc: '/experiments', changefreq: 'monthly', priority: '0.6' },
    { loc: '/work', changefreq: 'monthly', priority: '0.6' },
  ];

  const yearUrls: Entry[] = years.map((year) => ({
    loc: `/essays/${year}`,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const frameworkUrls: Entry[] = frameworks.map((f) => ({
    loc: f.href,
    lastmod: f.updated ? new Date(f.updated).toISOString() : undefined,
    changefreq: 'monthly',
    priority: '0.85',
    image: {
      loc: `${siteConfig.url}${f.href}/opengraph-image`,
      title: f.title,
    },
  }));

  const essayUrls: Entry[] = essays.map((e) => ({
    loc: e.href,
    lastmod: new Date(e.updated ?? e.date).toISOString(),
    changefreq: 'yearly',
    priority: '0.8',
    image: {
      loc: e.ogImage
        ? `${siteConfig.url}${e.ogImage}`
        : `${siteConfig.url}${e.href}/opengraph-image`,
      title: e.title,
    },
  }));

  const all = [...staticUrls, ...yearUrls, ...frameworkUrls, ...essayUrls];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...all.map((u) =>
      [
        '<url>',
        `<loc>${siteConfig.url}${u.loc}</loc>`,
        u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '',
        `<changefreq>${u.changefreq}</changefreq>`,
        `<priority>${u.priority}</priority>`,
        u.image
          ? [
              '<image:image>',
              `<image:loc>${u.image.loc}</image:loc>`,
              u.image.title ? `<image:title>${u.image.title}</image:title>` : '',
              '</image:image>',
            ]
              .filter(Boolean)
              .join('')
          : '',
        '</url>',
      ]
        .filter(Boolean)
        .join(''),
    ),
    '</urlset>',
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
