export type ThemeName = 'ecommerce' | 'social' | 'logs' | 'tasks';

export type StrategyType = 'pagination' | 'infinite' | 'virtual' | 'hybrid';

export type NetworkSpeed = 'fast' | 'slow' | 'offline';

export type HealthStatus = 'good' | 'warn' | 'bad';

export interface ListItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  value: number;
  timestamp: number;
  avatar: string;
}

export interface StrategyMetrics {
  domNodeCount: number;
  itemsLoaded: number;
  renderTimeMs: number;
  visibleRange: [number, number];
}

export interface StrategyInfo {
  type: StrategyType;
  label: string;
  description: string;
  color: string;
  lightColor: string;
  pros: string[];
  cons: string[];
}
