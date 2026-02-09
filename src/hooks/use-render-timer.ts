import { useEffect, useRef, useState } from 'react';

/**
 * Measures render duration using performance.now().
 * Returns the time in ms for the last render cycle.
 */
export function useRenderTimer(deps: unknown[]) {
  const startRef = useRef(performance.now());
  const [renderTime, setRenderTime] = useState(0);

  // Mark start of render
  startRef.current = performance.now();

  useEffect(() => {
    const elapsed = performance.now() - startRef.current;
    setRenderTime(Math.round(elapsed * 100) / 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return renderTime;
}
