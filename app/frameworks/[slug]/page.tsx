import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { JsonLd } from '@/components/json-ld';
import { getAllFrameworks, getFrameworkBySlug } from '@/lib/frameworks';
import {
  breadcrumbListSchema,
  definedTermSchema,
  graph,
} from '@/lib/seo';

type RouteParams = { slug: string };

export async function generateStaticParams() {
  const frameworks = await getAllFrameworks();
  return frameworks.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);
  if (!framework) return {};
  const description = framework.description ?? framework.definition;
  return {
    title: framework.title,
    description,
    keywords: framework.keywords,
    alternates: { canonical: framework.href },
    openGraph: {
      type: 'article',
      url: framework.href,
      title: framework.title,
      description,
      ...(framework.ogImage ? { images: [{ url: framework.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: framework.title,
      description,
      ...(framework.ogImage ? { images: [framework.ogImage] } : {}),
    },
  };
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const filePath = path.join(
    process.cwd(),
    'content',
    'frameworks',
    `${slug}.mdx`,
  );
  try {
    await fs.access(filePath);
  } catch {
    notFound();
  }

  const framework = await getFrameworkBySlug(slug);
  if (!framework) notFound();

  const mod = await import(`@/content/frameworks/${slug}.mdx`);
  const MDXContent = mod.default;

  const termSchema = definedTermSchema({
    href: framework.href,
    name: framework.title,
    description: framework.description ?? framework.definition,
    alternateName: framework.shortName,
  });
  const crumbs = breadcrumbListSchema([
    { name: 'Home', href: '/' },
    { name: 'Frameworks', href: '/frameworks' },
    { name: framework.title, href: framework.href },
  ]);

  return (
    <article className="essay">
      <JsonLd data={graph(termSchema, crumbs)} />
      <header>
        <div className="essay-meta">
          <Link href="/frameworks">← Frameworks</Link>
        </div>
        <h1>{framework.title}</h1>
        {framework.shortName ? (
          <p className="subtitle">Also: {framework.shortName}</p>
        ) : null}
      </header>
      <MDXContent />
    </article>
  );
}
