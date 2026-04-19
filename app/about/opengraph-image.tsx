import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = `About — ${siteConfig.author.name}`;

export default async function OG() {
  return renderOgImage({
    eyebrow: 'ABOUT',
    title: siteConfig.author.name,
    subtitle: siteConfig.author.role,
  });
}
