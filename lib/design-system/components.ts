/**
 * TubeSpark Design System - Component Classes
 * Reusable component classes that follow the landing page visual identity
 */

import { designTokens } from './tokens';

export const componentClasses = {
  // Layout components
  container: `${designTokens.spacing.container}`,
  section: `${designTokens.spacing.section}`,
  
  // Card components - based on mockup design
  card: {
    base: `backdrop-filter backdrop-blur-xl bg-white/5 border border-white/10 ${designTokens.borderRadius.md} ${designTokens.spacing.cardPadding} transition-all duration-300`,
    
    // Glass effect from mockup
    glass: `backdrop-filter backdrop-blur-[20px] bg-white/5 border border-white/10 ${designTokens.borderRadius.md} transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)`,
    
    // Hover effects from mockup
    hover: `hover:bg-white/8 hover:border-[rgba(102,126,234,0.2)] hover:transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`,
    
    // Stats cards with gradient background from mockup
    stats: `bg-gradient-to-r from-white/3 to-white/5 backdrop-filter backdrop-blur-sm border border-white/8 ${designTokens.borderRadius.md} ${designTokens.spacing.cardPadding}`,
    
    // Metrics cards with special gradient (from mockup)
    metrics: `bg-gradient-to-br from-[rgba(102,126,234,0.08)] to-[rgba(118,75,162,0.04)] border-[rgba(102,126,234,0.15)] border ${designTokens.borderRadius.md} relative overflow-hidden`,
    
    // Action cards for quick actions
    action: `bg-white/5 border border-white/10 ${designTokens.borderRadius.md} text-center transition-all duration-300 cursor-pointer hover:bg-white/8 hover:transform hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]`,
    
    // Idea cards with specific styling
    idea: `bg-white/5 backdrop-filter backdrop-blur-[20px] border border-white/10 ${designTokens.borderRadius.md} transition-all duration-300 cursor-pointer hover:bg-white/8 hover:border-[rgba(102,126,234,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]`
  },
  
  // Button components - based on mockup design
  button: {
    // Primary button with gradient and shadow from mockup
    primary: `bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold shadow-[0_8px_25px_rgba(102,126,234,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(102,126,234,0.4)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)`,
    
    // Secondary button with glass effect from mockup
    secondary: `bg-white/5 text-white border border-white/10 backdrop-filter backdrop-blur-[10px] font-medium hover:bg-white/8 hover:border-white/25 transition-all duration-300`,
    
    // Ghost button
    ghost: `bg-transparent hover:bg-white/10 transition-all duration-300 text-white`,
    
    // Outline button
    outline: `border border-white/20 hover:bg-white/5 transition-all duration-300 text-white`
  },
  
  // Typography - based on landing page text styles
  typography: {
    hero: `${designTokens.typography.fontSize.hero} font-bold leading-tight`,
    h1: `${designTokens.typography.fontSize.h1} font-bold text-white`,
    h2: `${designTokens.typography.fontSize.h2} font-bold text-white`,
    h3: `${designTokens.typography.fontSize.h3} font-bold text-white`,
    h4: `${designTokens.typography.fontSize.h4} font-semibold text-white`,
    gradientText: `bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`,
    bodyPrimary: `text-gray-100`,
    bodySecondary: `text-gray-300`, 
    bodyMuted: `text-gray-400`
  },
  
  // Input components - consistent with auth pages
  input: {
    base: `block w-full rounded-md border border-gray-600 bg-gray-700/50 backdrop-filter backdrop-blur-sm px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200`,
    error: `border-red-500 focus:border-red-500 focus:ring-red-500`,
    success: `border-green-500 focus:border-green-500 focus:ring-green-500`
  },
  
  // Background patterns - from landing page
  background: {
    hero: `bg-gray-900 bg-[radial-gradient(circle_at_25%_25%,rgba(102,126,234,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(118,75,162,0.1)_0%,transparent_50%)]`,
    section: `bg-gradient-to-b from-gray-900 to-gray-800`,
    sectionAlt: `bg-gradient-to-b from-gray-800 to-gray-900`,
    darkSection: `bg-gradient-to-b from-gray-900 to-black`
  },
  
  // Badge components
  badge: {
    primary: `inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium`,
    secondary: `inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm font-medium`,
    success: `inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-sm font-medium`,
    warning: `inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 text-yellow-400 text-sm font-medium`,
    error: `inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 text-red-400 text-sm font-medium`
  },
  
  // Icon containers
  iconContainer: {
    primary: `w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center`,
    secondary: `w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center`,
    neutral: `w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center`
  },
  
  // Layout sections
  header: {
    fixed: `fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50`,
    content: `max-w-7xl mx-auto px-6 py-4`
  },
  
  // Animations - from landing page
  animations: {
    float: `animate-[float_6s_ease-in-out_infinite]`,
    fadeIn: `animate-[fadeIn_0.5s_ease-in-out]`,
    slideUp: `animate-[slideUp_0.3s_ease-out]`
  }
} as const;

// Utility function to combine classes
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Component class generators
export const createCardClass = (variant: 'base' | 'hover' | 'glass' | 'stats' | 'metrics' | 'action' | 'idea' = 'base') => {
  const baseClass = componentClasses.card.base;
  
  switch (variant) {
    case 'hover':
      return cn(baseClass, componentClasses.card.hover);
    case 'glass':
      return cn(componentClasses.card.glass);
    case 'stats':
      return cn(componentClasses.card.stats);
    case 'metrics':
      return cn(componentClasses.card.metrics, designTokens.spacing.cardPadding);
    case 'action':
      return cn(componentClasses.card.action, designTokens.spacing.cardPadding);
    case 'idea':
      return cn(componentClasses.card.idea, designTokens.spacing.cardPadding);
    default:
      return baseClass;
  }
};

export const createButtonClass = (variant: 'primary' | 'secondary' | 'ghost' | 'outline' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  const baseClass = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClass = componentClasses.button[variant];
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm' :
                   size === 'lg' ? 'px-8 py-3 text-lg' :
                   'px-6 py-2.5 text-base';
  return cn(baseClass, variantClass, sizeClass);
};