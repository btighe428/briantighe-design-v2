# briantighe.design V2

A Tufte-maximalist thought-leadership site for Brian Tighe, Principal Product Designer at Yahoo Mail. Established as the flagship demonstration of the category _design engineering for growth_.

## Commitment document

I commit to keeping briantighe.design's generator footprint under 2,000 lines of code across all TypeScript and CSS, excluding runtime dependencies. Any feature that cannot be implemented in under 100 lines defaults to "no" unless it is load-bearing for publishing or distribution. I will not add: tag systems, taxonomies, comment systems, reading-time estimators, related-post algorithms, search (until essay count exceeds 50), analytics beyond Vercel's native, draft preview environments, or webmention support. If I need any of these in the future, I will use an off-the-shelf tool rather than build it into the system.

## Stack

- Next.js (App Router, self-installed via `create-next-app@latest`)
- MDX for content (`@next/mdx`) with YAML frontmatter (`remark-frontmatter` + `remark-mdx-frontmatter`)
- Tailwind v4 utility layer with CSS-first theme tokens in `app/globals.css`
- ET Book self-hosted (`/public/fonts/`) as the primary serif
- File-based content in `/content/essays/[year]/[slug].mdx`; no CMS
- Vercel deployment via Git push to `v2.briantighe.design`

## Repo map

    app/                          Routes (App Router)
    ├── layout.tsx                Root shell, metadata, fonts
    ├── page.tsx                  Homepage
    ├── globals.css               Tailwind + theme tokens + reset
    ├── typography.css            Tufte typography system (the crown jewel)
    ├── essays/                   Essay index + dynamic route
    ├── experiments/              Placeholder index + [slug]
    ├── work/                     Placeholder index + [slug]
    ├── feed.xml/                 RSS feed (full <content:encoded>)
    ├── sitemap.xml/              Sitemap generated from MDX
    └── robots.txt/               Permissive for LLM crawlers
    components/                   Tufte components (Sidenote, Epigraph, etc.)
    content/essays/[year]/*.mdx   Essay sources
    lib/                          content.ts, mdx.ts, site-config.ts
    public/fonts/                 ET Book WOFF2
    scripts/new-essay.mjs         CLI scaffolder

## Develop

    npm run dev

Open http://localhost:3000. The flagship essay is at `/essays/2026/prototype-led-positioning`.

## New essay

    node scripts/new-essay.mjs "Essay Title"

Creates `content/essays/<current-year>/<slug>.mdx` with populated frontmatter and `draft: true`. Flip to `draft: false` to publish.

## Build

    npm run build

Zero warnings expected.

## A note on small caps

ET Book's public repo ships five weights — roman (lf/osf), italic, bold, semi-bold — but does not include a dedicated small-caps font file. The typography system requests small caps via `font-feature-settings: 'smcp'` on the Roman OSF variant, matching the canonical `tufte-css` approach. Glyphs render from the font's OpenType `smcp` feature where present; browsers synthesize where not.

## Deploy

    git push # Vercel handles the rest.
