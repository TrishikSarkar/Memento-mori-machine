import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  variant?: 'past' | 'current' | 'future' | 'memory' | 'neutral' | 'chapter';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  past: 'bg-white/10 text-[#F2F0EA] border border-white/15',
  current: 'bg-[#D49B4B]/20 text-[#E5A863] border border-[#D49B4B]/40',
  future: 'bg-white/5 text-[#8B8984] border border-white/10',
  memory: 'bg-[#D49B4B]/25 text-[#F2F0EA] border border-[#D49B4B]/50',
  neutral: 'bg-white/5 text-[#8B8984] border border-white/10',
  chapter: 'bg-purple-950/40 text-purple-300 border border-purple-700/40',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
