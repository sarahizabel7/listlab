import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { useAppStore } from '@/store/app-store';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ScrollToggleProps {
  targetId: string;
}

export function ScrollToBottom({ targetId }: ScrollToggleProps) {
  const [direction, setDirection] = useState<'down' | 'up' | 'hidden'>(
    'hidden',
  );
  const [bottomOffset, setBottomOffset] = useState(24);
  const setInfiniteScrollPaused = useAppStore(
    (s) => s.setInfiniteScrollPaused,
  );
  const setHybridScrollPaused = useAppStore((s) => s.setHybridScrollPaused);
  const activeStrategy = useAppStore((s) => s.activeStrategy);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const targetRect = target.getBoundingClientRect();
      const isTargetBelow = targetRect.top > window.innerHeight;
      const isNearPageBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

      if (isNearPageBottom) {
        setDirection('up');
      } else if (isTargetBelow) {
        setDirection('down');
      } else {
        setDirection('hidden');
      }

      // Push button above footer when it's visible
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const overlap = window.innerHeight - footerRect.top;
        setBottomOffset(overlap > 0 ? overlap + 16 : 24);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  const handleClick = useCallback(() => {
    if (direction === 'down') {
      // Pause loading strategies so new items don't push the section away
      if (activeStrategy === 'infinite') setInfiniteScrollPaused(true);
      if (activeStrategy === 'hybrid') setHybridScrollPaused(true);

      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [
    direction,
    targetId,
    activeStrategy,
    setInfiniteScrollPaused,
    setHybridScrollPaused,
  ]);

  const visible = direction !== 'hidden';

  return (
    <button
      onClick={handleClick}
      aria-label={
        direction === 'down' ? 'Scroll to comparison' : 'Scroll to top'
      }
      style={{ bottom: bottomOffset }}
      className={cn(
        'fixed right-6 z-40',
        'flex items-center justify-center w-10 h-10 rounded-full',
        'bg-pagination text-white shadow-xl',
        'cursor-pointer hover:bg-pagination/90 active:scale-95',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pagination focus-visible:ring-offset-2',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none',
      )}
    >
      {direction === 'down' ? (
        <ArrowDown className="w-4 h-4" aria-hidden="true" />
      ) : (
        <ArrowUp className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
