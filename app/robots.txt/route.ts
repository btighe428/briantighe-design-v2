import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export async function GET() {
  const lines: string[] = [];

  for (const bot of siteConfig.llmCrawlers) {
    lines.push(`User-agent: ${bot}`);
    lines.push('Allow: /');
    lines.push('');
  }

  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('');
  lines.push(`Sitemap: ${siteConfig.url}/sitemap.xml`);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
