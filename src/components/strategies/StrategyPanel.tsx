import type { ReactNode } from 'react';
import type { StrategyMetrics, StrategyType } from '@/types';
import { cn } from '@/lib/cn';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { STRATEGY_INFO } from '@/constants';
import { Info } from 'lucide-react';

interface StrategyPanelProps {
  type: StrategyType;
  metrics: StrategyMetrics;
  children: ReactNode;
  footer?: ReactNode;
}

export function StrategyPanel({
  type,
  metrics,
  children,
  footer,
}: StrategyPanelProps) {
  const info = STRATEGY_INFO[type];

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-border"
        style={{ borderTopColor: info.color, borderTopWidth: 3 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            {info.label}
          </h3>
          <Tooltip
            content={
              <div>
                <p className="mb-2">{info.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium text-green-400 mb-1">Pros</p>
                    <ul className="space-y-0.5">
                      {info.pros.map((p) => (
                        <li key={p}>+ {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-400 mb-1">Cons</p>
                    <ul className="space-y-0.5">
                      {info.cons.map((c) => (
                        <li key={c}>- {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            }
          >
            <button
              aria-label={`Learn about ${info.label}`}
              className="text-text-muted hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pagination rounded-md p-0.5 cursor-pointer"
            >
              <Info className="w-4 h-4" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
        <p className="text-[11px] text-text-muted mt-0.5">{info.description}</p>
      </div>

      {/* Content area */}
      <div className={cn('flex-1 overflow-hidden flex flex-col min-h-0')}>
        {children}
      </div>

      {/* Footer (pagination controls, etc.) */}
      {footer}

      {/* Metrics bar */}
      <MetricsBar metrics={metrics} />
    </div>
  );
}
