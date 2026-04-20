'use client';

import { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';
const LABELS: Record<Theme, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

function readStored(): Theme {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : 'system';
}

function applyTheme(theme: Theme) {
  const el = document.documentElement;
  if (theme === 'system') {
    el.removeAttribute('data-theme');
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    el.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
}

const CYCLE: Theme[] = ['system', 'light', 'dark'];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readStored());
    setMounted(true);
  }, []);

  function next() {
    const idx = CYCLE.indexOf(theme);
    const n = CYCLE[(idx + 1) % CYCLE.length];
    setTheme(n);
    applyTheme(n);
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="theme-toggle"
        aria-label="Theme"
        suppressHydrationWarning
      >
        &nbsp;&nbsp;&nbsp;&nbsp;
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={next}
      aria-label={`Theme: ${LABELS[theme]}. Click to cycle.`}
      title={`Theme: ${LABELS[theme]}`}
    >
      {LABELS[theme]}
    </button>
  );
}
