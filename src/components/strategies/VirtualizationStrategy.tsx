import { useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppStore } from '@/store/app-store';
import { useDomCount } from '@/hooks/use-dom-count';
import { useMergeRefs } from '@/hooks/use-merge-refs';
import { useRenderTimer } from '@/hooks/use-render-timer';
import { generateItem } from '@/lib/data-generator';
import { VIRTUAL_ITEM_HEIGHT, VIRTUAL_OVERSCAN } from '@/constants';
import { StrategyPanel } from './StrategyPanel';
import { ListItemComponent } from '@/components/items/ListItem';
import { EmptyState } from '@/components/items/EmptyState';

/* eslint-disable react-hooks/incompatible-library */
export function VirtualizationStrategy() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const theme = useAppStore((s) => s.theme);
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const updateMetrics = useAppStore((s) => s.updateMetrics);
  const metrics = useAppStore((s) => s.metrics.virtual);

  const parentRef = useRef<HTMLDivElement>(null);
  const { containerRef, domNodeCount } = useDomCount();
  const mergedRef = useMergeRefs(parentRef, containerRef);

  const virtualizer = useVirtualizer({
    count: networkSpeed === 'offline' ? 0 : datasetSize,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUAL_ITEM_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
    useFlushSync: false,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const renderTime = useRenderTimer([virtualItems.length, datasetSize, theme]);

  const getVisibleRange = useCallback((): [number, number] => {
    if (virtualItems.length === 0) return [0, 0];
    return [virtualItems[0].index, virtualItems[virtualItems.length - 1].index];
  }, [virtualItems]);

  useEffect(() => {
    const range = getVisibleRange();
    updateMetrics('virtual', {
      domNodeCount,
      itemsLoaded: virtualItems.length,
      renderTimeMs: renderTime,
      visibleRange: range,
    });
  }, [domNodeCount, virtualItems.length, renderTime, getVisibleRange, updateMetrics]);

  // Scroll to top when dataset changes
  useEffect(() => {
    virtualizer.scrollToIndex(0);
  }, [datasetSize, theme, virtualizer]);

  if (networkSpeed === 'offline') {
    return (
      <StrategyPanel type="virtual" metrics={metrics}>
        <div style={{ height: 400 }}>
          <EmptyState type="offline" />
        </div>
      </StrategyPanel>
    );
  }

  return (
    <StrategyPanel type="virtual" metrics={metrics}>
      <div
        ref={mergedRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{ height: 400 }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const item = generateItem(virtualRow.index, theme);
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ListItemComponent item={item} theme={theme} />
              </div>
            );
          })}
        </div>
      </div>
    </StrategyPanel>
  );
}
