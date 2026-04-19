import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { EssayLayout } from '@/components/essay-layout';
import { JsonLd } from '@/components/json-ld';
import { getAllEssays, getEssayBySlug } from '@/lib/content';
import {
  articleSchema,
  breadcrumbListSchema,
  graph,
} from '@/lib/seo';

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
  const description = essay.description ?? essay.subtitle;
  const published = new Date(essay.date).toISOString();
  const modified = new Date(essay.updated ?? essay.date).toISOString();
  return {
    title: essay.title,
    description,
    keywords: essay.keywords ?? essay.tags,
    alternates: { canonical: essay.canonical ?? essay.href },
    openGraph: {
      type: 'article',
      url: essay.canonical ?? essay.href,
      title: essay.title,
      description,
      publishedTime: published,
      modifiedTime: modified,
      authors: [`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/about`],
      section: 'Essays',
      tags: essay.keywords ?? essay.tags,
      ...(essay.ogImage ? { images: [{ url: essay.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.title,
      description,
      ...(essay.ogImage ? { images: [essay.ogImage] } : {}),
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

  const breadcrumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Essays', href: '/essays' },
    { name: essay.title, href: essay.href },
  ]);

  return (
    <>
      <JsonLd data={graph(articleSchema(essay), breadcrumbs)} />
      <EssayLayout metadata={essay}>
        <MDXContent />
      </EssayLayout>
    </>
  );
}
