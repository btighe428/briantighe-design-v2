import { notFound } from 'next/navigation';
import { getAllFrameworks, getFrameworkBySlug } from '@/lib/frameworks';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const runtime = 'nodejs';
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;
export const alt = 'briantighe.design framework';

export async function generateStaticParams() {
  const frameworks = await getAllFrameworks();
  return frameworks.map((f) => ({ slug: f.slug }));
}

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);
  if (!framework) notFound();

  return renderOgImage({
    eyebrow: 'FRAMEWORK',
    title: framework.title,
    subtitle: framework.definition,
  });
}
