#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const slug = process.argv[2];
const allowStale = process.argv.includes('--allow-stale');

if (!slug) {
  console.error('Usage: node scripts/bake-data.mjs <slug> [--allow-stale]');
  process.exit(1);
}

const url = process.env.GAP_DATA_URL;
const token = process.env.GAP_DATA_TOKEN;
if (!url || !token) {
  console.error('GAP_DATA_URL and GAP_DATA_TOKEN must be set in .env.local');
  process.exit(1);
}

console.log(`Baking ${slug}...`);

const res = await fetch(`${url}?weeks=52`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();

const snapshotAge = Date.now() - new Date(data.snapshotDate).getTime();
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
if (snapshotAge > THIRTY_DAYS && !allowStale) {
  console.error(
    `Snapshot is ${Math.round(snapshotAge / 86_400_000)} days old. Pass --allow-stale to proceed.`,
  );
  process.exit(1);
}

const year = new Date(data.snapshotDate).getUTCFullYear();
const outDir = path.join(process.cwd(), 'content/data', String(year));
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.json`);
await fs.writeFile(outPath, JSON.stringify(data, sortReplacer, 2) + '\n');

console.log(`Wrote ${outPath}`);
console.log(`  snapshotDate: ${data.snapshotDate}`);
console.log(`  totalPosts: ${data.totalPosts}`);
console.log(`  totalJds: ${data.totalJds}`);
console.log(`  rows: ${data.rows.length}`);
console.log(`  excluded: ${data.excluded.length}`);

function sortReplacer(_key, value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = value[k];
        return acc;
      }, {});
  }
  return value;
}
