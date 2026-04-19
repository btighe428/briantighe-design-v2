import { notFound } from 'next/navigation';
import { getAllTags } from '@/lib/content';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = 'briantighe.design tag';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tags = await getAllTags();
  const entry = tags.find((t) => t.slug === slug);
  if (!entry) notFound();

  return renderOgImage({
    eyebrow: 'TAG',
    title: entry.tag,
    subtitle: `${entry.count} ${entry.count === 1 ? 'essay' : 'essays'} on briantighe.design`,
  });
}
