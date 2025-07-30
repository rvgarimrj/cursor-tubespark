"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme/use-theme";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme, isLight, isDark, isSystem } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getTooltip = () => {
    if (isLight) return "Modo claro";
    if (isDark) return "Modo escuro";
    return "Seguir sistema";
  };

  return (
    <button
      onClick={toggleTheme}
      title={getTooltip()}
      aria-label={`Mudar tema. Tema atual: ${getTooltip()}`}
      className="h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      {getIcon()}
    </button>
  );
}