/* eslint-disable react-hooks/incompatible-library */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppStore } from '@/store/app-store';
import { useDomCount } from '@/hooks/use-dom-count';
import { useMergeRefs } from '@/hooks/use-merge-refs';
import { useRenderTimer } from '@/hooks/use-render-timer';
import { generateItem } from '@/lib/data-generator';
import {
  VIRTUAL_ITEM_HEIGHT,
  VIRTUAL_OVERSCAN,
  HYBRID_SCROLL_BATCH,
  NETWORK_DELAYS,
} from '@/constants';
import { StrategyPanel } from './StrategyPanel';
import { ListItemComponent } from '@/components/items/ListItem';
import { ListItemSkeleton } from '@/components/items/ListItemSkeleton';
import { EmptyState } from '@/components/items/EmptyState';
import { Loader2, Pause, Play } from 'lucide-react';

const NEAR_END_THRESHOLD = 10;

export function HybridStrategy() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const theme = useAppStore((s) => s.theme);
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const updateMetrics = useAppStore((s) => s.updateMetrics);
  const metrics = useAppStore((s) => s.metrics.hybrid);
  const paused = useAppStore((s) => s.hybridScrollPaused);
  const setPaused = useAppStore((s) => s.setHybridScrollPaused);

  const [loadedCount, setLoadedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const loadedCountRef = useRef(0);
  loadedCountRef.current = loadedCount;

  const parentRef = useRef<HTMLDivElement>(null);
  const { containerRef, domNodeCount } = useDomCount();
  const mergedRef = useMergeRefs(parentRef, containerRef);

  const hasMore = loadedCount < datasetSize && networkSpeed !== 'offline';

  const virtualizer = useVirtualizer({
    count: loadedCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUAL_ITEM_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
    useFlushSync: false,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const renderTime = useRenderTimer([virtualItems.length, loadedCount, theme]);

  const getVisibleRange = useCallback((): [number, number] => {
    if (virtualItems.length === 0) return [0, 0];
    return [virtualItems[0].index, virtualItems[virtualItems.length - 1].index];
  }, [virtualItems]);

  // Load more items in batches with simulated network delay
  const loadMore = useCallback(() => {
    if (loadingRef.current) return;

    const currentLoaded = loadedCountRef.current;
    if (currentLoaded >= datasetSize) return;

    const delay = NETWORK_DELAYS[networkSpeed];
    if (delay === -1) return;

    loadingRef.current = true;
    setLoading(true);

    const remaining = datasetSize - currentLoaded;
    const count = Math.min(HYBRID_SCROLL_BATCH, remaining);

    if (count <= 0) {
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    setTimeout(() => {
      setLoadedCount((prev) => prev + count);
      setLoading(false);
      loadingRef.current = false;
    }, delay);
  }, [datasetSize, networkSpeed]);

  // Reset when controls change
  useEffect(() => {
    setLoadedCount(0);
    loadingRef.current = false;
    setPaused(false);
    virtualizer.scrollToIndex(0);
  }, [datasetSize, theme, networkSpeed, setPaused, virtualizer]);

  // Initial load
  useEffect(() => {
    if (loadedCount === 0 && networkSpeed !== 'offline') {
      loadMore();
    }
  }, [loadedCount, networkSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Near-end detection: trigger load when approaching last loaded item
  const endIndex = virtualizer.range?.endIndex ?? 0;
  useEffect(() => {
    if (
      endIndex >= loadedCount - NEAR_END_THRESHOLD &&
      !loading &&
      hasMore &&
      !paused
    ) {
      loadMore();
    }
  }, [endIndex, loadedCount, loading, hasMore, loadMore, paused]);

  // Update metrics
  useEffect(() => {
    const visibleRange = getVisibleRange();
    updateMetrics('hybrid', {
      domNodeCount,
      itemsLoaded: loadedCount,
      renderTimeMs: renderTime,
      visibleRange,
    });
  }, [domNodeCount, loadedCount, renderTime, getVisibleRange, updateMetrics]);

  if (networkSpeed === 'offline') {
    return (
      <StrategyPanel type="hybrid" metrics={metrics}>
        <div style={{ height: 400 }}>
          <EmptyState type="offline" />
        </div>
      </StrategyPanel>
    );
  }

  if (loadedCount === 0 && loading) {
    return (
      <StrategyPanel type="hybrid" metrics={metrics}>
        <div style={{ height: 400 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </StrategyPanel>
    );
  }

  return (
    <StrategyPanel type="hybrid" metrics={metrics}>
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

        {/* Paused banner */}
        {paused && hasMore && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border-y border-amber-200">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-medium">
                Loading paused &mdash; {loadedCount} of{' '}
                {datasetSize.toLocaleString()} items loaded
              </span>
            </div>
            <button
              onClick={() => setPaused(false)}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-medium text-white cursor-pointer hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              <Play className="w-3 h-3" aria-hidden="true" />
              Resume
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {hasMore && !paused && loading && (
          <div className="flex items-center justify-center py-4 text-text-muted">
            <div className="flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more&hellip;
            </div>
          </div>
        )}

        {!hasMore && loadedCount > 0 && (
          <div className="py-4 text-center text-xs text-text-muted">
            All {loadedCount.toLocaleString()} items loaded
          </div>
        )}
      </div>
    </StrategyPanel>
  );
}
