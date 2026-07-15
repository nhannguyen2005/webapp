import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary:   { background: 'linear-gradient(135deg,#CA8A04,#FBBF24)', color: '#0C0A09' },
  secondary: { background: 'rgba(202,138,4,0.15)', color: '#FBBF24', border: '1px solid rgba(202,138,4,0.3)' },
  outline:   { background: 'transparent', color: '#CA8A04', border: '1px solid #CA8A04' },
  ghost:     { background: 'rgba(255,255,255,0.05)', color: '#D6D3D1', border: '1px solid rgba(255,255,255,0.08)' },
  danger:    { background: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' },
  success:   { background: 'rgba(16,185,129,0.12)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)' },
};

const HOVER_VARIANTS: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary:   { filter: 'brightness(1.1)', boxShadow: '0 8px 24px rgba(202,138,4,0.3)' },
  secondary: { background: 'rgba(202,138,4,0.25)' },
  outline:   { background: 'rgba(202,138,4,0.08)' },
  ghost:     { background: 'rgba(255,255,255,0.1)' },
  danger:    { background: 'rgba(239,68,68,0.2)' },
  success:   { background: 'rgba(16,185,129,0.2)' },
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg',
  md: 'h-11 px-6 text-base rounded-xl',
  lg: 'h-14 px-8 text-lg rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const [hovered, setHovered] = React.useState(false);

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
          'disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] cursor-pointer',
          SIZES[size],
          className,
        )}
        style={{
          ...VARIANTS[variant],
          ...(hovered ? HOVER_VARIANTS[variant] : {}),
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
