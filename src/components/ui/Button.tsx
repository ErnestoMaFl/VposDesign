import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'ghost-destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 1. Clases Base (Aplicables a todos)
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-utility font-medium transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    // 2. Variantes de Color
    const variants = {
      primary: 'bg-accent-sage text-[#daffe8] hover:brightness-10 shadow-[0_4px_15px_rgba(77,122,99,0.2)] hover:shadow-[0_4px_25px_rgba(77,122,99,0.4)]',
      // Secundario aclarado para que no parezca un hoyo oscuro
      secondary: 'bg-surface-high hover:bg-surface-highest text-on-surface-variant hover:text-on-surface border border-surface-bright-edge/20',
      
      // Destructivo más limpio y potente en hover
      destructive: 'bg-error/10 hover:bg-error text-error hover:text-white border border-error/20 hover:border-error hover:shadow-[0_0_20px_rgba(155,68,68,0.4)]',
      ghost: 'bg-transparent hover:bg-surface-low text-on-surface-variant hover:text-on-surface',
      'ghost-destructive': 'bg-transparent hover:bg-error/15 text-on-surface-variant hover:text-error',
      outline: 'bg-transparent border border-surface-bright-edge/30 hover:border-accent-navy/40 text-on-surface-variant hover:text-accent-navy',
    };

    // 3. Tamaños (Paddings y Tipografía)
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-4 text-base rounded-2xl',
      icon: 'p-2 rounded-lg', // Ideal para basureros o botones X normales
      'icon-sm': 'p-1 rounded', // Ideal para botones pequeñitos dentro de listas
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';