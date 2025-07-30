"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 transition-colors">
      {/* Left side - Mobile menu button (hidden on desktop) */}
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center - Search bar */}
      <div className="flex-1 max-w-lg mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              className={`h-4 w-4 ${
                isSearchFocused ? "text-red-500" : "text-gray-400 dark:text-gray-500"
              }`}
            />
          </div>
          <input
            type="text"
            placeholder="Search ideas, trends, or competitors..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right side - Notifications and user info */}
      <div className="flex items-center space-x-4">
        {/* Usage indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            7/10 ideas used
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
        >
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">2</span>
          </div>
        </button>

        {/* User avatar/info */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
              {user?.displayName || "User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Free Plan
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-sm font-medium text-red-600">
              {(user?.displayName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}