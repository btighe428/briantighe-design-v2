import { getAllEssays } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export async function GET() {
  const essays = await getAllEssays();

  const staticUrls = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/essays', changefreq: 'weekly', priority: '0.9' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/experiments', changefreq: 'monthly', priority: '0.6' },
    { loc: '/work', changefreq: 'monthly', priority: '0.6' },
  ];

  const essayUrls = essays.map((e) => ({
    loc: e.href,
    lastmod: new Date(e.date).toISOString(),
    changefreq: 'yearly',
    priority: '0.8',
  }));

  const all = [...staticUrls, ...essayUrls];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...all.map((u) =>
      [
        '<url>',
        `<loc>${siteConfig.url}${u.loc}</loc>`,
        'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '',
        `<changefreq>${u.changefreq}</changefreq>`,
        `<priority>${u.priority}</priority>`,
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
