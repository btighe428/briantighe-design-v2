export const siteConfig = {
  name: 'Brian Tighe',
  title: 'Brian Tighe — design engineering for growth',
  description:
    'Essays, experiments, and case studies on design engineering for growth. Brian Tighe is a Principal Product Designer at Yahoo Mail.',
  url: 'https://v2.briantighe.design',
  locale: 'en_US',
  author: {
    name: 'Brian Tighe',
    alternateName: 'Brian Tighe',
    role: 'Principal Product Designer, Yahoo Mail',
    jobTitle: 'Principal Product Designer',
    worksFor: 'Yahoo',
    email: 'btighe428@gmail.com',
    bio: 'Brian Tighe is a Principal Product Designer at Yahoo Mail and the originator of prototype-led positioning — the practice of treating a working, shippable prototype as the primary artifact of a growth practice.',
    location: 'United States',
    image: '/author.jpg',
    sameAs: [
      'https://www.linkedin.com/in/briantighe/',
      'https://x.com/btighe428',
      'https://github.com/btighe428',
    ],
    knowsAbout: [
      'Product Design',
      'Design Engineering',
      'Growth Design',
      'Positioning',
      'Prototyping',
      'Interaction Design',
    ],
  },
  social: {
    twitter: '@btighe428',
    linkedin: 'briantighe',
    github: 'btighe428',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '',
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION ?? '',
  },
  frameworks: [
    {
      id: 'prototype-led-positioning',
      label: 'Prototype-led positioning',
    },
    {
      id: 'design-engineering-for-growth',
      label: 'Design engineering for growth',
    },
    {
      id: 'working-prototype-as-artifact',
      label: 'The working prototype as primary artifact',
    },
  ],
  llmCrawlers: [
    'GPTBot',
    'Claude-Web',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
    'anthropic-ai',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
