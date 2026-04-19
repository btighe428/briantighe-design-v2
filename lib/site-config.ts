export const siteConfig = {
  name: 'Brian Tighe',
  title: 'Brian Tighe — design engineering for growth',
  description:
    'Essays, experiments, and case studies on design engineering for growth. Brian Tighe is a Principal Product Designer at Yahoo Mail.',
  url: 'https://v2.briantighe.design',
  author: {
    name: 'Brian Tighe',
    role: 'Principal Product Designer, Yahoo Mail',
    email: 'btighe428@gmail.com',
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
