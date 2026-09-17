import { ContentPage, generateContentMetadata } from '@/components/ContentPage';

export const revalidate = 60;

export const generateMetadata = () => generateContentMetadata('privacy');

export default function PrivacyPage() {
  return <ContentPage slug="privacy" />;
}
