import type { Config } from 'tailwindcss';

// Tailwind v4: theme tokens live in app/globals.css via @theme.
// This file exists to satisfy the scaffold's file list and declare
// content sources explicitly. Most config is in CSS now.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
};

export default config;
