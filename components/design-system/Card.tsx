/**
 * TubeSpark Design System - Card Component
 * Reusable card component following landing page visual identity
 */

import React from 'react';
import { cn, createCardClass } from '@/lib/design-system/components';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hover' | 'glass' | 'stats';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'base', 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(createCardClass(variant), className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Specialized card variants for common use cases
export const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
  className?: string;
}> = ({ icon, title, description, highlight, className }) => {
  return (
    <Card variant="hover" className={className}>
      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      {highlight && (
        <div className="text-blue-400 text-sm font-medium">
          ✨ {highlight}
        </div>
      )}
    </Card>
  );
};

export const StatsCard: React.FC<{
  value: string | number;
  label: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  className?: string;
}> = ({ value, label, change, changeType = 'neutral', className }) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' :
                     changeType === 'decrease' ? 'text-red-400' :
                     'text-gray-400';
  
  return (
    <Card variant="stats" className={cn("text-center", className)}>
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-gray-300 text-sm mb-2">{label}</div>
      {change && (
        <div className={cn("text-xs font-medium", changeColor)}>
          {change}
        </div>
      )}
    </Card>
  );
};

export const ProblemCard: React.FC<{
  emoji: string;
  title: string;
  description: string;
  stat: string;
  className?: string;
}> = ({ emoji, title, description, stat, className }) => {
  return (
    <div className={cn(
      "bg-gradient-to-br from-red-500/10 to-pink-500/10 border-l-4 border-red-500 p-8 rounded-2xl",
      className
    )}>
      <div className="text-3xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-red-400 text-sm font-medium">{stat}</div>
    </div>
  );
};

export const SolutionCard: React.FC<{
  step: number;
  title: string;
  description: string;
  className?: string;
}> = ({ step, title, description, className }) => {
  const stepColors = [
    'bg-blue-600',
    'bg-purple-600', 
    'bg-green-600'
  ];
  
  return (
    <div className={cn("text-center", className)}>
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold",
        stepColors[step - 1] || 'bg-gray-600'
      )}>
        {step}
      </div>
      <h4 className="text-lg font-bold mb-3 text-white">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};