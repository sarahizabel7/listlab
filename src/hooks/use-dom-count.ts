import { useEffect, useRef, useState } from 'react';
import { DOM_POLL_INTERVAL } from '@/constants';

/**
 * Polls the DOM node count inside a container ref every 500ms.
 */
export function useDomCount() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        setCount(containerRef.current.querySelectorAll('*').length);
      }
    }, DOM_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { containerRef, domNodeCount: count };
}
