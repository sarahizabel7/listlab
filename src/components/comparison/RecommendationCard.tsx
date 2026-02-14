import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { getRecommendation } from '@/lib/recommend';
import { cn } from '@/lib/cn';
import { STRATEGY_INFO } from '@/constants';
import type { StrategyType } from '@/types';
import {
  Sparkles,
  Layers,
  ScrollText,
  Zap,
  Combine,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

const STRATEGY_ICONS: Record<StrategyType, React.ReactNode> = {
  pagination: <Layers className="w-5 h-5" />,
  infinite: <ScrollText className="w-5 h-5" />,
  virtual: <Zap className="w-5 h-5" />,
  hybrid: <Combine className="w-5 h-5" />,
};

const STRATEGY_ACCENT: Record<StrategyType, string> = {
  pagination:
    'from-pagination/10 to-pagination/5 border-pagination/20',
  infinite:
    'from-infinite/10 to-infinite/5 border-infinite/20',
  virtual:
    'from-virtual/10 to-virtual/5 border-virtual/20',
  hybrid:
    'from-hybrid/10 to-hybrid/5 border-hybrid/20',
};

const STRATEGY_ICON_BG: Record<StrategyType, string> = {
  pagination: 'bg-pagination/15 text-pagination',
  infinite: 'bg-infinite/15 text-infinite',
  virtual: 'bg-virtual/15 text-virtual',
  hybrid: 'bg-hybrid/15 text-hybrid',
};

const STRATEGY_BUTTON: Record<StrategyType, string> = {
  pagination: 'bg-pagination hover:bg-pagination/90 focus-visible:ring-pagination',
  infinite: 'bg-infinite hover:bg-infinite/90 focus-visible:ring-infinite',
  virtual: 'bg-virtual hover:bg-virtual/90 focus-visible:ring-virtual',
  hybrid: 'bg-hybrid hover:bg-hybrid/90 focus-visible:ring-hybrid',
};

export function RecommendationCard() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const theme = useAppStore((s) => s.theme);
  const activeStrategy = useAppStore((s) => s.activeStrategy);
  const setActiveStrategy = useAppStore((s) => s.setActiveStrategy);

  const recommendation = useMemo(
    () => getRecommendation(datasetSize, networkSpeed, theme),
    [datasetSize, networkSpeed, theme],
  );

  const info = STRATEGY_INFO[recommendation.strategy];
  const isAlreadyActive = activeStrategy === recommendation.strategy;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-5',
        STRATEGY_ACCENT[recommendation.strategy],
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              STRATEGY_ICON_BG[recommendation.strategy],
            )}
          >
            {STRATEGY_ICONS[recommendation.strategy]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Recommended Strategy
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary mt-0.5 text-pretty">
              {info.label}
            </h3>
          </div>
        </div>

        {/* Confidence badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold',
            recommendation.confidence === 'high'
              ? 'bg-health-good/10 text-health-good'
              : 'bg-amber-500/10 text-amber-600',
          )}
        >
          {recommendation.confidence === 'high' ? (
            <ShieldCheck className="w-3 h-3" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-3 h-3" aria-hidden="true" />
          )}
          {recommendation.confidence === 'high' ? 'High Confidence' : 'Moderate Confidence'}
        </div>
      </div>

      {/* Reason */}
      <p className="text-sm font-medium text-text-primary mb-1">
        {recommendation.reason}
      </p>
      <p className="text-xs text-text-secondary leading-relaxed mb-4">
        {recommendation.details}
      </p>

      {/* Context tags */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center rounded-md bg-surface/80 px-2 py-1 text-[10px] font-mono text-text-secondary border border-border/50">
          {datasetSize.toLocaleString()} items
        </span>
        <span className="inline-flex items-center rounded-md bg-surface/80 px-2 py-1 text-[10px] font-mono text-text-secondary border border-border/50">
          {networkSpeed} network
        </span>
      </div>

      {/* CTA */}
      {!isAlreadyActive ? (
        <button
          onClick={() => setActiveStrategy(recommendation.strategy)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all shadow-sm cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'active:scale-[0.98]',
            STRATEGY_BUTTON[recommendation.strategy],
          )}
        >
          Try {info.label}
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-health-good bg-health-good/10">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          Currently Active
        </div>
      )}
    </div>
  );
}
