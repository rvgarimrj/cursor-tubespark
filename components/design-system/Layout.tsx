/**
 * TubeSpark Design System - Layout Components
 * Reusable layout components following landing page visual identity
 */

import React from 'react';
import { cn } from '@/lib/design-system/components';
import { componentClasses } from '@/lib/design-system/components';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn(componentClasses.container, className)}>
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  background?: 'hero' | 'section' | 'sectionAlt' | 'darkSection' | 'none';
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  background = 'section',
  className,
  id
}) => {
  const backgroundClass = background !== 'none' ? componentClasses.background[background] : '';
  
  return (
    <section 
      id={id}
      className={cn(
        componentClasses.section,
        backgroundClass,
        className
      )}
    >
      <Container>
        {children}
      </Container>
    </section>
  );
};

// Hero section with pattern background
export const HeroSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <section className={cn(
      "min-h-screen flex items-center justify-center pt-20",
      componentClasses.background.hero,
      className
    )}>
      <Container>
        <div className="text-center">
          {children}
        </div>
      </Container>
    </section>
  );
};

// Grid layouts commonly used in the landing page
export const FeatureGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 3, className }) => {
  const gridClass = columns === 2 ? 'md:grid-cols-2' :
                   columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                   'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cn(`grid grid-cols-1 ${gridClass} gap-8`, className)}>
      {children}
    </div>
  );
};

export const StatsGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", className)}>
      {children}
    </div>
  );
};

// Header component following landing page style
export const Header: React.FC<{
  children: React.ReactNode;
  fixed?: boolean;
  className?: string;
}> = ({ children, fixed = true, className }) => {
  return (
    <header className={cn(
      fixed ? componentClasses.header.fixed : "w-full border-b border-gray-800/50 bg-gray-900",
      className
    )}>
      <div className={componentClasses.header.content}>
        {children}
      </div>
    </header>
  );
};

// Footer component
export const Footer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <footer className={cn(
      "bg-black border-t border-gray-800 py-12",
      className
    )}>
      <Container>
        {children}
      </Container>
    </footer>
  );
};

// Page wrapper for consistent dark theme
export const PageWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("flex min-h-screen flex-col bg-gray-900 text-white overflow-x-hidden", className)}>
      {children}
    </div>
  );
};

// Section divider from landing page
export const SectionDivider: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn(
      "h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-20",
      className
    )} />
  );
};

// Floating elements container for animations
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: string;
  className?: string;
}> = ({ children, position, delay = '0s', className }) => {
  const positionClass = {
    'top-left': 'absolute top-32 left-10',
    'top-right': 'absolute top-60 right-20', 
    'bottom-left': 'absolute bottom-32 left-20',
    'bottom-right': 'absolute bottom-60 right-10'
  }[position];

  return (
    <div 
      className={cn(positionClass, componentClasses.animations.float, className)}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};