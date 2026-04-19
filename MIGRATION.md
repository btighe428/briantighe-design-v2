# Migration: Squarespace briantighe.design → V2

The operating plan for moving briantighe.design off Squarespace and onto the V2 platform while preserving the portfolio case studies that underwrite the "design engineering for growth" thesis.

## Strategic frame

The Squarespace site is a portfolio of ~15 case studies. Two of them — **HelloFresh** and **Daily Harvest** — are the receipts the distribution architecture keeps reaching for: the specific operator outcomes that make essays credible rather than speculative. The migration preserves these receipts inside V2's `/work` section while reframing the site as a thought-leadership platform with a portfolio proof, not a portfolio with thoughts attached.

**Non-negotiable:** Path B (root-swap + migrate portfolio) per DISTRIBUTION.md tradeoff table. Not Path A (subdomain split, dilutes authority) or Path C (drop portfolio, discards receipts).

## Inventory: what exists on briantighe.design today

Audited 2026-04-19. Squarespace-hosted. Page title `BT`, no meta description.

### Case studies (live at `/work/[slug]`)
- **Horizons**
- **HelloFresh** *(receipt-grade: the canonical growth-engineering example)*
- **Daily Harvest** *(receipt-grade)*
- **HelloNotifications**
- **Single Question Sign Up**
- **Boop / Petabyte (acquired by Chewy)**
- **First Place — Global Hackathon 2022**
- **Multi-preference Sign Up**
- `/work/fetch`, `/work/fl`, `/work/gen-ai`, `/work/loeb`, `/work/singlecare`, `/work/project-one-*` *(lower-shelf, review for inclusion)*

### Other pages
- `/` (homepage, H2: "Brian Tighe / Principal Product Designer + Design Director")
- `/contact` (Squarespace form)
- `/cart` (unused Squarespace default — drop)
- `/brian-tighe-design` (redundant, review)

### Assets
- Project imagery hosted on Squarespace CDN — needs export and re-hosting on Vercel or an image CDN
- No blog / essay content on the current site (starting fresh in V2)

## Phased execution

### Phase 1 — Audit and classify (week 1)

Per case study, classify into one of four buckets:

- **Receipt (migrate + rewrite):** HelloFresh, Daily Harvest, HelloNotifications. These become anchor case studies referenced from essays. Rewrite with the framework vocabulary (Prototype-Led Positioning, Design Engineering for Growth) so they function as evidence for the essays, not just portfolio entries.
- **Portfolio (migrate verbatim):** Horizons, Boop/Petabyte, Single Question Sign Up, Multi-preference Sign Up, First Place. Keep as-is content; reformat into MDX.
- **Lower-shelf (evaluate):** fetch, fl, gen-ai, loeb, singlecare, project-one-*. Review each; skip unless they carry a specific story worth the maintenance.
- **Drop:** /cart, any Squarespace-specific artifacts.

Produce `content/work/_inventory.md` with the classification decisions. This is the migration manifest.

### Phase 2 — Build the work route + migrate the top 3 (weeks 2–3)

1. Implement `/work/[slug]/page.tsx` dynamic route (parallel to `/essays/[year]/[slug]/page.tsx`). Use the same MDX pipeline.
2. Extend `lib/content.ts` with `getAllWork()` / `getWorkBySlug()`.
3. Create frontmatter schema for case studies:
   ```yaml
   title: "HelloFresh Growth Engineering"
   company: "HelloFresh"
   role: "Principal Product Designer"
   period: "2020–2022"
   receipt: "+$75M conversion value over 18 months"
   framework: "Prototype-Led Positioning"
   summary: "One-sentence outcome."
   dropCap: true
   ```
4. Write the three receipt case studies in MDX, rewritten through the framework lens:
   - `content/work/hellofresh.mdx`
   - `content/work/daily-harvest.mdx`
   - `content/work/hellonotifications.mdx`
5. Update `/work/page.tsx` to list case studies with receipts surfaced.
6. Link case studies from the flagship essays (Prototype-Led Positioning → HelloFresh receipt as the worked example).

### Phase 3 — Migrate the rest of the portfolio (week 4)

Per the Phase 1 manifest, write remaining MDX files. Verbatim migrations are short — typically 150–400 words plus 1–3 images. Keep images in `public/work/[slug]/` with Next.js `<Image>` optimization.

### Phase 4 — DNS cutover (week 5)

Prerequisites before cutover:
- All migrated case studies live on Vercel
- Redirect map tested (see below)
- Search Console property verified for the Vercel deploy URL (so we have pre-cutover baseline indexing data)
- No broken internal links on V2

Cutover sequence:

1. **Add `briantighe.design` and `www.briantighe.design` as custom domains in Vercel** — `vercel domains add briantighe.design --scope brians-projects-61d69cd7`
2. **Update DNS records at registrar.** Squarespace manages DNS by default if the domain was registered through Squarespace. Check at squarespace.com → Domains. Records to update:
   - `A` record `@` → Vercel IP (Vercel will display the exact record to create)
   - `CNAME` `www` → `cname.vercel-dns.com`
   - Remove Squarespace-specific `CNAME` and `A` records that route to Squarespace
3. **Propagation window:** 10 minutes to 48 hours. Monitor with `dig briantighe.design +short` and `curl -I https://briantighe.design` to confirm the Vercel certificate is served.
4. **Disable the Squarespace site** after Vercel confirms traffic serving — otherwise Squarespace will keep collecting traffic during the DNS transition window. Do NOT cancel the Squarespace subscription until the DNS is fully transitioned and Search Console confirms the new site is serving (30+ days post-cutover) — retain the Squarespace site as a fallback.

### Phase 5 — Redirect map + Search Console (week 5–6)

Add the redirect map to `vercel.json`:

```json
{
  "redirects": [
    { "source": "/cart", "destination": "/", "permanent": true },
    { "source": "/brian-tighe-design", "destination": "/", "permanent": true },
    { "source": "/contact", "destination": "/#contact", "permanent": true },
    { "source": "/work/hellofresh", "destination": "/work/hellofresh", "permanent": false },
    { "source": "/work/daily-harvest", "destination": "/work/daily-harvest", "permanent": false }
  ]
}
```

Any URL not remapped will 404. Check Squarespace analytics for inbound traffic before cutover to identify any obscure URLs receiving traffic that need redirects.

Search Console steps:
1. Add `https://briantighe.design` as a verified property (DNS TXT verification persists across hosting changes)
2. Submit the new sitemap (`https://briantighe.design/sitemap.xml`)
3. Use "URL Inspection" on the top 10 most-linked old URLs to confirm the new site is being crawled
4. Monitor the "Coverage" report for 4–6 weeks; expect a temporary ranking dip as Google re-crawls

### Phase 6 — External surface updates (week 6)

Update links pointing to briantighe.design on:
- LinkedIn profile bio
- Resume PDF
- Email signature
- Any published essay, talk, or interview that references the old URL structure (if `/work/hellofresh` was cited externally, the redirect preserves that, but direct `/cart` or `/brian-tighe-design` references need updating)
- Substack → RSS wiring (the feed URL does not change; the canonical URL does)

## Failure modes to watch

1. **DNS split-brain** — if Squarespace domain management is still active, Squarespace may reset DNS records periodically. Transfer the domain to a dedicated registrar (Cloudflare, Namecheap, Porkbun) before cutover, or disable Squarespace domain management explicitly.
2. **Image link rot** — Squarespace CDN-hosted images will 404 after migration if case studies reference them by absolute URL. Migrate images to `public/work/[slug]/` during Phase 2, not after cutover.
3. **Search ranking dip** — expected; lasts 4–8 weeks for a re-platform. Do not over-correct with content changes during this window; let Google reindex.
4. **Broken internal links in migrated MDX** — Squarespace auto-links between case studies will point to `/work/[slug]` paths that may or may not exist in V2. Audit each migrated MDX for link integrity before publishing.
5. **Email forms silently broken** — the Squarespace `/contact` form submissions end on cutover. V2 uses `mailto:` on the homepage. Confirm inbound email works; consider a Formspree/Basin endpoint if form is necessary.

## Success criteria

Migration is complete when:
- briantighe.design serves V2 with valid SSL
- Top 5 old URLs (including `/work/hellofresh`, `/work/daily-harvest`, etc.) return 200 via redirect or direct match
- Search Console shows the new sitemap indexed and no critical coverage errors
- Every migrated case study links to at least one essay that cites its receipt
- Substack mirror receives new essays via RSS (no manual re-post needed)
- `llm-crawl-optimizer` audit of briantighe.design passes ≥ 26 / 28 criteria

## What migration does NOT include

- Auto-import from Squarespace (no clean Squarespace export for raw case study content — migration is a manual rewrite, which is the opportunity to reframe through the new thesis)
- Historical analytics (Squarespace analytics do not transfer; prior traffic data becomes archive-only)
- The `/cart` feature (dropped)
- Custom Squarespace fonts (replaced by ET Book)

## Estimated calendar

| Phase | Target | Status |
| --- | --- | --- |
| 1. Audit + classify | Week 1 | Pending |
| 2. Route + top-3 receipts | Weeks 2–3 | Pending |
| 3. Remaining portfolio | Week 4 | Pending |
| 4. DNS cutover | Week 5 | Pending |
| 5. Redirects + Search Console | Weeks 5–6 | Pending |
| 6. External surface updates | Week 6 | Pending |

Total: ~6 weeks, assuming 5 hours/week. Compressible to 2 weeks with full-time focus.
