import { redirect } from 'next/navigation';

export default function LocaleHomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Redirect to dashboard for authenticated users
  // This will be handled by middleware
  redirect(`/${locale}/dashboard`);
}