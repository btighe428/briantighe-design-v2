import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type EssayFrontmatter = {
  title: string;
  subtitle?: string;
  date: string;
  updated?: string;
  description?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  dropCap?: boolean;
  tags?: string[];
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  draft?: boolean;
};

export type EssaySummary = EssayFrontmatter & {
  year: string;
  slug: string;
  href: string;
  body: string;
};

export async function getAllEssays(): Promise<EssaySummary[]> {
  const essaysRoot = path.join(CONTENT_ROOT, 'essays');
  let years: string[] = [];
  try {
    years = await fs.readdir(essaysRoot);
  } catch {
    return [];
  }

  const essays: EssaySummary[] = [];
  for (const year of years) {
    const yearDir = path.join(essaysRoot, year);
    const stat = await fs.stat(yearDir);
    if (!stat.isDirectory()) continue;
    const files = await fs.readdir(yearDir);
    for (const file of files) {
      if (!file.endsWith('.mdx')) continue;
      const slug = file.replace(/\.mdx$/, '');
      const essay = await getEssayBySlug(year, slug);
      if (essay && !essay.draft) essays.push(essay);
    }
  }

  essays.sort((a, b) => (a.date < b.date ? 1 : -1));
  return essays;
}

export async function getEssayBySlug(
  year: string,
  slug: string,
): Promise<EssaySummary | null> {
  const filePath = path.join(CONTENT_ROOT, 'essays', year, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const frontmatter = data as EssayFrontmatter;
  return {
    ...frontmatter,
    date: String(frontmatter.date),
    year,
    slug,
    href: `/essays/${year}/${slug}`,
    body: content,
  };
}

export function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function rfc822(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toUTCString();
}
