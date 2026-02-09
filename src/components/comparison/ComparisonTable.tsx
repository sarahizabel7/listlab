import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/cn';
import { HEALTH_THRESHOLDS } from '@/constants';
import type { HealthStatus, StrategyMetrics } from '@/types';

function getHealth(domCount: number): HealthStatus {
  if (domCount < HEALTH_THRESHOLDS.good) return 'good';
  if (domCount < HEALTH_THRESHOLDS.warn) return 'warn';
  return 'bad';
}

function isMeasured(m: StrategyMetrics): boolean {
  return m.domNodeCount > 0 || m.itemsLoaded > 0;
}

const STRATEGY_LABELS = [
  { key: 'pagination' as const, label: 'Pagination', color: 'bg-pagination' },
  { key: 'infinite' as const, label: 'Infinite Scroll', color: 'bg-infinite' },
  { key: 'virtual' as const, label: 'Virtualization', color: 'bg-virtual' },
];

export function ComparisonTable() {
  const metrics = useAppStore((s) => s.metrics);
  const activeStrategy = useAppStore((s) => s.activeStrategy);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 text-text-muted font-medium">
              Strategy
            </th>
            <th className="text-right py-2 px-3 text-text-muted font-medium">
              DOM Nodes
            </th>
            <th className="text-right py-2 px-3 text-text-muted font-medium">
              Items Loaded
            </th>
            <th className="text-right py-2 px-3 text-text-muted font-medium">
              Render Time
            </th>
            <th className="text-right py-2 pl-3 text-text-muted font-medium">
              Health
            </th>
          </tr>
        </thead>
        <tbody>
          {STRATEGY_LABELS.map(({ key, label, color }) => {
            const m = metrics[key];
            const measured = isMeasured(m);
            const isActive = activeStrategy === key;
            const health = measured ? getHealth(m.domNodeCount) : null;

            return (
              <tr
                key={key}
                className={cn(
                  'border-b border-border-light',
                  isActive && 'bg-surface-hover/50',
                )}
              >
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', color)} />
                    <span className="font-medium text-text-primary">
                      {label}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                {measured ? (
                  <>
                    <td className="text-right py-2.5 px-3 font-mono text-text-secondary tabular-nums">
                      {m.domNodeCount}
                    </td>
                    <td className="text-right py-2.5 px-3 font-mono text-text-secondary tabular-nums">
                      {m.itemsLoaded}
                    </td>
                    <td className="text-right py-2.5 px-3 font-mono text-text-secondary tabular-nums">
                      {m.renderTimeMs}ms
                    </td>
                    <td className="text-right py-2.5 pl-3">
                      {health && (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 font-medium',
                            {
                              good: 'text-health-good',
                              warn: 'text-health-warn',
                              bad: 'text-health-bad',
                            }[health],
                          )}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              {
                                good: 'bg-health-good',
                                warn: 'bg-health-warn',
                                bad: 'bg-health-bad',
                              }[health],
                            )}
                          />
                          {{ good: 'Healthy', warn: 'Moderate', bad: 'Heavy' }[health]}
                        </span>
                      )}
                    </td>
                  </>
                ) : (
                  <td
                    colSpan={4}
                    className="text-right py-2.5 px-3 text-text-muted italic"
                  >
                    Switch to measure
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
