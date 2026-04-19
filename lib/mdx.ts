import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import type { EssayFrontmatter } from './content';

let processor: ReturnType<typeof buildProcessor> | null = null;

function buildProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export async function markdownToHtml(body: string): Promise<string> {
  if (!processor) processor = buildProcessor();
  const file = await processor.process(body);
  return String(file)
    .replace(/\bclassName=/g, 'class=')
    .replace(/\btabIndex=/g, 'tabindex=')
    .replace(/\bhtmlFor=/g, 'for=');
}

export type { EssayFrontmatter };
