'use client';

import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
}) {
  const styles =
    variant === 'primary'
      ? 'bg-ink text-surface hover:opacity-90 dark:bg-white dark:text-black'
      : variant === 'danger'
        ? 'bg-red-500/90 text-white hover:bg-red-500'
        : 'bg-transparent border border-ink/15 text-ink hover:bg-ink/5 dark:border-white/15 dark:hover:bg-white/5';
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed',
        styles,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
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
