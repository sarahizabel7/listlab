import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/cn';
import type { StrategyType } from '@/types';
import { STRATEGY_INFO } from '@/constants';
import { Layers, ScrollText, Zap } from 'lucide-react';

const STRATEGY_TABS: {
  type: StrategyType;
  icon: React.ReactNode;
}[] = [
  { type: 'pagination', icon: <Layers className="w-4 h-4" /> },
  { type: 'infinite', icon: <ScrollText className="w-4 h-4" /> },
  { type: 'virtual', icon: <Zap className="w-4 h-4" /> },
];

const STRATEGY_COLORS: Record<StrategyType, string> = {
  pagination: 'bg-pagination text-white shadow-pagination/25',
  infinite: 'bg-infinite text-white shadow-infinite/25',
  virtual: 'bg-virtual text-white shadow-virtual/25',
};

const STRATEGY_RING: Record<StrategyType, string> = {
  pagination: 'focus-visible:ring-pagination',
  infinite: 'focus-visible:ring-infinite',
  virtual: 'focus-visible:ring-virtual',
};

export function StrategySwitcher() {
  const activeStrategy = useAppStore((s) => s.activeStrategy);
  const setActiveStrategy = useAppStore((s) => s.setActiveStrategy);

  return (
    <nav
      aria-label="Strategy selector"
      className="flex items-stretch gap-3"
      role="tablist"
    >
      {STRATEGY_TABS.map(({ type, icon }) => {
        const info = STRATEGY_INFO[type];
        const isActive = activeStrategy === type;

        return (
          <button
            key={type}
            role="tab"
            aria-selected={isActive}
            aria-controls={`strategy-panel-${type}`}
            onClick={() => setActiveStrategy(type)}
            className={cn(
              'group relative flex-1 rounded-xl px-4 py-3 text-left transition-all duration-200 cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              STRATEGY_RING[type],
              isActive
                ? cn(STRATEGY_COLORS[type], 'shadow-lg')
                : 'bg-surface border border-border hover:border-border/80 hover:shadow-sm',
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg transition-colors',
                  isActive
                    ? 'bg-white/20'
                    : 'bg-surface-dim text-text-muted group-hover:text-text-secondary',
                )}
              >
                {icon}
              </span>
              <div className="min-w-0">
                <span
                  className={cn(
                    'block text-sm font-semibold leading-tight',
                    !isActive && 'text-text-primary',
                  )}
                >
                  {info.label}
                </span>
                <span
                  className={cn(
                    'block text-[10px] leading-tight mt-0.5 truncate',
                    isActive ? 'text-white/70' : 'text-text-muted',
                  )}
                >
                  {type === 'pagination' && 'Fixed page size'}
                  {type === 'infinite' && 'Progressive loading'}
                  {type === 'virtual' && 'Viewport-only rendering'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
