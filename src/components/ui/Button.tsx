import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pagination focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          primary:
            'bg-pagination text-white hover:bg-pagination/90 shadow-sm',
          secondary:
            'border border-border bg-surface text-text-primary hover:bg-surface-hover',
          ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        }[variant],
        {
          sm: 'h-8 px-3 text-xs gap-1.5',
          md: 'h-9 px-4 text-sm gap-2',
        }[size],
        className,
      )}
      {...props}
    />
  );
}
