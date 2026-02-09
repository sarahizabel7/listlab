import { create } from 'zustand';
import type {
  ThemeName,
  NetworkSpeed,
  StrategyType,
  StrategyMetrics,
} from '@/types';
import { DEFAULT_DATASET_SIZE } from '@/constants';

const DEFAULT_METRICS: StrategyMetrics = {
  domNodeCount: 0,
  itemsLoaded: 0,
  renderTimeMs: 0,
  visibleRange: [0, 0],
};

interface AppState {
  // Controls
  datasetSize: number;
  theme: ThemeName;
  networkSpeed: NetworkSpeed;
  activeStrategy: StrategyType;
  infiniteScrollPaused: boolean;

  // Metrics per strategy
  metrics: Record<StrategyType, StrategyMetrics>;

  // Actions
  setDatasetSize: (size: number) => void;
  setTheme: (theme: ThemeName) => void;
  setNetworkSpeed: (speed: NetworkSpeed) => void;
  setActiveStrategy: (strategy: StrategyType) => void;
  setInfiniteScrollPaused: (paused: boolean) => void;
  updateMetrics: (
    strategy: StrategyType,
    update: Partial<StrategyMetrics>,
  ) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  datasetSize: DEFAULT_DATASET_SIZE,
  theme: 'ecommerce',
  networkSpeed: 'fast',
  activeStrategy: 'pagination',
  infiniteScrollPaused: false,

  metrics: {
    pagination: { ...DEFAULT_METRICS },
    infinite: { ...DEFAULT_METRICS },
    virtual: { ...DEFAULT_METRICS },
  },

  setDatasetSize: (size) => set({ datasetSize: size }),
  setTheme: (theme) => set({ theme }),
  setNetworkSpeed: (speed) => set({ networkSpeed: speed }),
  setActiveStrategy: (strategy) => set({ activeStrategy: strategy }),
  setInfiniteScrollPaused: (paused) => set({ infiniteScrollPaused: paused }),

  updateMetrics: (strategy, update) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        [strategy]: { ...state.metrics[strategy], ...update },
      },
    })),

  resetAll: () =>
    set({
      datasetSize: DEFAULT_DATASET_SIZE,
      theme: 'ecommerce',
      networkSpeed: 'fast',
      activeStrategy: 'pagination',
      infiniteScrollPaused: false,
      metrics: {
        pagination: { ...DEFAULT_METRICS },
        infinite: { ...DEFAULT_METRICS },
        virtual: { ...DEFAULT_METRICS },
      },
    }),
}));
