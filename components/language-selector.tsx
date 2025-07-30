"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useEffect, useState } from "react";

export function LanguageSelector() {
  const { locale, changeLocale, getCurrentLocaleName, getCurrentLocaleFlag, getAvailableLocales, tLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-language-selector]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="h-9 w-20 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
    );
  }

  const availableLocales = getAvailableLocales();

  return (
    <div className="relative" data-language-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={tLanguage('select')}
        aria-label={`${tLanguage('select')}. ${tLanguage('current')}: ${getCurrentLocaleName()}`}
        aria-expanded={isOpen}
        className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white min-w-[80px]"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{getCurrentLocaleFlag()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          {availableLocales.map((localeOption) => (
            <button
              key={localeOption.code}
              onClick={() => {
                changeLocale(localeOption.code);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                localeOption.isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{localeOption.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{localeOption.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{localeOption.code}</span>
              </div>
              {localeOption.isActive && (
                <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}