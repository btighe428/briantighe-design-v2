import { notFound } from 'next/navigation';

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  notFound();
}
