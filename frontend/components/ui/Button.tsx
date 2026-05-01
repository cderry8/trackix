'use client';

import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles =
    variant === 'primary'
      ? 'bg-ink text-surface hover:opacity-90 dark:bg-white dark:text-black'
      : variant === 'danger'
        ? 'bg-red-500/90 text-white hover:bg-red-500'
        : 'bg-transparent border border-ink/15 text-ink hover:bg-ink/5 dark:border-white/15 dark:hover:bg-white/5';
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99]',
        styles,
        className
      )}
      {...props}
    />
  );
}
