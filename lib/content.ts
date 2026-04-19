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
  section?: 'theory' | 'practice' | 'case-study' | 'field-notes';
  related?: string[];
  draft?: boolean;
};

const WPM = 265;

export function readingTime(body: string): { minutes: number; words: number } {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WPM));
  return { minutes, words };
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function iso8601Duration(minutes: number): string {
  return `PT${minutes}M`;
}

export async function getAllTags(): Promise<
  Array<{ tag: string; slug: string; count: number; essays: EssaySummary[] }>
> {
  const essays = await getAllEssays();
  const map = new Map<string, { tag: string; essays: EssaySummary[] }>();
  for (const essay of essays) {
    for (const tag of essay.tags ?? []) {
      const slug = tagSlug(tag);
      const entry = map.get(slug) ?? { tag, essays: [] };
      entry.essays.push(essay);
      map.set(slug, entry);
    }
  }
  return Array.from(map.entries())
    .map(([slug, { tag, essays }]) => ({
      slug,
      tag,
      count: essays.length,
      essays,
    }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function findRelated(
  current: EssaySummary,
  all: EssaySummary[],
  limit = 3,
): EssaySummary[] {
  const pool = all.filter((e) => e.slug !== current.slug);
  if (current.related?.length) {
    const explicit = current.related
      .map((ref) =>
        pool.find((e) => e.slug === ref || e.href === ref || ref.includes(e.slug)),
      )
      .filter((e): e is EssaySummary => Boolean(e));
    if (explicit.length >= limit) return explicit.slice(0, limit);
    const seen = new Set(explicit.map((e) => e.slug));
    const extras = tagOverlap(current, pool).filter((e) => !seen.has(e.slug));
    return [...explicit, ...extras].slice(0, limit);
  }
  return tagOverlap(current, pool).slice(0, limit);
}

function tagOverlap(
  current: EssaySummary,
  pool: EssaySummary[],
): EssaySummary[] {
  const currentTags = new Set((current.tags ?? []).map(tagSlug));
  if (currentTags.size === 0) return [];
  return pool
    .map((essay) => ({
      essay,
      overlap: (essay.tags ?? []).filter((t) => currentTags.has(tagSlug(t))).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return a.essay.date < b.essay.date ? 1 : -1;
    })
    .map((x) => x.essay);
}

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
