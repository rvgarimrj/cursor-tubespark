"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n/use-translation";
import { LanguageSelector } from "@/components/language-selector";

export function DashboardHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user } = useAuth();
  const { tDashboard } = useTranslation();
  
  // These would normally come from a context or API
  const usageStats = { used: 7, total: 10 };

  return (
    <header className="lg:ml-[280px] flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 px-6 py-4 gap-4 lg:gap-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f8fafc] mb-2">
          {tDashboard('home.welcomeBack')}! 👋
        </h1>
        <p className="text-[#94a3b8]">
          {tDashboard('home.subtitle')}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        {/* Search bar with glass effect */}
        <div className="relative w-full sm:max-w-[400px] lg:max-w-[600px]">
          <input
            type="text"
            placeholder={tDashboard('header.search')}
            className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] backdrop-filter backdrop-blur-sm placeholder-[#64748b]"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Usage indicator with green pulse */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium whitespace-nowrap">
              {tDashboard('header.usageIndicator', {
                used: usageStats.used.toString(),
                total: usageStats.total.toString()
              })}
            </span>
          </div>
          
          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}