import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'pagination' | 'infinite' | 'virtual' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
        {
          default: 'bg-surface-hover text-text-secondary',
          pagination: 'bg-pagination-light text-pagination',
          infinite: 'bg-infinite-light text-infinite',
          virtual: 'bg-virtual-light text-virtual',
          muted: 'bg-surface-dim text-text-muted',
        }[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
