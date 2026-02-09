import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { useAppStore } from '@/store/app-store';
import type { ThemeName } from '@/types';
import { ShoppingCart, MessageCircle, Terminal } from 'lucide-react';

const THEME_OPTIONS: { value: ThemeName; label: string; icon: React.ReactNode }[] = [
  { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-3 h-3" /> },
  { value: 'social', label: 'Social', icon: <MessageCircle className="w-3 h-3" /> },
  { value: 'logs', label: 'Logs', icon: <Terminal className="w-3 h-3" /> },
];

export function ThemeSelector() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div>
      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
        Data Theme
      </label>
      <ToggleGroup options={THEME_OPTIONS} value={theme} onChange={setTheme} />
    </div>
  );
}
