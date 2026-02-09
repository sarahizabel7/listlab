/* eslint-disable react-hooks/set-state-in-effect -- simulated async data fetching requires setState in effects */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import { useDomCount } from '@/hooks/use-dom-count';
import { useRenderTimer } from '@/hooks/use-render-timer';
import { generateBatch } from '@/lib/data-generator';
import { NETWORK_DELAYS, DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { StrategyPanel } from './StrategyPanel';
import { ListItemComponent } from '@/components/items/ListItem';
import { ListItemSkeleton } from '@/components/items/ListItemSkeleton';
import { EmptyState } from '@/components/items/EmptyState';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { ListItem } from '@/types';

const PAGE_SIZES = [10, 20, 50];

export function PaginationStrategy() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const theme = useAppStore((s) => s.theme);
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const updateMetrics = useAppStore((s) => s.updateMetrics);
  const metrics = useAppStore((s) => s.metrics.pagination);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { containerRef, domNodeCount } = useDomCount();
  const renderTime = useRenderTimer([items]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(datasetSize / pageSize);

  // Clamp page when dataset/pageSize changes
  const clampedPage = Math.min(page, Math.max(0, totalPages - 1));
  if (clampedPage !== page) {
    setPage(clampedPage);
  }

  const loadPage = useCallback(
    (pageNum: number) => {
      const delay = NETWORK_DELAYS[networkSpeed];
      if (delay === -1) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const startIndex = pageNum * pageSize;
      const count = Math.min(pageSize, datasetSize - startIndex);

      setTimeout(() => {
        setItems(generateBatch(startIndex, count, theme));
        setLoading(false);
        scrollRef.current?.scrollTo({ top: 0 });
      }, delay);
    },
    [networkSpeed, pageSize, datasetSize, theme],
  );

  useEffect(() => {
    loadPage(clampedPage);
  }, [clampedPage, loadPage]);

  useEffect(() => {
    const startIndex = clampedPage * pageSize;
    updateMetrics('pagination', {
      domNodeCount,
      itemsLoaded: items.length,
      renderTimeMs: renderTime,
      visibleRange: [startIndex, startIndex + items.length - 1],
    });
  }, [domNodeCount, items.length, renderTime, clampedPage, pageSize, updateMetrics]);

  const goTo = (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1)));

  const footer = (
    <div className="px-4 py-2.5 border-t border-border-light flex items-center justify-between bg-surface-dim">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-text-muted">Per page:</span>
        {PAGE_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => {
              setPageSize(size);
              setPage(0);
            }}
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              size === pageSize
                ? 'bg-pagination text-white'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => goTo(0)} disabled={clampedPage === 0}>
          <ChevronsLeft className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => goTo(clampedPage - 1)} disabled={clampedPage === 0}>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs font-mono text-text-secondary px-2">
          {clampedPage + 1} / {totalPages}
        </span>
        <Button variant="ghost" size="sm" onClick={() => goTo(clampedPage + 1)} disabled={clampedPage >= totalPages - 1}>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => goTo(totalPages - 1)} disabled={clampedPage >= totalPages - 1}>
          <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <StrategyPanel type="pagination" metrics={metrics} footer={footer}>
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar" style={{ height: 400 }}>
        <div ref={scrollRef}>
          {networkSpeed === 'offline' ? (
            <EmptyState type="offline" />
          ) : loading ? (
            Array.from({ length: pageSize }, (_, i) => (
              <ListItemSkeleton key={i} />
            ))
          ) : items.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            items.map((item) => (
              <ListItemComponent key={item.id} item={item} theme={theme} />
            ))
          )}
        </div>
      </div>
    </StrategyPanel>
  );
}
