export function ListItemSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-border-light">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg animate-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded animate-shimmer" />
          <div className="h-3 w-1/2 rounded animate-shimmer" />
        </div>
        <div className="h-4 w-16 rounded animate-shimmer" />
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-5 w-16 rounded-full animate-shimmer" />
        <div className="h-5 w-12 rounded-full animate-shimmer" />
      </div>
    </div>
  );
}
