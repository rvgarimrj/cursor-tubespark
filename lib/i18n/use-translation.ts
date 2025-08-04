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
    // Match exactly our supported locales (pt, en, es, fr)
    const pathWithoutLocale = pathname.replace(/^\/(pt|en|es|fr)/, '') || '/';
    // With localePrefix: 'always', ALL locales need prefix, including 'pt'
    const newPath = `/${newLocale}${pathWithoutLocale}`;
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

  // Helper function to interpolate variables in translation strings
  const interpolate = (text: string, variables?: Record<string, string | number>): string => {
    if (!variables) return text;
    
    return Object.entries(variables).reduce((result, [key, value]) => {
      const placeholder = `{{${key}}}`;
      return result.replace(new RegExp(placeholder, 'g'), String(value));
    }, text);
  };

  // Manual translation function using our manual system
  const t = (key: string, variables?: Record<string, string | number>) => {
    const translation = translate(key as any, locale);
    return interpolate(translation, variables);
  };

  // Scoped translation functions for common sections with interpolation support
  const tAuth = (key: string, variables?: Record<string, string | number>) => t(`auth.${key}`, variables);
  const tDashboard = (key: string, variables?: Record<string, string | number>) => t(`dashboard.${key}`, variables);
  const tCommon = (key: string, variables?: Record<string, string | number>) => t(`common.${key}`, variables);
  const tTheme = (key: string, variables?: Record<string, string | number>) => t(`theme.${key}`, variables);
  const tLanguage = (key: string, variables?: Record<string, string | number>) => t(`language.${key}`, variables);
  const tError = (key: string, variables?: Record<string, string | number>) => t(`errors.${key}`, variables);

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