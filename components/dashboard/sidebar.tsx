"use client";

import {
  BarChart3,
  Calendar,
  Home,
  Lightbulb,
  Settings,
  Sparkles,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n/use-translation";
import { clsx } from "clsx";


export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { locale, tDashboard, tCommon } = useTranslation();

  const navigation = [
    { name: tDashboard('sidebar.navigation.dashboard'), href: `/${locale}/dashboard`, icon: Home },
    { name: tDashboard('sidebar.navigation.generateIdeas'), href: `/${locale}/ideas`, icon: Lightbulb },
    { name: tDashboard('sidebar.navigation.contentCalendar'), href: `/${locale}/calendar`, icon: Calendar },
    { name: tDashboard('sidebar.navigation.analytics'), href: `/${locale}/analytics`, icon: BarChart3 },
    { name: tDashboard('sidebar.navigation.settings'), href: `/${locale}/settings`, icon: Settings },
    { name: tDashboard('sidebar.navigation.billing'), href: `/${locale}/billing`, icon: CreditCard },
  ];

  return (
    <div className="flex w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href={`/${locale}/dashboard`} className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg youtube-gradient">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">{tDashboard('sidebar.logo')}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-r-2 border-red-600 dark:border-red-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "mr-3 h-5 w-5",
                  isActive ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <User className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.displayName || tCommon('user')}  
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.primaryEmail || tCommon('email')}</p>
          </div>
        </div>
        
        <button
          onClick={signOut}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          {tDashboard('sidebar.user.signOut')}
        </button>
      </div>
    </div>
  );
}