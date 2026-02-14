import { cn } from '@/lib/cn';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-border bg-surface-dim p-0.5 gap-0.5 flex-nowrap',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap',
            value === option.value
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
