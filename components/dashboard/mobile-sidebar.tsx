"use client";

import { useState } from 'react';
import { X, Sparkles, Home, Lightbulb, Calendar, BarChart3, Settings, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n/use-translation";
import { clsx } from "clsx";

interface MobileDashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDashboardSidebar({ isOpen, onClose }: MobileDashboardSidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { locale, tDashboard, tCommon } = useTranslation();

  const navigation = [
    { name: tDashboard('sidebar.navigation.dashboard'), href: `/${locale}/dashboard`, icon: Home },
    { name: tDashboard('sidebar.navigation.generateIdeas'), href: `/${locale}/dashboard/ideas`, icon: Lightbulb },
    { name: tDashboard('sidebar.navigation.contentCalendar'), href: `/${locale}/calendar`, icon: Calendar },
    { name: tDashboard('sidebar.navigation.analytics'), href: `/${locale}/analytics`, icon: BarChart3 },
    { name: tDashboard('sidebar.navigation.settings'), href: `/${locale}/settings`, icon: Settings },
    { name: tDashboard('sidebar.navigation.billing'), href: `/${locale}/billing`, icon: CreditCard },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] border-l border-white/10 shadow-2xl shadow-black/50 z-[70] transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10" style={{
            background: 'rgba(15, 23, 42, 0.8)'
          }}>
            <Link href={`/${locale}/dashboard`} className="flex items-center space-x-3" onClick={handleLinkClick}>
              <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {tDashboard('sidebar.logo')}
                </span>
                <div className="text-xs text-[#94a3b8]">{tDashboard('sidebar.tagline')}</div>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 space-y-3" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
            {/* Main Navigation */}
            <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4 px-2">
              {tDashboard('sidebar.sections.main')}
            </div>
            
            {navigation.slice(0, 4).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={clsx(
                    "flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 border",
                    isActive
                      ? "bg-gradient-to-r from-[rgba(102,126,234,0.15)] to-[rgba(118,75,162,0.10)] text-[#667eea] border-[rgba(102,126,234,0.2)] shadow-lg shadow-blue-400/20"
                      : "text-white hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
                  )}
                  style={{ backgroundColor: isActive ? undefined : 'rgba(30, 41, 59, 0.6)' }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold text-lg">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            
            {/* Settings Navigation */}
            <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4 px-2">
              {tDashboard('sidebar.sections.settings')}
            </div>
            
            {navigation.slice(4).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={clsx(
                    "flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 border",
                    isActive
                      ? "bg-gradient-to-r from-[rgba(102,126,234,0.15)] to-[rgba(118,75,162,0.10)] text-[#667eea] border-[rgba(102,126,234,0.2)] shadow-lg shadow-blue-400/20"
                      : "text-white hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
                  )}
                  style={{ backgroundColor: isActive ? undefined : 'rgba(30, 41, 59, 0.6)' }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold text-lg">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="p-6 border-t border-white/10" style={{
            background: 'rgba(15, 23, 42, 0.9)'
          }}>
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 backdrop-filter backdrop-blur-sm mb-4">
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
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center shadow-2xl hover:scale-105 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-400/50"
            >
              <LogOut className="w-5 h-5" />
              {tDashboard('sidebar.user.signOut')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}