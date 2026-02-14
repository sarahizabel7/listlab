import { ComparisonChart } from './ComparisonChart';
import { ComparisonTable } from './ComparisonTable';
import { RecommendationCard } from './RecommendationCard';
import { BarChart3 } from 'lucide-react';

export function ComparisonSection() {
  return (
    <div id="comparison-section" className="scroll-mt-8 space-y-6">
      {/* Recommendation */}
      <RecommendationCard />

      {/* Metrics */}
      <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-text-muted" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">
            Performance Comparison
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-medium text-text-secondary mb-3">
              DOM Node Count
            </h3>
            <ComparisonChart />
          </div>
          <div>
            <h3 className="text-xs font-medium text-text-secondary mb-3">
              Metrics Summary
            </h3>
            <ComparisonTable />
          </div>
        </div>
      </div>
    </div>
  );
}
