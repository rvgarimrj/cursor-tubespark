/**
 * TubeSpark Design System - Design Tokens
 * Centralized design tokens for consistent visual identity across the application
 */

export const designTokens = {
  // Color System
  colors: {
    // Primary brand colors from landing page
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      start: '#667eea',
      end: '#764ba2',
      text: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
    },
    
    // Secondary brand colors
    secondary: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      start: '#f093fb', 
      end: '#f5576c'
    },
    
    // Background system
    background: {
      primary: '#111827', // gray-900
      secondary: '#1f2937', // gray-800  
      tertiary: '#000000', // black
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
      glass: 'rgba(255, 255, 255, 0.05)'
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db', // gray-300
      muted: '#9ca3af', // gray-400
      accent: '#667eea'
    },
    
    // State colors
    success: '#10b981', // green-500
    warning: '#f59e0b', // yellow-500  
    error: '#ef4444', // red-500
    info: '#3b82f6' // blue-500
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'monospace']
    },
    
    fontSize: {
      hero: 'text-5xl md:text-7xl',
      h1: 'text-4xl md:text-5xl', 
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      body: 'text-base',
      small: 'text-sm',
      xs: 'text-xs'
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // Spacing
  spacing: {
    section: 'py-20',
    container: 'max-w-7xl mx-auto px-6',
    cardPadding: 'p-6',
    cardPaddingLarge: 'p-8'
  },
  
  // Border radius
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl', 
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  },
  
  // Shadows and effects
  effects: {
    glass: 'backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);',
    glow: 'box-shadow: 0 0 50px rgba(102, 126, 234, 0.3);',
    cardHover: 'transform: translateY(-8px); box-shadow: 0 20px 40px rgba(102, 126, 234, 0.1);',
    buttonHover: 'transform: translateY(-2px); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);'
  },
  
  // Animation
  animation: {
    float: 'float 6s ease-in-out infinite',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out'
  }
} as const;

// CSS custom properties generator
export const generateCSSVariables = () => {
  return `
    :root {
      --color-primary-start: ${designTokens.colors.primary.start};
      --color-primary-end: ${designTokens.colors.primary.end};
      --color-secondary-start: ${designTokens.colors.secondary.start};
      --color-secondary-end: ${designTokens.colors.secondary.end};
      --color-bg-primary: ${designTokens.colors.background.primary};
      --color-bg-secondary: ${designTokens.colors.background.secondary};
      --color-bg-tertiary: ${designTokens.colors.background.tertiary};
      --color-text-primary: ${designTokens.colors.text.primary};
      --color-text-secondary: ${designTokens.colors.text.secondary};
      --color-text-muted: ${designTokens.colors.text.muted};
    }
  `;
};