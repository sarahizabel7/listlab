import type { StrategyMetrics } from '@/types';
import { MetricBadge } from './MetricBadge';
import { HealthIndicator } from './HealthIndicator';
import { Boxes, Eye, Timer, Layers } from 'lucide-react';

interface MetricsBarProps {
  metrics: StrategyMetrics;
}

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap px-4 py-2 bg-surface-dim border-t border-border-light">
      <HealthIndicator domCount={metrics.domNodeCount} />
      <div className="w-px h-3 bg-border" />
      <MetricBadge
        icon={<Boxes className="w-3 h-3" />}
        label="DOM"
        value={metrics.domNodeCount}
      />
      <MetricBadge
        icon={<Layers className="w-3 h-3" />}
        label="Loaded"
        value={metrics.itemsLoaded}
      />
      <MetricBadge
        icon={<Timer className="w-3 h-3" />}
        label="Render"
        value={`${metrics.renderTimeMs}ms`}
      />
      <MetricBadge
        icon={<Eye className="w-3 h-3" />}
        label="Visible"
        value={`${metrics.visibleRange[0]}-${metrics.visibleRange[1]}`}
      />
    </div>
  );
}
