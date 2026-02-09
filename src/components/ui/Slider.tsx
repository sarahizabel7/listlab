import { cn } from '@/lib/cn';
import type { InputHTMLAttributes } from 'react';

interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  displayValue?: string;
  onChange?: (value: number) => void;
}

export function Slider({
  label,
  displayValue,
  onChange,
  className,
  ...props
}: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || displayValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-text-secondary">
              {label}
            </label>
          )}
          {displayValue && (
            <span className="text-xs font-mono font-medium text-text-primary">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        className={cn(
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          'bg-border accent-pagination',
        )}
        onChange={(e) => onChange?.(Number(e.target.value))}
        {...props}
      />
    </div>
  );
}
