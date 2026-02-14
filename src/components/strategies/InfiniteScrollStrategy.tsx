/* eslint-disable react-hooks/set-state-in-effect -- simulated async data fetching requires setState in effects */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppStore } from '@/store/app-store';
import { useDomCount } from '@/hooks/use-dom-count';
import { useRenderTimer } from '@/hooks/use-render-timer';
import { generateBatch } from '@/lib/data-generator';
import { NETWORK_DELAYS, INFINITE_SCROLL_BATCH } from '@/constants';
import { StrategyPanel } from './StrategyPanel';
import { ListItemComponent } from '@/components/items/ListItem';
import { ListItemSkeleton } from '@/components/items/ListItemSkeleton';
import { EmptyState } from '@/components/items/EmptyState';
import type { ListItem } from '@/types';
import { Loader2, Pause, Play } from 'lucide-react';

export function InfiniteScrollStrategy() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const theme = useAppStore((s) => s.theme);
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const updateMetrics = useAppStore((s) => s.updateMetrics);
  const metrics = useAppStore((s) => s.metrics.infinite);
  const paused = useAppStore((s) => s.infiniteScrollPaused);
  const setPaused = useAppStore((s) => s.setInfiniteScrollPaused);

  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const { containerRef, domNodeCount } = useDomCount();
  const renderTime = useRenderTimer([items]);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    root: scrollContainer,
    skip: paused,
  });

  // Reset when controls change — also unpause
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    loadingRef.current = false;
    setPaused(false);
    scrollContainer?.scrollTo({ top: 0 });
  }, [datasetSize, theme, networkSpeed, setPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;

    const delay = NETWORK_DELAYS[networkSpeed];
    if (delay === -1) {
      setHasMore(false);
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    const startIndex = items.length;
    const remaining = datasetSize - startIndex;
    const count = Math.min(INFINITE_SCROLL_BATCH, remaining);

    if (count <= 0) {
      setHasMore(false);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    setTimeout(() => {
      const newItems = generateBatch(startIndex, count, theme);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(startIndex + count < datasetSize);
      setLoading(false);
      loadingRef.current = false;
    }, delay);
  }, [items.length, datasetSize, theme, networkSpeed, hasMore]);

  // Initial load
  useEffect(() => {
    if (items.length === 0 && networkSpeed !== 'offline') {
      loadMore();
    }
  }, [items.length, networkSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load more when sentinel is in view — skip if paused
  useEffect(() => {
    if (inView && !loading && hasMore && !paused) {
      loadMore();
    }
  }, [inView, loading, hasMore, loadMore, paused]);

  useEffect(() => {
    updateMetrics('infinite', {
      domNodeCount,
      itemsLoaded: items.length,
      renderTimeMs: renderTime,
      visibleRange: [0, items.length - 1],
    });
  }, [domNodeCount, items.length, renderTime, updateMetrics]);

  return (
    <StrategyPanel type="infinite" metrics={metrics}>
      <div
        ref={setScrollContainer}
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{ height: 400 }}
      >
        <div ref={containerRef}>
          {networkSpeed === 'offline' && items.length === 0 ? (
            <EmptyState type="offline" />
          ) : items.length === 0 && loading ? (
            Array.from({ length: 5 }, (_, i) => (
              <ListItemSkeleton key={i} />
            ))
          ) : (
            <>
              {items.map((item) => (
                <ListItemComponent key={item.id} item={item} theme={theme} />
              ))}

              {/* Paused banner */}
              {paused && hasMore && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 border-y border-amber-200">
                  <div className="flex items-center gap-2 text-xs text-amber-700">
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-medium">
                      Loading paused &mdash; {items.length} of{' '}
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

              {/* Sentinel / loading indicator */}
              {hasMore && !paused && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center py-4 text-text-muted"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading more&hellip;
                    </div>
                  ) : (
                    <span className="text-xs">Scroll for more</span>
                  )}
                </div>
              )}

              {!hasMore && items.length > 0 && (
                <div className="py-4 text-center text-xs text-text-muted">
                  All {items.length} items loaded
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StrategyPanel>
  );
}
