import { type MotionValue, motion } from "motion/react";
import { DEFAULT_BIARC_ANGLE_DEG, NotchContainer } from "@/components/Notch";
import styles from "./CarroselProgress.module.scss";

export interface ProgressSlideItem {
  id: number | string;
  number: string;
}

export interface CarroselProgressProps {
  slides: ProgressSlideItem[];
  currentIndex: number;
  progress: MotionValue<number>;
  onSelectSlide: (index: number) => void;
  onHoverChange?: (isHovered: boolean) => void;
  /** Angulação máxima da rampa suave do entalhe em graus (padrão: 38) */
  angle?: number | string;
  /** Altura do entalhe em pixels (padrão: 44) */
  notchHeight?: number;
  /** Raio convexo inferior desejado em pixels (padrão: 80) */
  radiusBottom?: number;
}

export function CarroselProgress({
  slides,
  currentIndex,
  progress,
  onSelectSlide,
  onHoverChange,
  angle = DEFAULT_BIARC_ANGLE_DEG,
  notchHeight = 44,
  radiusBottom = 80,
}: CarroselProgressProps) {
  return (
    <NotchContainer
      as="div"
      placement="top-center"
      variant="smooth"
      angle={angle}
      radius={radiusBottom}
      smoothHeight={notchHeight}
      offsetY={0}
      className={styles.progressNotch}
      role="group"
      aria-label="Tempo e seleção dos slides"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <div className={styles.segmentsRow}>
        {slides.map((slide, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={slide.id}
              type="button"
              className={styles.segmentButton}
              onClick={() => onSelectSlide(idx)}
              aria-label={`Ir para slide ${slide.number}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              <span className={styles.track} aria-hidden="true">
                {isPast && <span className={styles.fillComplete} />}
                {isCurrent && (
                  <motion.span className={styles.fillActive} style={{ scaleX: progress }} />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </NotchContainer>
  );
}

export default CarroselProgress;
