import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'frameworks');

export type FrameworkFrontmatter = {
  title: string;
  shortName?: string;
  definition: string;
  description?: string;
  updated?: string;
  keywords?: string[];
  ogImage?: string;
  draft?: boolean;
};

export type Framework = FrameworkFrontmatter & {
  slug: string;
  href: string;
  body: string;
};

export async function getAllFrameworks(): Promise<Framework[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const items: Framework[] = [];
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx$/, '');
    const fw = await getFrameworkBySlug(slug);
    if (fw && !fw.draft) items.push(fw);
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

export async function getFrameworkBySlug(
  slug: string,
): Promise<Framework | null> {
  const filePath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const frontmatter = data as FrameworkFrontmatter;
  return {
    ...frontmatter,
    slug,
    href: `/frameworks/${slug}`,
    body: content,
  };
}
