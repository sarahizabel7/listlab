import { WifiOff, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'empty' | 'offline';
}

export function EmptyState({ type }: EmptyStateProps) {
  const isOffline = type === 'offline';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {isOffline ? (
        <WifiOff className="w-10 h-10 text-text-muted mb-3" />
      ) : (
        <Inbox className="w-10 h-10 text-text-muted mb-3" />
      )}
      <h4 className="text-sm font-medium text-text-secondary">
        {isOffline ? 'Network Offline' : 'No Items'}
      </h4>
      <p className="text-xs text-text-muted mt-1 max-w-[200px]">
        {isOffline
          ? 'Switch network speed to "Fast" or "Slow" to load data.'
          : 'Try adjusting the dataset size or theme.'}
      </p>
    </div>
  );
}
