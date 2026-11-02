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

      <motion.div
        className={styles.dockItems}
        animate={{
          height: isOpen ? 64 : 18,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <div className={styles.dockHandle} aria-hidden="true">
          <span className={styles.handleBar} />
        </div>

        <motion.div
          className={styles.buttonsRow}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 8,
          }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
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
                  <svg className={styles.progressRing} viewBox="0 0 44 44" aria-hidden="true">
                    <motion.circle
                      cx="22"
                      cy="22"
                      r="19.5"
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
        </motion.div>
      </motion.div>

      <span className={styles["right-bar"]} />
    </motion.div>
  );
}

export default CarroselDock;
