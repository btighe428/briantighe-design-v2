import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getMethodologyBySlug,
  getAllMethodologySlugs,
} from '@/lib/content';

type RouteParams = { slug: string };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllMethodologySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getMethodologyBySlug(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — Methodology`,
    alternates: { canonical: `/methodology/${slug}` },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const meta = await getMethodologyBySlug(slug);
  if (!meta) notFound();

  const mod = await import(`@/content/methodology/${slug}.mdx`);
  const MDXContent = mod.default;

  return (
    <article className="methodology-page">
      <header style={{ marginBottom: '2rem' }}>
        <p className="label">Methodology</p>
        <h1>{meta.title}</h1>
        <p className="subtitle">
          For{' '}
          <a href={`/essays/${meta.essayYear}/${meta.essaySlug}`}>
            the corresponding essay
          </a>
          .
        </p>
      </header>
      <MDXContent />
    </article>
  );
}
