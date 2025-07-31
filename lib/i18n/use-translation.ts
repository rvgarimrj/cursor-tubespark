"use client";

import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale, localeNames, localeFlags } from './config';
import { t as translate } from './translations';

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = (pathname.split('/')[1] as Locale) || 'pt';

  const changeLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const newPath = newLocale === 'pt' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const getCurrentLocaleName = () => localeNames[locale];
  const getCurrentLocaleFlag = () => localeFlags[locale];

  const getAvailableLocales = () => {
    return locales.map(loc => ({
      code: loc,
      name: localeNames[loc],
      flag: localeFlags[loc],
      isActive: loc === locale
    }));
  };

  // Manual translation function using our manual system
  const t = (key: string) => translate(key as any, locale);

  // Scoped translation functions for common sections
  const tAuth = (key: string) => t(`auth.${key}`);
  const tDashboard = (key: string) => t(`dashboard.${key}`);
  const tCommon = (key: string) => t(`common.${key}`);
  const tTheme = (key: string) => t(`theme.${key}`);
  const tLanguage = (key: string) => t(`language.${key}`);
  const tError = (key: string) => t(`errors.${key}`);

  return {
    t,
    locale,
    changeLocale,
    getCurrentLocaleName,
    getCurrentLocaleFlag,
    getAvailableLocales,
    // Scoped translators
    tAuth,
    tDashboard,
    tCommon,
    tTheme,
    tLanguage,
    tError,
  };
}