import { type MotionValue, motion } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./CarroselDock.module.scss";

export interface DockSlideItem {
  id: number | string;
  number: string;
}

export interface CarroselDockProps {
  slides: DockSlideItem[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onActiveChange?: (active: boolean) => void;
  progress?: MotionValue<number>;
}

export function CarroselDock({
  slides,
  currentIndex,
  onSelectSlide,
  onActiveChange,
  progress,
}: CarroselDockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLockedClick, setIsLockedClick] = useState(false);

  const isOpen = isHovered || isLockedClick;

  useEffect(() => {
    onActiveChange?.(isOpen);
  }, [isOpen, onActiveChange]);

  const handleToggle = () => {
    setIsLockedClick((prev) => !prev);
  };

  return (
    <motion.div
      className={styles.dock}
      animate={{ y: isOpen ? 0 : "calc(100% - 24px)" }}
      transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsLockedClick(false);
      }}
      onClick={handleToggle}
      role="region"
      aria-label="Navegação do carrossel"
      aria-expanded={isOpen}
    >
      <span className={styles["left-bar"]} />

      <div className={styles.dockItems}>
        <div className={styles.dockHandle} aria-hidden="true">
          <span className={styles.handleBar} />
        </div>

        <div className={styles.buttonsRow}>
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <motion.button
                key={slide.id}
                type="button"
                className={isActive ? styles.activeButton : ""}
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlide(idx);
                }}
                aria-label={`Ir para slide ${slide.number}`}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive && progress && (
                  <svg
                    className={styles.progressRing}
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="21.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ pathLength: progress }}
                    />
                  </svg>
                )}
                <span>{slide.number}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <span className={styles["right-bar"]} />
    </motion.div>
  );
}

export default CarroselDock;
