/**
 * TubeSpark Design System - Typography Components
 * Reusable typography components following landing page visual identity
 */

import React from 'react';
import { cn } from '@/lib/design-system/components';
import { componentClasses } from '@/lib/design-system/components';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Heading components
export const HeroTitle: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h1 className={cn(componentClasses.typography.hero, className)}>
      {children}
    </h1>
  );
};

export const H1: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h1 className={cn(componentClasses.typography.h1, className)}>
      {children}
    </h1>
  );
};

export const H2: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h2 className={cn(componentClasses.typography.h2, className)}>
      {children}
    </h2>
  );
};

export const H3: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h3 className={cn(componentClasses.typography.h3, className)}>
      {children}
    </h3>
  );
};

export const H4: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <h4 className={cn(componentClasses.typography.h4, className)}>
      {children}
    </h4>
  );
};

// Text components
export const GradientText: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <span className={cn(componentClasses.typography.gradientText, className)}>
      {children}
    </span>
  );
};

export const BodyText: React.FC<TypographyProps & { variant?: 'primary' | 'secondary' | 'muted' }> = ({ 
  children, 
  variant = 'primary', 
  className 
}) => {
  const variantClass = variant === 'primary' ? componentClasses.typography.bodyPrimary :
                      variant === 'secondary' ? componentClasses.typography.bodySecondary :
                      componentClasses.typography.bodyMuted;
  
  return (
    <p className={cn(variantClass, className)}>
      {children}
    </p>
  );
};

export const SubtitleText: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <p className={cn("text-xl md:text-2xl text-gray-300 leading-relaxed font-light", className)}>
      {children}
    </p>
  );
};

// Badge and label components
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  className?: string;
}> = ({ children, variant = 'primary', icon, className }) => {
  const variantClass = componentClasses.badge[variant];
  
  return (
    <div className={cn(variantClass, className)}>
      {icon && <div className="w-2 h-2 bg-current rounded-full" />}
      <span>{children}</span>
    </div>
  );
};

// Section components with consistent styling
export const SectionHeader: React.FC<{
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  className?: string;
}> = ({ title, titleHighlight, subtitle, className }) => {
  return (
    <div className={cn("text-center mb-16", className)}>
      <H2 className="mb-6">
        <span className="text-white">{title}</span>
        {titleHighlight && (
          <>
            <br />
            <GradientText>{titleHighlight}</GradientText>
          </>
        )}
      </H2>
      {subtitle && (
        <SubtitleText>{subtitle}</SubtitleText>
      )}
    </div>
  );
};

// Problem/solution highlight text components
export const ProblemTitle: React.FC<{
  title: string;
  titleHighlight: string;
  subtitle?: string;
  className?: string;
}> = ({ title, titleHighlight, subtitle, className }) => {
  return (
    <div className={cn("text-center mb-16", className)}>
      <H2 className="mb-6">
        <span className="text-white">{title}</span>
        <br />
        <span className="text-red-400">{titleHighlight}</span>
      </H2>
      {subtitle && (
        <SubtitleText>{subtitle}</SubtitleText>
      )}
    </div>
  );
};

// Testimonial text component
export const TestimonialQuote: React.FC<{
  quote: string;
  author: string;
  role: string;
  result?: string;
  className?: string;
}> = ({ quote, author, role, result, className }) => {
  return (
    <div className={cn("bg-gray-800/30 border border-gray-700 rounded-2xl p-6", className)}>
      <p className="text-gray-300 mb-4 italic">"{quote}"</p>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-white">{author}</div>
          <div className="text-gray-400 text-sm">{role}</div>
        </div>
        {result && (
          <div className="text-green-400 text-sm font-medium">
            📈 {result}
          </div>
        )}
      </div>
    </div>
  );
};