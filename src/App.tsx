import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ControlsPanel } from '@/components/controls/ControlsPanel';
import { StrategySwitcher } from '@/components/strategies/StrategySwitcher';
import { PaginationStrategy } from '@/components/strategies/PaginationStrategy';
import { InfiniteScrollStrategy } from '@/components/strategies/InfiniteScrollStrategy';
import { VirtualizationStrategy } from '@/components/strategies/VirtualizationStrategy';
import { ComparisonSection } from '@/components/comparison/ComparisonSection';
import { ScrollToBottom } from '@/components/ui/ScrollToBottom';
import { useAppStore } from '@/store/app-store';

function ActiveStrategy() {
  const activeStrategy = useAppStore((s) => s.activeStrategy);

  return (
    <div className="animate-fade-in" key={activeStrategy}>
      <div
        id={`strategy-panel-${activeStrategy}`}
        role="tabpanel"
        aria-labelledby={`strategy-tab-${activeStrategy}`}
      >
        {activeStrategy === 'pagination' && <PaginationStrategy />}
        {activeStrategy === 'infinite' && <InfiniteScrollStrategy />}
        {activeStrategy === 'virtual' && <VirtualizationStrategy />}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Sticky controls + strategy tabs */}
      <div className="sticky top-14 z-20 bg-surface-dim/95 backdrop-blur-sm border-b border-border-light">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          <ControlsPanel />
          <StrategySwitcher />
        </div>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        <ActiveStrategy />
        <ComparisonSection />
      </main>

      <Footer />
      <ScrollToBottom targetId="comparison-section" />
    </div>
  );
}

export default App;
