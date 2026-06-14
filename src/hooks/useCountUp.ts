import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  target: number;
  duration?: number;
  start?: number;
  isActive?: boolean;   // Start counting when this becomes true
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp({
  target,
  duration = 2000,
  start = 0,
  isActive = true,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);   // Stores the rAF ID for cancellation
  const startTimeRef = useRef<number | null>(null);
  const hasRunRef = useRef(false);              // Prevents re-triggering after completion

  useEffect(() => {
    if (!isActive || hasRunRef.current) return;

    hasRunRef.current = true;

    // animation loop
    function tick(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(start + (target - start) * eased);

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, target, duration, start]);

  return value;
}
