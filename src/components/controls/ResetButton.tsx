import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/app-store';
import { RotateCcw } from 'lucide-react';

export function ResetButton() {
  const resetAll = useAppStore((s) => s.resetAll);

  return (
    <Button variant="ghost" size="sm" onClick={resetAll}>
      <RotateCcw className="w-3.5 h-3.5" />
      Reset
    </Button>
  );
}
