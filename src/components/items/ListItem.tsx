import { memo } from 'react';
import type { ListItem as ListItemType, ThemeName } from '@/types';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';
import { Tag, DollarSign, Clock, Terminal } from 'lucide-react';

interface ListItemProps {
  item: ListItemType;
  theme: ThemeName;
  style?: React.CSSProperties;
}

function EcommerceItem({ item }: { item: ListItemType }) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pagination-light flex items-center justify-center text-lg">
          {item.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-text-primary truncate">
            {item.title}
          </h4>
          <p className="text-xs text-text-muted mt-0.5 truncate">
            {item.subtitle}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-pagination">
          <DollarSign className="w-3.5 h-3.5" />
          {item.value.toFixed(2)}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="pagination">{item.category}</Badge>
        {item.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="muted">
            <Tag className="w-2.5 h-2.5 mr-0.5" />
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
}

function SocialItem({ item }: { item: ListItemType }) {
  return (
    <>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-infinite-light flex items-center justify-center text-lg">
          {item.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-text-primary">
            {item.title}
          </h4>
          <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="infinite">{item.category}</Badge>
        {item.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="muted">
            #{tag}
          </Badge>
        ))}
        <span className="ml-auto text-[10px] text-text-muted flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {Math.floor(item.value)}
        </span>
      </div>
    </>
  );
}

function LogItem({ item }: { item: ListItemType }) {
  const isError =
    item.category === 'ERROR' || item.category === 'WARN';
  return (
    <div className="font-mono text-xs">
      <div className="flex items-center gap-2">
        <Terminal className="w-3 h-3 text-text-muted flex-shrink-0" />
        <Badge
          variant="muted"
          className={cn(
            isError && 'bg-red-50 text-red-600',
            item.category === 'WARN' && 'bg-amber-50 text-amber-600',
          )}
        >
          {item.category}
        </Badge>
        <span className="text-text-primary truncate">{item.title}</span>
        <span className="ml-auto text-text-muted flex-shrink-0">
          #{item.id}
        </span>
      </div>
      <div className="text-text-muted mt-1 pl-5 truncate">{item.subtitle}</div>
    </div>
  );
}

export const ListItemComponent = memo(function ListItemComponent({
  item,
  theme,
  style,
}: ListItemProps) {
  return (
    <div
      style={style}
      className={cn(
        'px-4 py-3 border-b border-border-light hover:bg-surface-hover transition-colors',
        'animate-fade-in',
      )}
    >
      {theme === 'ecommerce' && <EcommerceItem item={item} />}
      {theme === 'social' && <SocialItem item={item} />}
      {theme === 'logs' && <LogItem item={item} />}
    </div>
  );
});
