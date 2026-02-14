import type { StrategyInfo, NetworkSpeed } from '@/types';

export const HEALTH_THRESHOLDS = {
  good: 200,
  warn: 500,
} as const;

export const DATASET_PRESETS = [100, 1_000, 10_000, 100_000] as const;

export const DEFAULT_DATASET_SIZE = 1_000;
export const DEFAULT_ITEMS_PER_PAGE = 20;
export const DOM_POLL_INTERVAL = 500;
export const VIRTUAL_ITEM_HEIGHT = 80;
export const VIRTUAL_OVERSCAN = 5;
export const INFINITE_SCROLL_BATCH = 20;
export const HYBRID_SCROLL_BATCH = 50;

export const NETWORK_DELAYS: Record<NetworkSpeed, number> = {
  fast: 50,
  slow: 1500,
  offline: -1,
};

export const STRATEGY_INFO: Record<string, StrategyInfo> = {
  pagination: {
    type: 'pagination',
    label: 'Pagination',
    description:
      'Loads a fixed page of items at a time. DOM node count stays constant regardless of dataset size.',
    color: 'var(--color-pagination)',
    lightColor: 'var(--color-pagination-light)',
    pros: [
      'Constant DOM size',
      'Predictable performance',
      'Easy to implement',
      'SEO-friendly URLs',
    ],
    cons: [
      'Requires user interaction to see more',
      'Context switching between pages',
      'Not ideal for browsing flows',
    ],
  },
  infinite: {
    type: 'infinite',
    label: 'Infinite Scroll',
    description:
      'Progressively loads items as the user scrolls down. DOM grows over time.',
    color: 'var(--color-infinite)',
    lightColor: 'var(--color-infinite-light)',
    pros: [
      'Seamless browsing experience',
      'Good for content feeds',
      'No manual page navigation',
    ],
    cons: [
      'DOM grows unbounded',
      'Memory usage increases over time',
      'Hard to reach footer',
      'Scroll position lost on back navigation',
    ],
  },
  virtual: {
    type: 'virtual',
    label: 'Virtualization',
    description:
      'Only renders items visible in the viewport. DOM stays small even with 100k+ items.',
    color: 'var(--color-virtual)',
    lightColor: 'var(--color-virtual-light)',
    pros: [
      'Constant DOM size',
      'Handles 100k+ items',
      'Smooth scrolling performance',
      'Low memory footprint',
    ],
    cons: [
      'More complex implementation',
      'Fixed item height often needed',
      'Search/find-in-page limitations',
      'Accessibility considerations',
    ],
  },
  hybrid: {
    type: 'hybrid',
    label: 'Infinite + Virtual',
    description:
      'Combines infinite scroll loading with virtualization. Items load progressively while only visible rows render in the DOM.',
    color: 'var(--color-hybrid)',
    lightColor: 'var(--color-hybrid-light)',
    pros: [
      'Constant DOM size',
      'Progressive data loading',
      'Handles 100k+ items',
      'Production-realistic pattern',
    ],
    cons: [
      'Most complex implementation',
      'Fixed item height needed',
      'Network-dependent initial load',
      'Search/find-in-page limitations',
    ],
  },
};
