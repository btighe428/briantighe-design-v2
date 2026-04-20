export const siteConfig = {
  name: 'Brian Tighe',
  title: 'Brian Tighe — design engineering for growth',
  description:
    'Brian Tighe — Principal Product Designer at Yahoo Mail, Growth and Experimentation. Essays, experiments, and case studies on design engineering for growth.',
  url: 'https://briantighe.design',
  author: {
    name: 'Brian Tighe',
    pronounced: 'tie',
    role: 'Principal Product Designer, Growth and Experimentation',
    company: 'Yahoo Mail',
    companyUrl: 'https://yahoo.com',
    email: 'btighe428@gmail.com',
    location: 'Brooklyn, New York',
  },
  // Shipped receipts — the specific $ / % / acquisition outcomes that ground the essays.
  receipts: [
    {
      company: 'Yahoo Mail',
      metric: '+$30M+',
      description: 'incremental revenue through conversion optimization and growth initiatives',
      period: '2024–present',
    },
    {
      company: 'HelloFresh',
      metric: '+$75M',
      description: 'value increase + 100,000 monthly account creations — the most effective conversion optimization tests in company history',
      period: '2020–2022',
    },
    {
      company: 'SingleCare (Loeb.nyc)',
      metric: '+700%',
      description: 'growth via GTM; tripled daily acquisition, halved CPA',
      period: '2015–2017',
    },
    {
      company: 'Loeb.nyc Optimizely',
      metric: '+35%+',
      description: 'A/B testing program across 11,000 pages',
      period: '2015–2017',
    },
    {
      company: 'Boop → Chewy',
      metric: 'acquisition',
      description: 'brand identity work; acquired by Chewy',
      period: '2023',
    },
    {
      company: 'SearchRx → Optum Perks',
      metric: 'acquisition',
      description: 'conceptualized, designed, and coded the MVP; acquired by Optum',
      period: '2016',
    },
  ],
  education: [
    {
      institution: 'Harvard Business School',
      credential: 'Certificate — Competing in the Age of AI',
      year: 2025,
      type: 'certificate' as const,
    },
    {
      institution: 'Yale School of Management',
      credential: 'Certificate — Business Perspectives for Creative Leaders',
      year: 2025,
      type: 'certificate' as const,
    },
    {
      institution: 'Savannah College of Art and Design',
      credential: 'BFA Photography',
      year: 2010,
      honors: 'Frances Larkin McCommon Scholarship',
      type: 'degree' as const,
    },
  ],
  frameworks: [
    { id: 'prototype-led-positioning', label: 'Prototype-Led Positioning' },
    { id: 'collapsing-abstraction-layer', label: 'The Collapsing Abstraction Layer' },
    { id: 'design-engineering-for-growth', label: 'Design engineering for growth' },
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
