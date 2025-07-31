import { Play, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { landingTranslations, type LandingTranslationKey } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

export default function LocaleHomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const validLocale = locale as Locale;
  const t = (key: LandingTranslationKey) => landingTranslations[validLocale]?.[key] || landingTranslations.pt[key];
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg youtube-gradient">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold dark:text-white">TubeSpark</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white"
            >
              {t('features')}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white"
            >
              {t('pricing')}
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white"
            >
              {t('about')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href={`/${locale}/auth/signin`}
              className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-white"
            >
              {t('signIn')}
            </Link>
            <Link
              href={`/${locale}/auth/signup`}
              className="inline-flex h-9 items-center justify-center rounded-md youtube-gradient px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:opacity-90"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-6xl text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl dark:text-white">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={`/${locale}/auth/signup`}
                className="rounded-md youtube-gradient px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t('startCreating')}
              </Link>
              <Link
                href="#demo"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary dark:text-gray-300 dark:hover:text-white"
              >
                {t('watchDemo')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 dark:border-gray-100/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 text-gray-400" />
                  {t('activeCreators')}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  10,000+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 dark:border-gray-100/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                  {t('ideasGenerated')}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  500K+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 dark:border-gray-100/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  {t('viralVideos')}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  25,000+
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl dark:text-white">
              {t('featuresTitle')}
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">{t('aiPowered')}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('aiPoweredDesc')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">{t('trendAnalysis')}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('trendAnalysisDesc')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">
                  {t('competitorInsights')}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('competitorInsightsDesc')}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">{t('seoOptimization')}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('seoOptimizationDesc')}
                </p>
              </div>

              {/* Feature 5 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">{t('channelAnalysis')}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('channelAnalysisDesc')}
                </p>
              </div>

              {/* Feature 6 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold dark:text-white">{t('contentCalendar')}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('contentCalendarDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl dark:text-white">
              {t('ctaTitle')}
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-10">
              <Link
                href={`/${locale}/auth/signup`}
                className="rounded-md youtube-gradient px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                {t('ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded youtube-gradient">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold dark:text-white">TubeSpark</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}