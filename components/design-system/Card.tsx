/**
 * TubeSpark Design System - Card Component
 * Reusable card component following landing page visual identity
 */

import React from 'react';
import { cn, createCardClass } from '@/lib/design-system/components';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hover' | 'glass' | 'stats' | 'metrics' | 'action' | 'idea';
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

// Metrics card component based on mockup design
export const MetricsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, change, icon, className }) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 backdrop-filter backdrop-blur-[20px]",
      "bg-gradient-to-br from-[rgba(102,126,234,0.08)] to-[rgba(118,75,162,0.04)]",
      "border border-[rgba(102,126,234,0.15)]",
      "hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(102,126,234,0.2)]",
      "hover:transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]",
      className
    )}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-[#94a3b8] uppercase tracking-wide">
          {title}
        </div>
        {icon && (
          <div className="text-blue-400">
            {icon}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold text-[#f8fafc] mb-2 font-mono">
        {value}
      </div>
      
      {change && (
        <div className="text-sm text-green-400 font-medium">
          {change}
        </div>
      )}
    </div>
  );
};

// Action card component for quick actions
export const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary';
  iconColor?: string;
}> = ({ icon, title, description, className, onClick, buttonText = "Criar Agora", buttonVariant = "primary", iconColor = "" }) => {
  
  const getIconBackground = () => {
    if (iconColor === 'green') return 'bg-green-600';
    if (iconColor === 'purple') return 'bg-purple-600';
    if (iconColor === 'orange') return 'bg-orange-600';
    return 'bg-gradient-to-r from-[#667eea] to-[#764ba2]';
  };

  return (
    <div 
      className={cn(
        "bg-white/5 backdrop-filter backdrop-blur-[20px] border border-white/10 rounded-2xl p-6",
        "text-center transition-all duration-300 cursor-pointer",
        "hover:bg-white/8 hover:transform hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4", getIconBackground())}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">{title}</h3>
      <p className="text-sm text-[#94a3b8] mb-4">{description}</p>
      
      {buttonVariant === 'primary' ? (
        <button className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold py-2.5 px-4 rounded-xl shadow-[0_8px_25px_rgba(102,126,234,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(102,126,234,0.4)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)">
          {buttonText}
        </button>
      ) : (
        <button className="w-full bg-white/5 text-[#f8fafc] border border-white/10 backdrop-filter backdrop-blur-[10px] font-medium py-2.5 px-4 rounded-xl hover:bg-white/8 hover:border-white/25 transition-all duration-300">
          {buttonText}
        </button>
      )}
    </div>
  );
};

// Idea card component for recent ideas
export const IdeaCard: React.FC<{
  title: string;
  description: string;
  viralScore?: number;
  estimatedViews?: string;
  tags?: string[];
  date?: string;
  className?: string;
}> = ({ title, description, viralScore, estimatedViews, tags, date, className }) => {
  return (
    <Card variant="idea" className={className}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">🔥</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#f8fafc] mb-2 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-[#94a3b8] mb-4 leading-relaxed line-clamp-3">
            {description}
          </p>
          
          <div className="flex items-center gap-3 mb-4">
            {viralScore && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
                {viralScore}/100
              </div>
            )}
            
            {estimatedViews && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r from-[rgba(255,107,107,0.15)] to-[rgba(255,142,83,0.15)] border border-[rgba(255,107,107,0.2)] text-[#ff8e53] text-xs font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {estimatedViews}
              </div>
            )}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-[#94a3b8] px-2 py-1">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {date && (
              <div className="text-sm text-[#94a3b8]">
                📅 {date}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button className="bg-white/5 text-[#f8fafc] border border-white/10 backdrop-filter backdrop-blur-[10px] font-medium hover:bg-white/8 hover:border-white/25 transition-all duration-300 text-sm py-2 px-4 rounded-lg">
                Editar
              </button>
              <button className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold shadow-[0_8px_25px_rgba(102,126,234,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(102,126,234,0.4)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) text-sm py-2 px-4 rounded-lg">
                Criar Roteiro
              </button>
            </div>
          </div>
        </div>
      </div>
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