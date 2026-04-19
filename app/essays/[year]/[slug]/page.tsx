import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { EssayLayout } from '@/components/essay-layout';
import { getAllEssays, getEssayBySlug } from '@/lib/content';

type RouteParams = { year: string; slug: string };

export async function generateStaticParams() {
  const essays = await getAllEssays();
  return essays.map((e) => ({ year: e.year, slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const essay = await getEssayBySlug(year, slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.description ?? essay.subtitle,
    alternates: { canonical: essay.href },
    openGraph: {
      type: 'article',
      title: essay.title,
      description: essay.description ?? essay.subtitle,
      publishedTime: new Date(essay.date).toISOString(),
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { year, slug } = await params;

  const filePath = path.join(
    process.cwd(),
    'content',
    'essays',
    year,
    `${slug}.mdx`,
  );
  try {
    await fs.access(filePath);
  } catch {
    notFound();
  }

  const essay = await getEssayBySlug(year, slug);
  if (!essay) notFound();

  const mod = await import(`@/content/essays/${year}/${slug}.mdx`);
  const MDXContent = mod.default;

  return (
    <EssayLayout metadata={essay}>
      <MDXContent />
    </EssayLayout>
  );
}
