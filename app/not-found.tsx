import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllEssays } from '@/lib/content';
import { getAllFrameworks } from '@/lib/frameworks';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const essays = (await getAllEssays()).slice(0, 5);
  const frameworks = await getAllFrameworks();

  return (
    <main className="essay">
      <header>
        <div className="essay-meta">
          <Link href="/">← Home</Link>
        </div>
        <h1>Not found</h1>
        <p className="subtitle">
          This page does not exist — or not yet. A few things that do:
        </p>
      </header>

      <section>
        <h2>Recent essays</h2>
        <ul>
          {essays.map((e) => (
            <li key={e.href}>
              <Link href={e.href}>{e.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Frameworks</h2>
        <ul>
          {frameworks.map((f) => (
            <li key={f.href}>
              <Link href={f.href}>{f.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Index</h2>
        <ul>
          <li>
            <Link href="/essays">All essays</Link>
          </li>
          <li>
            <Link href="/frameworks">All frameworks</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/sitemap">Sitemap</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
