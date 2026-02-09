import { cn } from '@/lib/cn';
import type { HealthStatus } from '@/types';
import { HEALTH_THRESHOLDS } from '@/constants';

interface HealthIndicatorProps {
  domCount: number;
}

function getHealth(domCount: number): HealthStatus {
  if (domCount < HEALTH_THRESHOLDS.good) return 'good';
  if (domCount < HEALTH_THRESHOLDS.warn) return 'warn';
  return 'bad';
}

const HEALTH_LABELS: Record<HealthStatus, string> = {
  good: 'Healthy',
  warn: 'Moderate',
  bad: 'Heavy',
};

export function HealthIndicator({ domCount }: HealthIndicatorProps) {
  const health = getHealth(domCount);

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          {
            good: 'bg-health-good',
            warn: 'bg-health-warn',
            bad: 'bg-health-bad animate-health-pulse',
          }[health],
        )}
      />
      <span
        className={cn('text-[10px] font-medium', {
          good: 'text-health-good',
          warn: 'text-health-warn',
          bad: 'text-health-bad',
        }[health])}
      >
        {HEALTH_LABELS[health]}
      </span>
    </div>
  );
}
