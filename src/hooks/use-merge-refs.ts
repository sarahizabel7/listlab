import { useCallback } from 'react';

type ReactRef<T> =
  | React.RefCallback<T>
  | React.MutableRefObject<T | null>
  | null
  | undefined;

/**
 * Merges multiple React refs into a single callback ref.
 * Handles both callback refs and RefObject refs safely.
 */
export function useMergeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  return useCallback(
    (instance: T | null) => {
      for (const ref of refs) {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
