#!/usr/bin/env node
// Usage: node scripts/new-essay.mjs "Essay Title"
// Creates /content/essays/<year>/<slug>.mdx with populated frontmatter.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/new-essay.mjs "Essay Title"');
  process.exit(1);
}

const title = args.join(' ').trim();
const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

if (!slug) {
  console.error('Title produced an empty slug. Choose a different title.');
  process.exit(1);
}

const now = new Date();
const year = String(now.getFullYear());
const isoDate = now.toISOString().slice(0, 10);

const root = process.cwd();
const dir = path.join(root, 'content', 'essays', year);
const filePath = path.join(dir, `${slug}.mdx`);

await fs.mkdir(dir, { recursive: true });

try {
  await fs.access(filePath);
  console.error(`Already exists: ${filePath}`);
  process.exit(1);
} catch {
  // not found — good
}

const safeTitle = title.replace(/"/g, '\\"');

const content = `---
title: "${safeTitle}"
subtitle: ""
date: ${isoDate}
description: ""
epigraph: ""
epigraphAttribution: ""
dropCap: false
draft: true
---

Write here.
`;

await fs.writeFile(filePath, content, 'utf8');
console.log(`Created ${path.relative(root, filePath)}`);
