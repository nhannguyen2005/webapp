import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-body text-sm font-medium mb-1.5"
            style={{ color: '#A8A29E' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all duration-200',
              className,
            )}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: error
                ? '1px solid rgba(239,68,68,0.6)'
                : '1px solid rgba(255,255,255,0.1)',
              color: '#F5F5F0',
              ...(error ? {} : {}),
              ...style,
            }}
            onFocus={e => {
              if (!error) {
                e.currentTarget.style.borderColor = 'rgba(202,138,4,0.6)';
                e.currentTarget.style.background   = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow    = '0 0 0 3px rgba(202,138,4,0.1)';
              }
            }}
            onBlur={e => {
              if (!error) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.background   = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow    = 'none';
              }
            }}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className="mt-1.5 font-body text-xs"
            style={{ color: error ? '#FCA5A5' : '#78716C' }}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
