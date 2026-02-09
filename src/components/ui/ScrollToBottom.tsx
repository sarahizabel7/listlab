import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { useAppStore } from '@/store/app-store';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomProps {
  targetId: string;
}

export function ScrollToBottom({ targetId }: ScrollToBottomProps) {
  const [visible, setVisible] = useState(false);
  const setInfiniteScrollPaused = useAppStore(
    (s) => s.setInfiniteScrollPaused,
  );

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const targetRect = target.getBoundingClientRect();
      // Show the button when the target is below the viewport
      setVisible(targetRect.top > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  const scrollToTarget = useCallback(() => {
    // Pause infinite scroll so new items don't push the comparison section away
    setInfiniteScrollPaused(true);

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId, setInfiniteScrollPaused]);

  return (
    <button
      onClick={scrollToTarget}
      aria-label="Scroll to comparison section"
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'flex items-center gap-2 rounded-full px-4 py-2.5',
        'bg-text-primary text-white shadow-xl',
        'cursor-pointer hover:bg-text-primary/90 active:scale-95',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pagination focus-visible:ring-offset-2',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none',
      )}
    >
      <ArrowDown className="w-4 h-4" aria-hidden="true" />
      <span className="text-xs font-medium">Comparison</span>
    </button>
  );
}
