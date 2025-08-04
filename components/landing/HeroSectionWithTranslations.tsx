import Link from 'next/link';
import { Sparkles, Play } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface HeroSectionProps {
  locale: string;
}

export async function HeroSectionWithTranslations({ locale }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: 'landing.hero' });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-gray-100/10 dark:hover:ring-gray-100/20">
              {t('badge')} {' '}
              <a href="#" className="font-semibold text-youtube-red">
                <span className="absolute inset-0" aria-hidden="true" />
                {t('badgeLink')} <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            {t('title')}
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link 
              href={`/${locale}/auth/signup`}
              className="inline-flex items-center rounded-md bg-youtube-red px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t('ctaPrimary')}
            </Link>
            
            <Link 
              href="#demo" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-youtube-red dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {t('ctaSecondary')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-100/5 dark:ring-gray-100/10">
              <div className="relative aspect-video overflow-hidden rounded-md bg-gray-800 shadow-2xl ring-1 ring-gray-900/10">
                <div className="flex h-full items-center justify-center">
                  <Play className="h-20 w-20 text-white/50" />
                  <span className="sr-only">{t('demoVideo')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-youtube-red to-pink-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}