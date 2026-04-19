# briantighe.design V2

A Tufte-maximalist thought-leadership site for Brian Tighe, Principal Product Designer at Yahoo Mail. Established as the flagship demonstration of the category _design engineering for growth_, and engineered as a world-class SEO property.

## Operating principle

The site is an argument made in code. Every addition is measured against whether it serves one of three ends: publishing a new essay, distributing an existing one, or making the reading experience better. SEO is treated as a first-class concern rather than a bolt-on — structured data, crawl paths, and rich-result eligibility are part of the design system, not an afterthought.

## Stack

- Next.js 16 (App Router, Turbopack)
- MDX for content (`@next/mdx`) with YAML frontmatter (`remark-frontmatter` + `remark-mdx-frontmatter`)
- Tailwind v4 utility layer with CSS-first theme tokens in `app/globals.css`
- ET Book self-hosted (`/public/fonts/`) as the primary serif — preloaded in the root layout
- File-based content in `/content/essays/[year]/[slug].mdx` and `/content/frameworks/[slug].mdx`; no CMS
- Vercel deployment via Git push to `v2.briantighe.design`
- Analytics: Vercel Analytics + Speed Insights
- Newsletter: Resend (contacts API + transactional send)

## SEO layer

- **Structured data** — a cross-linked JSON-LD `@graph` on every route: `Person`, `Organization`, `WebSite` site-wide; `Article` + `BreadcrumbList` + `SpeakableSpecification` on essays; `CollectionPage` + `BreadcrumbList` on indexes; `DefinedTerm` + `DefinedTermSet` on frameworks; `AboutPage` + `FAQPage` on `/about`; `TechArticle` on `/colophon`. Nodes are cross-linked via `@id`, wired through `lib/seo.ts`.
- **Dynamic OpenGraph images** — per-essay, per-framework, per-tag 1200×630 PNGs via `next/og` with a serif card; falls back to a site default.
- **Feeds** — RSS 2.0 (`/feed.xml`), Atom 1.0 (`/atom.xml`), JSON Feed 1.1 (`/feed.json`), all with full `content:encoded`.
- **Sitemaps** — `/sitemap.xml` with `<image:image>` for every essay, framework, and tag page; human-readable `/sitemap` for navigation; `/robots.txt` with an explicit allow-list for GPTBot, Claude-Web, PerplexityBot, ClaudeBot, Google-Extended, CCBot, and anthropic-ai.
- **Search** — server-rendered `/search?q=` across essays and frameworks; `SearchAction` in `WebSite` schema unlocks Google sitelinks search box.
- **Content IA** — year archive (`/essays/[year]`), tag archive (`/tags/[slug]`), framework hubs (`/frameworks/[slug]`), colophon, sitemap, about, custom 404 — all indexed and internally linked.
- **Microformats** — h-card + `rel=me` on `/about`, `rel=author` site-wide, Schema.org microdata on the author block and inline citations.
- **Security headers** — HSTS, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy, immutable fonts cache.
- **Verification** — Google Search Console + Bing verification via env vars.

## Repo map

    app/
    ├── layout.tsx                Root shell, metadata, fonts, JSON-LD graph
    ├── page.tsx                  Homepage
    ├── globals.css               Tailwind + theme tokens + reset
    ├── typography.css            Tufte typography system
    ├── about/                    Author page (Person + FAQPage schema)
    ├── colophon/                 Stack, typography, discipline
    ├── essays/                   Index + /[year]/ archive + /[year]/[slug]/
    ├── frameworks/               Framework index + /[slug]/ hubs
    ├── tags/                     Tag index + /[slug]/ archives
    ├── search/                   Full-text search (?q=)
    ├── experiments/              Placeholder index + [slug]
    ├── work/                     Placeholder index + [slug]
    ├── api/
    │   └── subscribe/            Resend newsletter signup handler
    ├── feed.xml/                 RSS feed
    ├── feed.json/                JSON Feed 1.1
    ├── atom.xml/                 Atom 1.0
    ├── sitemap.xml/              XML sitemap with <image:image>
    ├── sitemap/                  Human-readable sitemap
    ├── robots.txt/               LLM-permissive allow list
    ├── humans.txt/               Team / thanks / stack
    ├── site.webmanifest/         PWA manifest
    ├── opengraph-image.tsx       Site default OG
    └── not-found.tsx             Custom 404 with useful links
    components/                   Tufte + SEO components
    ├── json-ld.tsx               <script type="application/ld+json">
    ├── ref.tsx                   Inline citations (rel=cite)
    ├── newsletter-form.tsx       Progressive-enhancement signup form
    ├── essay-layout.tsx          Header, related, prev/next, tag chips
    ├── sidenote.tsx              Tufte sidenotes
    ├── margin-figure.tsx, ...
    content/
    ├── essays/[year]/*.mdx       Essay sources (frontmatter: title, date,
    │                             tags, section, related, keywords, ogImage,
    │                             canonical, updated, description, ...)
    └── frameworks/*.mdx          Framework definitions
    lib/
    ├── content.ts                Essay loader, tags, reading time, related
    ├── frameworks.ts             Framework loader
    ├── mdx.ts                    Remark/rehype pipeline
    ├── og.tsx                    ImageResponse renderer + font loading
    ├── seo.ts                    JSON-LD builders
    └── site-config.ts            Single source of truth
    public/fonts/                 ET Book WOFF2
    scripts/new-essay.mjs         CLI scaffolder

## Environment variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Resend API key for newsletter signup | if using newsletter |
| `RESEND_AUDIENCE_ID` | Resend audience to add contacts to | optional |
| `NEWSLETTER_FROM_EMAIL` | From address for welcome email | optional (defaults to `hello@briantighe.design`) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification code | for GSC claim |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing verification code | for Bing Webmaster Tools |
| `NEXT_PUBLIC_WEBMENTION_ENDPOINT` | Webmention.io endpoint URL | optional |
| `NEXT_PUBLIC_PINGBACK_ENDPOINT` | Pingback endpoint URL | optional |

## Develop

    npm run dev

Open http://localhost:3000. The flagship essay is at `/essays/2026/prototype-led-positioning`.

## New essay

    node scripts/new-essay.mjs "Essay Title"

Creates `content/essays/<current-year>/<slug>.mdx` with populated frontmatter and `draft: true`. Flip to `draft: false` to publish. The scaffolder includes SEO fields (`tags`, `section`, `keywords`, `ogImage`, `canonical`, `related`, `updated`).

## Build

    npm run build

Zero warnings expected. All routes statically generated except `/api/subscribe` (runtime) and `/search` (dynamic because of `?q`).

## Deploy

    git push

Vercel handles the rest.

## A note on small caps

ET Book's public repo ships five weights — roman (lf/osf), italic, bold, semi-bold — but does not include a dedicated small-caps font file. The typography system requests small caps via `font-feature-settings: 'smcp'` on the Roman OSF variant, matching the canonical `tufte-css` approach. Glyphs render from the font's OpenType `smcp` feature where present; browsers synthesize where not.
