"use client";

import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme/use-theme";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme, isLight, isDark, isSystem } = useTheme();
  const { tTheme } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-theme-toggle]')) {
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
      <div className="h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
    );
  }

  const getIcon = () => {
    if (isLight) return <Sun className="h-4 w-4" />;
    if (isDark) return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (isLight) return tTheme('light');
    if (isDark) return tTheme('dark');
    return tTheme('system');
  };

  const themeOptions = [
    { 
      key: 'light', 
      label: tTheme('light'), 
      icon: <Sun className="h-4 w-4" />, 
      action: setLightTheme,
      active: isLight
    },
    { 
      key: 'dark', 
      label: tTheme('dark'), 
      icon: <Moon className="h-4 w-4" />, 
      action: setDarkTheme,
      active: isDark
    },
    { 
      key: 'system', 
      label: tTheme('system'), 
      icon: <Monitor className="h-4 w-4" />, 
      action: setSystemTheme,
      active: isSystem
    },
  ];

  return (
    <div className="relative" data-theme-toggle>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={tTheme('select')}
        aria-label={`${tTheme('select')}. ${tTheme('current')}: ${getLabel()}`}
        aria-expanded={isOpen}
        className="h-9 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        {getIcon()}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          {themeOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                option.active 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}