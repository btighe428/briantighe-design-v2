import { getAllEssays } from '@/lib/content';
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
  const updated = essays[0]?.date
    ? new Date(essays[0].date).toISOString()
    : new Date().toISOString();

  const entries = await Promise.all(
    essays.map(async (essay) => {
      const html = await markdownToHtml(essay.body);
      const url = `${siteConfig.url}${essay.href}`;
      const published = new Date(essay.date).toISOString();
      const modified = new Date(essay.updated ?? essay.date).toISOString();
      const summary = essay.description ?? essay.subtitle ?? '';
      return [
        '<entry>',
        `<id>${escapeXml(url)}</id>`,
        `<title type="text">${escapeXml(essay.title)}</title>`,
        `<link rel="alternate" type="text/html" href="${escapeXml(url)}" />`,
        `<published>${published}</published>`,
        `<updated>${modified}</updated>`,
        `<summary type="text">${escapeXml(summary)}</summary>`,
        `<content type="html"><![CDATA[${html}]]></content>`,
        '<author>',
        `<name>${escapeXml(siteConfig.author.name)}</name>`,
        `<uri>${siteConfig.url}</uri>`,
        '</author>',
        '</entry>',
      ].join('');
    }),
  );

  const atom = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">',
    `<id>${siteConfig.url}/</id>`,
    `<title>${escapeXml(siteConfig.name)} — Essays</title>`,
    `<subtitle>${escapeXml(siteConfig.description)}</subtitle>`,
    `<link rel="alternate" type="text/html" href="${siteConfig.url}" />`,
    `<link rel="self" type="application/atom+xml" href="${siteConfig.url}/atom.xml" />`,
    `<updated>${updated}</updated>`,
    '<author>',
    `<name>${escapeXml(siteConfig.author.name)}</name>`,
    `<uri>${siteConfig.url}</uri>`,
    '</author>',
    ...entries,
    '</feed>',
  ].join('');

  return new Response(atom, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
