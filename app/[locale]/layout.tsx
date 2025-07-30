import { ThemeProvider } from '@/lib/theme/theme-provider';
import { AuthProvider } from '@/lib/auth/provider';

const locales = ['pt', 'en', 'es', 'fr'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Basic validation
  if (!locales.includes(locale as any)) {
    return <div>Invalid locale: {locale}</div>;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <div className="text-xs bg-blue-100 p-2">Providers Working - Locale: {locale}</div>
            {children}
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}