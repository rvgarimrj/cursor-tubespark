"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

interface NavigationLabels {
  problem: string;
  solution: string;
  howItWorks: string;
  results: string;
  signin: string;
  getStarted: string;
}

interface MobileHeaderProps {
  locale: string;
  navigationLabels: NavigationLabels;
}

export default function MobileHeader({ locale, navigationLabels }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
        aria-label="Menu"
      >
        {isMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] border-l border-blue-500/30 shadow-2xl shadow-black/50 z-[70] transform transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-500/30" style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottomColor: 'rgba(102, 126, 234, 0.3)'
          }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TubeSpark
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg text-white hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 space-y-3" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
            <a 
              href="#problema" 
              onClick={closeMenu}
              className="block px-5 py-4 text-white hover:text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            >
              <span className="font-semibold text-lg">{navigationLabels.problem}</span>
            </a>
            <a 
              href="#solucao" 
              onClick={closeMenu}
              className="block px-5 py-4 text-white hover:text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            >
              <span className="font-semibold text-lg">{navigationLabels.solution}</span>
            </a>
            <a 
              href="#como-funciona" 
              onClick={closeMenu}
              className="block px-5 py-4 text-white hover:text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            >
              <span className="font-semibold text-lg">{navigationLabels.howItWorks}</span>
            </a>
            <a 
              href="#resultados" 
              onClick={closeMenu}
              className="block px-5 py-4 text-white hover:text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all duration-200 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            >
              <span className="font-semibold text-lg">{navigationLabels.results}</span>
            </a>
            
            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
            
            {/* Auth Links */}
            <Link
              href={`/${locale}/auth/signin`}
              onClick={closeMenu}
              className="block px-5 py-4 text-white hover:text-purple-300 hover:bg-purple-500/20 rounded-xl transition-all duration-200 border border-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-400/20"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            >
              <span className="font-semibold text-lg">{navigationLabels.signin}</span>
            </Link>
          </nav>

          {/* Bottom CTA */}
          <div className="p-6 border-t border-blue-500/40" style={{
            background: 'rgba(15, 23, 42, 0.9)',
            borderTopColor: 'rgba(102, 126, 234, 0.4)'
          }}>
            <Link
              href={`/${locale}/auth/signup`}
              onClick={closeMenu}
              className="btn-primary w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center block shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              🚀 {navigationLabels.getStarted}
            </Link>
            <div className="text-center mt-3 text-sm text-blue-200 font-medium">
              ✨ Comece gratuitamente
            </div>
          </div>
        </div>
      </div>
    </>
  );
}