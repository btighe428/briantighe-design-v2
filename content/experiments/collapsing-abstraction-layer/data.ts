export type Category =
  | 'raster'
  | 'vector'
  | 'clickable'
  | 'code-design'
  | 'ai-generation';

export type Tool = {
  name: string;
  category: Category;
  start: number;
  end: number;
  died?: string;
  note?: string;
};

export type Era = {
  name: string;
  start: number;
  end: number;
  note: string;
};

export type Event = {
  year: number;
  label: string;
};

export type CategoryDef = {
  id: Category;
  label: string;
  order: number;
};

// Decimal year used as "today" for tools still alive.
const NOW = 2026.31;

export const eras: Era[] = [
  { name: 'Pixel Era', start: 1995, end: 2011, note: 'Literal pictures of software' },
  { name: 'Illusion Era', start: 2011, end: 2016, note: 'Clickable simulations' },
  { name: 'Component Era', start: 2016, end: 2024, note: 'Declarative systems' },
  { name: 'Intelligence Era', start: 2024, end: 2027, note: 'Running system as the artifact' },
];

export const categories: CategoryDef[] = [
  { id: 'raster', label: 'Raster editors', order: 1 },
  { id: 'vector', label: 'Vector design', order: 2 },
  { id: 'clickable', label: 'Clickable prototyping', order: 3 },
  { id: 'code-design', label: 'Code-design', order: 4 },
  { id: 'ai-generation', label: 'AI generation', order: 5 },
];

export const tools: Tool[] = [
  { name: 'Photoshop (web UI era)', category: 'raster', start: 1999, end: 2013, died: 'Marginalized by Sketch' },
  { name: 'Macromedia Fireworks', category: 'raster', start: 1998, end: 2013, died: 'Adobe killed 2013' },

  { name: 'Sketch', category: 'vector', start: 2010, end: NOW, note: 'Marginalized by Figma' },
  { name: 'Adobe XD', category: 'vector', start: 2016, end: 2022, died: 'Maintenance mode 2022' },
  { name: 'Figma', category: 'vector', start: 2015, end: NOW },
  { name: 'Framer (post-pivot)', category: 'vector', start: 2018, end: NOW },

  { name: 'Axure RP', category: 'clickable', start: 2003, end: NOW },
  { name: 'Balsamiq', category: 'clickable', start: 2008, end: NOW },
  { name: 'InVision', category: 'clickable', start: 2011, end: 2024.99, died: 'Shutdown Dec 31, 2024' },
  { name: 'Flinto', category: 'clickable', start: 2012, end: NOW },
  { name: 'Marvel', category: 'clickable', start: 2013, end: NOW },
  { name: 'Zeplin', category: 'clickable', start: 2014, end: NOW },
  { name: 'Principle', category: 'clickable', start: 2015, end: 2020, died: 'Abandoned ~2020' },

  { name: 'Flash', category: 'code-design', start: 1996, end: 2020.99, died: 'Flash Player EOL Dec 31, 2020' },
  { name: 'Dreamweaver', category: 'code-design', start: 1997, end: NOW, note: 'Marginalized' },
  { name: 'Framer Classic', category: 'code-design', start: 2014, end: 2018, died: 'Pivoted to Framer X' },

  { name: 'shadcn/ui', category: 'ai-generation', start: 2023.07, end: NOW },
  { name: 'v0', category: 'ai-generation', start: 2023.78, end: NOW },
  { name: 'Cursor', category: 'ai-generation', start: 2023.25, end: NOW },
  { name: 'Claude Artifacts', category: 'ai-generation', start: 2024.47, end: NOW },
  { name: 'Bolt.new', category: 'ai-generation', start: 2024.75, end: NOW },
  { name: 'Lovable', category: 'ai-generation', start: 2024.92, end: NOW },
  { name: 'Replit Agent', category: 'ai-generation', start: 2024.68, end: NOW },
  { name: 'Claude Code', category: 'ai-generation', start: 2025.15, end: NOW },
];

export const events: Event[] = [
  { year: 2005, label: 'Adobe acquires Macromedia ($3.4B)' },
  { year: 2010, label: 'Jobs: Thoughts on Flash' },
  { year: 2013, label: 'Adobe kills Fireworks' },
  { year: 2016, label: 'Figma public launch' },
  { year: 2020, label: 'Flash Player EOL' },
  { year: 2022.7, label: 'Adobe–Figma $20B deal announced' },
  { year: 2023.96, label: 'Deal terminated; $1B break fee' },
  { year: 2025, label: 'Figma IPO' },
];

export const present = NOW;
