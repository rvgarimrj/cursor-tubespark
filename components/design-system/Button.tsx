/**
 * TubeSpark Design System - Button Component
 * Reusable button component following landing page visual identity
 */

import React from 'react';
import Link from 'next/link';
import { cn, createButtonClass } from '@/lib/design-system/components';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

interface ButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  href?: never;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  onClick?: never;
  type?: never;
}

type TubeSparkButtonProps = ButtonProps | LinkButtonProps;

export const Button: React.FC<TubeSparkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  loading = false,
  href,
  ...props
}) => {
  const buttonClass = cn(
    createButtonClass(variant, size),
    className
  );

  const content = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...(props as ButtonProps)}
    >
      {content}
    </button>
  );
};

// Specialized button variants
export const CTAButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: 'md' | 'lg';
  className?: string;
}> = ({ children, href, onClick, size = 'lg', className }) => {
  return (
    <Button
      variant="primary"
      size={size}
      href={href}
      onClick={onClick}
      className={cn("px-12 py-4 rounded-xl text-lg font-semibold", className)}
    >
      {children}
    </Button>
  );
};

export const GradientButton: React.FC<{
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, gradient = 'primary', href, onClick, className }) => {
  const gradientClass = gradient === 'primary' 
    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
    : 'bg-gradient-to-r from-pink-500 to-red-500';
    
  return (
    <Button
      variant="primary"
      href={href}
      onClick={onClick}
      className={cn(gradientClass, className)}
    >
      {children}
    </Button>
  );
};

export const IconButton: React.FC<{
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  className?: string;
}> = ({ icon, label, variant = 'ghost', onClick, className }) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2",
        !label && "w-10 h-10 p-0",
        className
      )}
    >
      {icon}
      {label && <span>{label}</span>}
    </Button>
  );
};