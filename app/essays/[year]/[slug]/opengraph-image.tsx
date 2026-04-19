import { notFound } from 'next/navigation';
import { formatDate, getAllEssays, getEssayBySlug } from '@/lib/content';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = 'briantighe.design essay';

export async function generateStaticParams() {
  const essays = await getAllEssays();
  return essays.map((e) => ({ year: e.year, slug: e.slug }));
}

export default async function OG({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const essay = await getEssayBySlug(year, slug);
  if (!essay) notFound();

  return renderOgImage({
    eyebrow: 'ESSAY',
    title: essay.title,
    subtitle: essay.subtitle ?? essay.description,
    date: formatDate(essay.date),
  });
}
