import type { StrategyType, NetworkSpeed } from '@/types';

export interface Recommendation {
  strategy: StrategyType;
  confidence: 'high' | 'medium';
  reason: string;
  details: string;
}

/**
 * Recommends the best list rendering strategy based on current conditions.
 * Uses dataset size and network speed as primary signals.
 */
export function getRecommendation(
  datasetSize: number,
  networkSpeed: NetworkSpeed,
): Recommendation {
  // Offline: pagination is safest — smallest data payload per "page"
  if (networkSpeed === 'offline') {
    return {
      strategy: 'pagination',
      confidence: 'medium',
      reason: 'Best for unreliable networks',
      details:
        'Pagination loads the least data per request, making it the most resilient strategy when connectivity is limited.',
    };
  }

  // Very large datasets (10k+): virtualization is the clear winner
  if (datasetSize >= 10_000) {
    return {
      strategy: 'virtual',
      confidence: 'high',
      reason: 'Optimal for large datasets',
      details: `With ${datasetSize.toLocaleString()} items, virtualization keeps DOM size constant (~50 nodes) regardless of dataset size. Pagination would work but requires many pages; infinite scroll would crash the browser.`,
    };
  }

  // Medium datasets (1k-10k): depends on network speed
  if (datasetSize >= 1_000) {
    if (networkSpeed === 'slow') {
      return {
        strategy: 'pagination',
        confidence: 'medium',
        reason: 'Balanced for slow connections',
        details:
          'On slow networks, pagination gives users immediate content for each page without waiting for progressive loads. Virtualization would also work well here.',
      };
    }

    return {
      strategy: 'virtual',
      confidence: 'medium',
      reason: 'Best performance-to-UX ratio',
      details:
        'For 1,000+ items on fast networks, virtualization provides the smoothest scrolling experience with constant memory usage. Infinite scroll is viable but will accumulate DOM nodes over time.',
    };
  }

  // Small datasets (<1k): infinite scroll or pagination
  if (datasetSize <= 100) {
    return {
      strategy: 'pagination',
      confidence: 'medium',
      reason: 'Simplest for small datasets',
      details:
        'With only a few items, all strategies perform equally. Pagination is the simplest to implement and understand, making it the pragmatic choice.',
    };
  }

  // 100-1000 items: infinite scroll shines
  if (networkSpeed === 'slow') {
    return {
      strategy: 'pagination',
      confidence: 'medium',
      reason: 'Predictable on slow networks',
      details:
        'Pagination lets users control when to load more data, avoiding frustrating delays during infinite scroll loading.',
    };
  }

  return {
    strategy: 'infinite',
    confidence: 'medium',
    reason: 'Seamless browsing experience',
    details:
      'For moderate datasets on fast networks, infinite scroll provides the most natural browsing flow. DOM growth is manageable at this scale.',
  };
}
