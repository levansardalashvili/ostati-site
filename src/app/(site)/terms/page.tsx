import { ContentPage, generateContentMetadata } from '@/components/ContentPage';

export const revalidate = 60;

export const generateMetadata = () => generateContentMetadata('terms');

export default function TermsPage() {
  return <ContentPage slug="terms" />;
}
