import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = 'Frameworks — Brian Tighe';

export default async function OG() {
  return renderOgImage({
    eyebrow: 'FRAMEWORKS',
    title: 'Canonical definitions',
    subtitle: 'The frameworks practiced on briantighe.design.',
  });
}
