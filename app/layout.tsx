import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site-config';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Essays' }],
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffff8' },
    { media: '(prefers-color-scheme: dark)', color: '#151413' },
  ],
};

const entityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: 'en-US',
      publisher: { '@id': `${siteConfig.url}#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      url: siteConfig.url,
      jobTitle: siteConfig.author.role,
      description:
        'Principal Product Designer at Yahoo Mail. Establishing the category "design engineering for growth" through shippable prototypes and long-form essay research.',
      knowsAbout: siteConfig.frameworks.map((f) => f.label),
      mainEntityOfPage: siteConfig.url,
    },
  ],
};

// Applied before body renders to avoid flash-of-wrong-theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
