import { DatasetSizeSlider } from './DatasetSizeSlider';
import { ThemeSelector } from './ThemeSelector';
import { NetworkSpeedSelector } from './NetworkSpeedSelector';
import { ResetButton } from './ResetButton';
import { Settings2 } from 'lucide-react';

export function ControlsPanel() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-text-muted" />
          <h2 className="text-sm font-semibold text-text-primary">Controls</h2>
        </div>
        <ResetButton />
      </div>
      <div className="space-y-4">
        <ThemeSelector />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <DatasetSizeSlider />
          <NetworkSpeedSelector />
        </div>
      </div>
    </div>
  );
}
