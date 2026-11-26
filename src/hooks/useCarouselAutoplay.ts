import { type MotionValue, useAnimationFrame, useMotionValue } from "motion/react";
import { useCallback, useState } from "react";

export type SlideChangeSource = "auto" | "manual";

export interface UseCarouselAutoplayOptions {
  readonly totalSlides: number;
  readonly durationMs?: number;
  readonly isPaused: boolean;
}

export interface UseCarouselAutoplayReturn {
  readonly currentIndex: number;
  readonly progress: MotionValue<number>;
  readonly lastChangeSource: SlideChangeSource;
  readonly selectSlide: (index: number) => void;
}

/**
 * Gerencia o ciclo de autoplay, progresso contínuo e seleção manual de slides
 * sem disparar re-renders React a cada frame de animação.
 */
export function useCarouselAutoplay({
  totalSlides,
  durationMs = 8000,
  isPaused,
}: UseCarouselAutoplayOptions): UseCarouselAutoplayReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastChangeSource, setLastChangeSource] = useState<SlideChangeSource>("auto");
  const progress = useMotionValue(0);

  useAnimationFrame((_time, delta) => {
    if (isPaused || totalSlides <= 1) return;

    const nextProgress = progress.get() + delta / durationMs;

    if (nextProgress >= 1) {
      progress.set(0);
      setLastChangeSource("auto");
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    } else {
      progress.set(nextProgress);
    }
  });

  const selectSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;
      progress.set(0);
      setLastChangeSource("manual");
      setCurrentIndex(((index % totalSlides) + totalSlides) % totalSlides);
    },
    [progress, totalSlides],
  );

  return { currentIndex, progress, lastChangeSource, selectSlide };
}
