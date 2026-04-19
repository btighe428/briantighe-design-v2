import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = siteConfig.title;

export default async function OG() {
  return renderOgImage({
    eyebrow: 'briantighe.design',
    title: siteConfig.author.name,
    subtitle:
      'Essays on design engineering for growth, prototype-led positioning, and the craft of shippable ideas.',
  });
}
