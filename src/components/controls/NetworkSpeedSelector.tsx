import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { useAppStore } from '@/store/app-store';
import type { NetworkSpeed } from '@/types';
import { Zap, Snail, WifiOff } from 'lucide-react';

const SPEED_OPTIONS: { value: NetworkSpeed; label: string; icon: React.ReactNode }[] = [
  { value: 'fast', label: 'Fast', icon: <Zap className="w-3 h-3" /> },
  { value: 'slow', label: 'Slow', icon: <Snail className="w-3 h-3" /> },
  { value: 'offline', label: 'Offline', icon: <WifiOff className="w-3 h-3" /> },
];

export function NetworkSpeedSelector() {
  const networkSpeed = useAppStore((s) => s.networkSpeed);
  const setNetworkSpeed = useAppStore((s) => s.setNetworkSpeed);

  return (
    <div>
      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
        Network Speed
      </label>
      <ToggleGroup
        options={SPEED_OPTIONS}
        value={networkSpeed}
        onChange={setNetworkSpeed}
      />
    </div>
  );
}
