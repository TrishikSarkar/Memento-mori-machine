import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#D49B4B]',
          {
            // Variants
            'bg-[#F2F0EA] text-[#090909] hover:bg-white active:bg-[#E2DFD6] shadow-sm':
              variant === 'primary',
            'bg-[#181818] text-[#F2F0EA] border border-white/10 hover:border-white/20 hover:bg-[#202020] active:bg-[#151515]':
              variant === 'secondary',
            'bg-transparent text-[#8B8984] hover:text-[#F2F0EA] hover:bg-white/5 active:bg-white/10':
              variant === 'ghost',
            'bg-[#D49B4B] text-[#090909] hover:bg-[#E2A755] active:bg-[#C28939] shadow-sm font-semibold':
              variant === 'amber',
            'bg-red-950/40 text-red-300 border border-red-800/30 hover:bg-red-900/50 hover:border-red-700/50 active:bg-red-900/70':
              variant === 'danger',

            // Sizes
            'text-xs px-2.5 py-1.5 gap-1.5': size === 'sm',
            'text-sm px-4 py-2 gap-2': size === 'md',
            'text-base px-5 py-2.5 gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
