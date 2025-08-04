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
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
      start: '#ff6b6b', 
      end: '#ff8e53'
    },
    
    // Dashboard specific dark theme - from mockup
    dashboard: {
      // Background colors - matching mockup CSS variables
      bgPrimary: '#0f172a',    // --bg-primary from mockup
      bgSecondary: '#1e293b',  // --bg-secondary from mockup  
      bgTertiary: '#334155',   // --bg-tertiary from mockup
      
      // Text colors - matching mockup
      textPrimary: '#f8fafc',    // --text-primary from mockup
      textSecondary: '#e2e8f0',  // --text-secondary from mockup
      textTertiary: '#94a3b8',   // --text-tertiary from mockup
      textMuted: '#64748b',      // --text-muted from mockup
      
      // Border and surface colors
      borderPrimary: 'rgba(255, 255, 255, 0.1)',  // --border-primary from mockup
      surface1: 'rgba(255, 255, 255, 0.05)',      // --surface-1 from mockup
      surface2: 'rgba(255, 255, 255, 0.08)',      // --surface-2 from mockup
      surface3: 'rgba(255, 255, 255, 0.12)',      // --surface-3 from mockup
    },
    
    // Background system (keeping for compatibility)
    background: {
      primary: '#0f172a', // Updated to match mockup
      secondary: '#1e293b', // Updated to match mockup
      tertiary: '#334155', // Updated to match mockup
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
      glass: 'rgba(255, 255, 255, 0.05)'
    },
    
    // Text colors (updated to match mockup)
    text: {
      primary: '#f8fafc',   // Updated to match mockup
      secondary: '#e2e8f0', // Updated to match mockup  
      muted: '#94a3b8',     // Updated to match mockup
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
    buttonHover: 'transform: translateY(-2px); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);',
    
    // Dashboard specific effects from mockup
    dashboardCard: 'backdrop-filter: blur(20px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    dashboardCardHover: 'transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);',
    metricsCard: 'background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.04) 100%); border: 1px solid rgba(102, 126, 234, 0.15);',
    actionCardHover: 'transform: translateY(-4px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);',
    
    // Button effects from mockup
    primaryButton: 'box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);',
    primaryButtonHover: 'transform: translateY(-2px); box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);',
    secondaryButton: 'backdrop-filter: blur(10px);',
    
    // Search input focus effect
    searchFocus: 'border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);'
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