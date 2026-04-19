import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export async function GET() {
  const body = [
    '/* TEAM */',
    `${siteConfig.author.name}`,
    `  Role:     ${siteConfig.author.role}`,
    `  Site:     ${siteConfig.url}`,
    `  Contact:  ${siteConfig.author.email}`,
    `  LinkedIn: https://www.linkedin.com/in/briantighe/`,
    `  X:        https://x.com/btighe428`,
    `  GitHub:   https://github.com/btighe428`,
    '',
    '/* THANKS */',
    'Edward Tufte — typography system descends from his work.',
    'tufte-css.github.io — the reference implementation.',
    'gwern.net — for showing what long-form compounding looks like.',
    '',
    '/* SITE */',
    `Last update:  ${new Date().toISOString().slice(0, 10)}`,
    'Standards:    HTML5, CSS3, JSON-LD, RSS, Atom, JSON Feed,',
    '              h-card, h-entry, OpenGraph, Twitter Card.',
    'Components:   Next.js App Router, MDX, Tailwind v4, ET Book.',
    'Hosted:       Vercel.',
    'IDE:          neovim, VS Code.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
