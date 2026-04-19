import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = 'Essays — Brian Tighe';

export default async function OG() {
  return renderOgImage({
    eyebrow: 'ESSAYS',
    title: 'Design engineering for growth',
    subtitle:
      'Essays on prototype-led positioning and the craft of shippable ideas.',
  });
}
