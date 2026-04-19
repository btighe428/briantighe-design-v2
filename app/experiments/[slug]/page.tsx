import { notFound } from 'next/navigation';

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  notFound();
}
