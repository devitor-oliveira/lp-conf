import { type MotionValue, useSpring } from "motion/react";
import { type PointerEvent, useCallback } from "react";

export interface UseMagneticHoverOptions {
  readonly maxOffset?: number;
  readonly stiffness?: number;
  readonly damping?: number;
  readonly mass?: number;
}

export interface UseMagneticHoverReturn {
  readonly x: MotionValue<number>;
  readonly y: MotionValue<number>;
  readonly onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  readonly onPointerLeave: () => void;
}

/**
 * Encapsula efeito magnético suave via `useSpring` do Motion 14,
 * restrito a ponteiros de mouse e operando fora do ciclo de render do React.
 */
export function useMagneticHover({
  maxOffset = 10,
  stiffness = 260,
  damping = 18,
  mass = 0.8,
}: UseMagneticHoverOptions = {}): UseMagneticHoverReturn {
  const springConfig = { stiffness, damping, mass };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return;

      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const normX = Math.max(
        -1,
        Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)),
      );
      const normY = Math.max(
        -1,
        Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)),
      );

      x.set(normX * maxOffset);
      y.set(normY * maxOffset);
    },
    [maxOffset, x, y],
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x, y, onPointerMove, onPointerLeave };
}
