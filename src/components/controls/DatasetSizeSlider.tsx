import { Slider } from '@/components/ui/Slider';
import { useAppStore } from '@/store/app-store';
import { DATASET_PRESETS } from '@/constants';

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export function DatasetSizeSlider() {
  const datasetSize = useAppStore((s) => s.datasetSize);
  const setDatasetSize = useAppStore((s) => s.setDatasetSize);

  // Map slider position (0-3) to presets
  const sliderIndex = DATASET_PRESETS.indexOf(
    DATASET_PRESETS.find((p) => p >= datasetSize) ?? DATASET_PRESETS[1],
  );

  return (
    <div>
      <Slider
        label="Dataset Size"
        displayValue={`${formatNumber(datasetSize)} items`}
        min={0}
        max={DATASET_PRESETS.length - 1}
        step={1}
        value={sliderIndex}
        onChange={(i) => setDatasetSize(DATASET_PRESETS[i])}
      />
      <div className="flex justify-between mt-1">
        {DATASET_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setDatasetSize(preset)}
            className={`text-[10px] font-mono transition-colors cursor-pointer ${
              preset === datasetSize
                ? 'text-pagination font-medium'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {formatNumber(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}
