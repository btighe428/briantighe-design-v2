import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { EssayLayout } from '@/components/essay-layout';
import { getAllEssays, getEssayBySlug } from '@/lib/content';
import type { EssaySummary } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';

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

function essayJsonLd(essay: EssaySummary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: essay.title,
    description: essay.description ?? essay.subtitle ?? '',
    datePublished: new Date(essay.date).toISOString(),
    dateModified: new Date(essay.date).toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      jobTitle: siteConfig.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${essay.href}`,
    },
    inLanguage: 'en-US',
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(essayJsonLd(essay)),
        }}
      />
      <EssayLayout metadata={essay}>
        <MDXContent />
      </EssayLayout>
    </>
  );
}
