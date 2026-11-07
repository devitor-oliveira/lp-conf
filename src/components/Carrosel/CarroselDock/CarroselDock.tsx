import { motion, useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./CarroselDock.module.scss";

export interface DockSlideItem {
  id: number | string;
  name: string;
  surfaceColorToken: string;
  textColorToken?: string;
}

export interface CarroselDockProps {
  slides: DockSlideItem[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
  onActiveChange?: (active: boolean) => void;
  panelId?: string;
}

type DockCssVars = CSSProperties & {
  "--dock-active-color"?: string;
};

type PillCssVars = CSSProperties & {
  "--pill-active-bg": string;
  "--pill-active-text": string;
};

export function CarroselDock({
  slides,
  currentIndex,
  onSelectSlide,
  onActiveChange,
  panelId = "hero-slide-panel",
}: CarroselDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldReduceMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [isLockedClick, setIsLockedClick] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  const isOpen = isHovered || isLockedClick || isFocusWithin;
  const activeSlide = slides[currentIndex];

  useEffect(() => {
    onActiveChange?.(isOpen);
  }, [isOpen, onActiveChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDownOutside = (event: globalThis.PointerEvent) => {
      const root = dockRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setIsLockedClick(false);
        setIsHovered(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLockedClick(false);
        setIsHovered(false);
        setIsFocusWithin(false);
        const root = dockRef.current;
        if (
          root &&
          document.activeElement instanceof HTMLElement &&
          root.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsHovered(false);
    }
  };

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) {
      setIsFocusWithin(true);
    }
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusWithin(false);
    }
  };

  const handleToggleDock = () => {
    if (isLockedClick) {
      setIsLockedClick(false);
      setIsHovered(false);
    } else {
      setIsLockedClick(true);
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = slides.length;
    if (total === 0) return;

    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (idx + 1) % total;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (idx - 1 + total) % total;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = total - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      onSelectSlide(nextIndex);
    }
  };

  const dockStyle: DockCssVars = {
    "--dock-active-color": activeSlide?.surfaceColorToken ?? "var(--color-accent)",
  };

  const dockClassName = [
    styles.dock,
    isOpen ? styles.dockOpen : "",
    isLockedClick ? styles.dockLocked : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      ref={dockRef}
      className={dockClassName}
      style={dockStyle}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onClick={handleToggleDock}
    >
      <span className={styles["left-bar"]} aria-hidden="true" />

      <motion.div
        className={styles.dockItems}
        animate={{
          height: isOpen ? 68 : 18,
        }}
        transition={
          shouldReduceMotion ? { duration: 0.12 } : { type: "spring", stiffness: 380, damping: 28 }
        }
      >
        <div className={styles.dockHandle} aria-hidden="true">
          <span className={styles.handleBar} />
        </div>

        <motion.div
          className={styles.pillsRow}
          role="tablist"
          aria-label="Doces em destaque"
          aria-orientation="horizontal"
          animate={{
            opacity: isOpen ? 1 : 0,
            y: shouldReduceMotion ? 0 : isOpen ? 0 : 6,
          }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const pillStyle: PillCssVars = {
              "--pill-active-bg": slide.surfaceColorToken,
              "--pill-active-text": slide.textColorToken ?? "#ffffff",
            };

            const pillClassName = [styles.pill, isActive ? styles.activePill : ""]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`dock-tab-${slide.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                className={pillClassName}
                style={pillStyle}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlide(idx);
                }}
              >
                <span>{slide.name}</span>
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      <span className={styles["right-bar"]} aria-hidden="true" />
    </motion.div>
  );
}

export default CarroselDock;
