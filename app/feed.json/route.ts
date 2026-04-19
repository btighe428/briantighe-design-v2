import { getAllEssays } from '@/lib/content';
import { markdownToHtml } from '@/lib/mdx';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export async function GET() {
  const essays = await getAllEssays();
  const items = await Promise.all(
    essays.map(async (essay) => {
      const html = await markdownToHtml(essay.body);
      const url = `${siteConfig.url}${essay.href}`;
      return {
        id: url,
        url,
        title: essay.title,
        summary: essay.description ?? essay.subtitle ?? '',
        content_html: html,
        date_published: new Date(essay.date).toISOString(),
        date_modified: new Date(essay.updated ?? essay.date).toISOString(),
        authors: [
          {
            name: siteConfig.author.name,
            url: siteConfig.url,
          },
        ],
        image: `${url}/opengraph-image`,
        tags: essay.keywords ?? essay.tags,
      };
    }),
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${siteConfig.name} — Essays`,
    home_page_url: siteConfig.url,
    feed_url: `${siteConfig.url}/feed.json`,
    description: siteConfig.description,
    language: 'en-US',
    authors: [
      {
        name: siteConfig.author.name,
        url: siteConfig.url,
      },
    ],
    icon: `${siteConfig.url}/favicon.svg`,
    items,
  };

  return new Response(JSON.stringify(feed), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
