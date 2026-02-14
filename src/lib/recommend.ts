import type { StrategyType, NetworkSpeed, ThemeName } from '@/types';

export interface Recommendation {
  strategy: StrategyType;
  confidence: 'high' | 'medium';
  reason: string;
  details: string;
}

/**
 * Recommends the best list rendering strategy based on current conditions.
 * Uses dataset size, network speed, and data theme as signals.
 */
export function getRecommendation(
  datasetSize: number,
  networkSpeed: NetworkSpeed,
  theme: ThemeName,
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

  // Task lists: structured data that benefits from pagination (page URLs, back navigation, filtered views)
  if (theme === 'tasks' && datasetSize <= 10_000) {
    return {
      strategy: 'pagination',
      confidence: datasetSize <= 1_000 ? 'high' : 'medium',
      reason: 'Ideal for structured task lists',
      details:
        'Task management UIs rely on pagination for shareable page URLs, predictable back-navigation, and filtered views. Users expect to browse tasks page by page rather than scroll through an endless list.',
    };
  }

  // Very large datasets (10k+)
  if (datasetSize >= 10_000) {
    if (networkSpeed === 'slow') {
      return {
        strategy: 'virtual',
        confidence: 'high',
        reason: 'Optimal for large datasets on slow networks',
        details: `With ${datasetSize.toLocaleString()} items on a slow connection, pure virtualization avoids batch-fetch delays. DOM stays constant (~50 nodes) regardless of dataset size.`,
      };
    }

    return {
      strategy: 'hybrid',
      confidence: 'high',
      reason: 'Best of both worlds for large datasets',
      details: `With ${datasetSize.toLocaleString()} items on a fast network, the hybrid approach loads data progressively while virtualizing the DOM. You get constant DOM size (~50 nodes) with incremental data fetching — the most production-realistic pattern.`,
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
      strategy: 'hybrid',
      confidence: 'medium',
      reason: 'Best performance-to-UX ratio',
      details:
        'For 1,000+ items on fast networks, the hybrid approach combines smooth virtualized scrolling with progressive data loading. DOM stays constant while data loads in batches.',
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
