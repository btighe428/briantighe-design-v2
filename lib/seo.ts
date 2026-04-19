import { siteConfig } from './site-config';
import type { EssaySummary } from './content';

const SITE = siteConfig.url;

function abs(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': abs('/#person'),
    name: siteConfig.author.name,
    url: SITE,
    jobTitle: siteConfig.author.jobTitle,
    worksFor: { '@type': 'Organization', name: siteConfig.author.worksFor },
    description: siteConfig.author.bio,
    email: `mailto:${siteConfig.author.email}`,
    image: abs(siteConfig.author.image),
    knowsAbout: [...siteConfig.author.knowsAbout],
    sameAs: [...siteConfig.author.sameAs],
  };
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': abs('/#organization'),
    name: siteConfig.name,
    url: SITE,
    logo: abs('/favicon.svg'),
    founder: { '@id': abs('/#person') },
    sameAs: [...siteConfig.author.sameAs],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: SITE,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: 'en-US',
    publisher: { '@id': abs('/#organization') },
    author: { '@id': abs('/#person') },
  };
}

export function articleSchema(
  essay: EssaySummary,
  opts: { readingMinutes?: number; wordCount?: number; relatedHrefs?: string[] } = {},
) {
  const url = abs(essay.canonical ?? essay.href);
  const image = essay.ogImage
    ? abs(essay.ogImage)
    : `${url}/opengraph-image`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: essay.title,
    alternativeHeadline: essay.subtitle,
    description: essay.description ?? essay.subtitle,
    image,
    datePublished: new Date(essay.date).toISOString(),
    dateModified: new Date(essay.updated ?? essay.date).toISOString(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    articleSection: essay.section,
    author: { '@id': abs('/#person') },
    publisher: { '@id': abs('/#organization') },
    keywords: essay.keywords?.join(', ') ?? essay.tags?.join(', '),
    ...(opts.readingMinutes
      ? { timeRequired: `PT${opts.readingMinutes}M` }
      : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.relatedHrefs && opts.relatedHrefs.length
      ? { isRelatedTo: opts.relatedHrefs.map((h) => abs(h)) }
      : {}),
  };
}

export function breadcrumbListSchema(
  crumbs: Array<{ name: string; href: string }>,
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

export function aboutPageSchema() {
  return {
    '@type': 'AboutPage',
    '@id': abs('/about#aboutpage'),
    url: abs('/about'),
    name: `About — ${siteConfig.author.name}`,
    inLanguage: 'en-US',
    mainEntity: { '@id': abs('/#person') },
  };
}

export function collectionPageSchema(opts: {
  href: string;
  name: string;
  description: string;
  items?: Array<{ name: string; href: string; date?: string }>;
}) {
  return {
    '@type': 'CollectionPage',
    '@id': `${abs(opts.href)}#collection`,
    url: abs(opts.href),
    name: opts.name,
    description: opts.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': abs('/#website') },
    ...(opts.items && opts.items.length > 0
      ? {
          hasPart: opts.items.map((item) => ({
            '@type': 'Article',
            url: abs(item.href),
            name: item.name,
            ...(item.date
              ? { datePublished: new Date(item.date).toISOString() }
              : {}),
          })),
        }
      : {}),
  };
}

export function definedTermSchema(opts: {
  href: string;
  name: string;
  description: string;
  alternateName?: string;
  termCode?: string;
}) {
  return {
    '@type': 'DefinedTerm',
    '@id': `${abs(opts.href)}#term`,
    url: abs(opts.href),
    name: opts.name,
    alternateName: opts.alternateName,
    description: opts.description,
    termCode: opts.termCode,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': abs('/frameworks#set'),
      name: 'briantighe.design frameworks',
      url: abs('/frameworks'),
    },
    author: { '@id': abs('/#person') },
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function graph(...nodes: Array<Record<string, unknown>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
