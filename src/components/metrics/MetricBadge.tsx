import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface MetricBadgeProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function MetricBadge({ icon, label, value, className }: MetricBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[10px] text-text-muted',
        className,
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}:</span>
      <span className="font-mono font-medium text-text-secondary">{value}</span>
    </div>
  );
}
