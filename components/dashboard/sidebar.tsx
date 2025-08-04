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
    <div className="w-[280px] bg-white/5 backdrop-filter backdrop-blur-[20px] border-r border-white/10 h-screen fixed left-0 top-0 z-10 flex flex-col hidden lg:flex">
      {/* Logo Section */}
      <div className="p-6">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {tDashboard('sidebar.logo')}
            </div>
            <div className="text-xs text-[#94a3b8]">{tDashboard('sidebar.tagline')}</div>
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3 px-4">{tDashboard('sidebar.sections.main')}</div>
          
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1",
                  isActive
                    ? "bg-gradient-to-r from-[rgba(102,126,234,0.15)] to-[rgba(118,75,162,0.10)] text-[#667eea] border border-[rgba(102,126,234,0.2)]"
                    : "text-[#94a3b8] hover:bg-white/8 hover:text-[#f8fafc]"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3 px-4 mt-8">{tDashboard('sidebar.sections.settings')}</div>
          
          {navigation.slice(4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1",
                  isActive
                    ? "bg-gradient-to-r from-[rgba(102,126,234,0.15)] to-[rgba(118,75,162,0.10)] text-[#667eea] border border-[rgba(102,126,234,0.2)]"
                    : "text-[#94a3b8] hover:bg-white/8 hover:text-[#f8fafc]"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User Profile - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 backdrop-filter backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center font-semibold text-white text-sm">
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#f8fafc] truncate">
              {user?.displayName || tCommon('user')}
            </div>
            <div className="text-xs text-[#94a3b8] truncate">
              {user?.primaryEmail || tDashboard('sidebar.user.freePlan')}
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/10 rounded-lg transition-all duration-200"
            title={tDashboard('sidebar.user.signOut')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}