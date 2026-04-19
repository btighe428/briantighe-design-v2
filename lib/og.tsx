import { ImageResponse } from 'next/og';
import { siteConfig } from './site-config';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const GOOGLE_FONTS_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)';

async function fetchGoogleFontTtf(cssUrl: string): Promise<ArrayBuffer> {
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': GOOGLE_FONTS_UA },
  }).then((r) => r.text());
  const match = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
  if (!match) throw new Error(`No TTF in CSS: ${cssUrl}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

let fontCache: Awaited<ReturnType<typeof loadFonts>> | null = null;

async function loadFonts() {
  const [regular, italic, bold] = await Promise.all([
    fetchGoogleFontTtf(
      'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
    ),
    fetchGoogleFontTtf(
      'https://fonts.googleapis.com/css2?family=EB+Garamond:ital@1&display=swap',
    ),
    fetchGoogleFontTtf(
      'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@700&display=swap',
    ),
  ]);
  return [
    { name: 'Serif', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Serif', data: italic, weight: 400 as const, style: 'italic' as const },
    { name: 'Serif', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}

async function fonts() {
  if (!fontCache) fontCache = await loadFonts();
  return fontCache;
}

type CardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  date?: string;
};

function Card({ eyebrow, title, subtitle, date }: CardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 96px',
        background: '#fffff8',
        color: '#111010',
        fontFamily: 'Serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#5a5854',
            marginBottom: 32,
          }}
        >
          {eyebrow ?? 'briantighe.design'}
        </div>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.08,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.3,
              fontStyle: 'italic',
              color: '#5a5854',
              maxWidth: 960,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 22,
          color: '#5a5854',
          borderTop: '1px solid #d8d3c3',
          paddingTop: 24,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#111010', fontSize: 26 }}>
            {siteConfig.author.name}
          </span>
          <span>{siteConfig.author.role}</span>
        </div>
        {date ? <div>{date}</div> : <div>briantighe.design</div>}
      </div>
    </div>
  );
}

export async function renderOgImage(props: CardProps) {
  return new ImageResponse(<Card {...props} />, {
    ...OG_SIZE,
    fonts: await fonts(),
  });
}
