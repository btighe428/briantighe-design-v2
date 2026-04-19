import { getAllEssays, rfc822 } from '@/lib/content';
import { markdownToHtml } from '@/lib/mdx';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<'
      ? '&lt;'
      : c === '>'
        ? '&gt;'
        : c === '&'
          ? '&amp;'
          : c === "'"
            ? '&apos;'
            : '&quot;',
  );
}

export async function GET() {
  const essays = await getAllEssays();
  const items = await Promise.all(
    essays.map(async (essay) => {
      const bodyHtml = await markdownToHtml(essay.body);
      const url = `${siteConfig.url}${essay.href}`;
      const description = essay.description ?? essay.subtitle ?? '';
      return [
        '<item>',
        `<title>${escapeXml(essay.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${rfc822(essay.date)}</pubDate>`,
        `<dc:creator><![CDATA[${siteConfig.author.name}]]></dc:creator>`,
        `<description><![CDATA[${description}]]></description>`,
        `<content:encoded><![CDATA[${bodyHtml}]]></content:encoded>`,
        '</item>',
      ].join('');
    }),
  );

  const lastBuild = essays[0]?.date
    ? rfc822(essays[0].date)
    : new Date().toUTCString();

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" ',
    'xmlns:content="http://purl.org/rss/1.0/modules/content/" ',
    'xmlns:dc="http://purl.org/dc/elements/1.1/" ',
    'xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(siteConfig.name)} — Essays</title>`,
    `<link>${siteConfig.url}</link>`,
    `<description>${escapeXml(siteConfig.description)}</description>`,
    '<language>en-us</language>',
    `<lastBuildDate>${lastBuild}</lastBuildDate>`,
    `<atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
