import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/ContentPage';
import { getPage } from '@/lib/supabase';

// ადმინიდან დამატებული თავისუფალი გვერდები (kind='page', გამოქვეყნებული) — /{slug}. კოდის მარშრუტები
// (services, how-it-works, admin) ამ დინამიურ მარშრუტზე უფრო პრიორიტეტულია და slug-ში აკრძალულია (0122).
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.kind !== 'page') return {};
  const description = page.meta_description || undefined;
  return { title: page.title, description };
}

export default async function FreePage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.kind !== 'page') notFound();
  return <ContentPage slug={slug} />;
}
