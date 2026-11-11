import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from "motion/react";
import type React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import styles from "@/components/Carrosel/Carrosel.module.scss";
import { generateConcentricCollarSvgPath, NotchContainer } from "@/components/Notch";
import { SLIDES } from "@/utils/mockdata";
import CarroselDock from "./CarroselDock/CarroselDock";
import CarroselProgress from "./CarroselProgress/CarroselProgress";
import WhatsAppCTA from "./WhatsAppCTA";

const AUTO_PLAY_DURATION = 8000;
const PROGRESS_SEGMENT_WIDTH = 38;
const PROGRESS_SEGMENT_GAP = 6;
const PROGRESS_PAD_X = 10;
const PROGRESS_NOTCH_HEIGHT = 32;
const PROGRESS_NOTCH_ANGLE = 48;
const PROGRESS_RADIUS_BOTTOM = 32;
const CANVAS_EDGE_INSET = 12;
const IMAGE_EXIT_RADIUS = 32;
const CONTENT_SPLIT_OFFSET_RATIO = 0.05; // 55% (.content) - 50% (centro do Hero)

export interface CarroselProps {
  activeSurfaceColor?: string;
  /** Angulação máxima da rampa suave do entalhe central e do recorte concêntrico da imagem (padrão: 48) */
  notchAngle?: number | string;
  onSlideColorChange?: (colorToken: string) => void;
  phone?: string;
  whatsappMessage?: string;
}

export function Carrosel({
  activeSurfaceColor,
  notchAngle = PROGRESS_NOTCH_ANGLE,
  onSlideColorChange,
  phone,
  whatsappMessage,
}: CarroselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(1440);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentHovered, setIsContentHovered] = useState(false);
  const [isDockActive, setIsDockActive] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setWrapperWidth(el.clientWidth);
      }
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentSlide = SLIDES[currentIndex];
  const isPaused = isContentHovered || isDockActive || isProgressHovered;

  const progress = useMotionValue(0);

  useAnimationFrame((_time, delta) => {
    if (isPaused) return;

    const nextProgress = progress.get() + delta / AUTO_PLAY_DURATION;

    if (nextProgress >= 1) {
      progress.set(0);
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    } else {
      progress.set(nextProgress);
    }
  });

  // Micro-parallax reativo na imagem (GPU-accelerated)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX * 10);
    mouseY.set(normalizedY * 10);
  };

  const handleCanvasMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sincronização de cor com o elemento pai
  useEffect(() => {
    if (currentSlide?.surfaceColorToken) {
      onSlideColorChange?.(currentSlide.surfaceColorToken);
    }
  }, [currentSlide?.surfaceColorToken, onSlideColorChange]);

  const handleSelectSlide = (idx: number) => {
    progress.set(0);
    setCurrentIndex(idx);
  };

  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const contentItemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const collarColor =
    activeSurfaceColor ?? currentSlide?.surfaceColorToken ?? "var(--color-surface-slide-1)";

  const flatWidth =
    SLIDES.length * PROGRESS_SEGMENT_WIDTH +
    Math.max(0, SLIDES.length - 1) * PROGRESS_SEGMENT_GAP +
    PROGRESS_PAD_X * 2;

  const imageStartOffset = wrapperWidth * CONTENT_SPLIT_OFFSET_RATIO + CANVAS_EDGE_INSET;

  const collarGeometry = useMemo(
    () =>
      generateConcentricCollarSvgPath({
        height: PROGRESS_NOTCH_HEIGHT,
        flatHalfWidth: flatWidth / 2,
        angleDeg: notchAngle,
        radiusBottom: PROGRESS_RADIUS_BOTTOM,
        gap: CANVAS_EDGE_INSET,
        imageStartOffset,
        exitRadius: IMAGE_EXIT_RADIUS,
      }),
    [flatWidth, imageStartOffset, notchAngle],
  );

  return (
    <motion.div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => setIsContentHovered(true)}
      onMouseLeave={() => setIsContentHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques da Confeitaria"
    >
      <CarroselProgress
        slides={SLIDES}
        currentIndex={currentIndex}
        progress={progress}
        angle={notchAngle}
        notchHeight={PROGRESS_NOTCH_HEIGHT}
        radiusBottom={PROGRESS_RADIUS_BOTTOM}
        onSelectSlide={handleSelectSlide}
        onHoverChange={setIsProgressHovered}
      />

      {collarGeometry.d.length > 0 && (
        <svg
          className={styles.imageNotchCollar}
          width={collarGeometry.svgWidth}
          height={collarGeometry.svgHeight}
          viewBox={`0 0 ${collarGeometry.svgWidth} ${collarGeometry.svgHeight}`}
          style={{ color: collarColor }}
          aria-hidden="true"
        >
          <path d={collarGeometry.d} fill="currentColor" />
        </svg>
      )}

      <div
        className={styles["content-wrapper"]}
        id="hero-slide-panel"
        role="tabpanel"
        aria-labelledby={currentSlide ? `dock-tab-${currentSlide.id}` : undefined}
      >
        <motion.div
          key={`content-${currentSlide?.id}`}
          variants={contentContainerVariants}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          <motion.h1 id="hero-title" variants={contentItemVariants}>
            {currentSlide?.title}
          </motion.h1>
          <motion.p variants={contentItemVariants}>{currentSlide?.description}</motion.p>
          <motion.div variants={contentItemVariants} className={styles.ctaWrapper}>
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              aria-label="Fazer pedido pelo WhatsApp"
            >
              Pedir pelo WhatsApp
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.canvas}
          aria-live="polite"
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        >
          <NotchContainer
            as="div"
            placement="top-right"
            radius={52}
            filletSize={16}
            offsetX={CANVAS_EDGE_INSET}
            offsetY={CANVAS_EDGE_INSET}
            color={collarColor}
            className={styles.themeToggleCollar}
            aria-hidden="true"
          />

          <div className={styles.canvasFrame}>
            <motion.div className={styles.parallaxLayer} style={{ x: smoothX, y: smoothY }}>
              <AnimatePresence>
                <motion.img
                  key={`img-${currentSlide?.id}`}
                  src={currentSlide?.image}
                  alt={currentSlide?.alt}
                  initial={{ x: 80, opacity: 0, scale: 0.95 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -80, opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </AnimatePresence>
            </motion.div>
          </div>

          <WhatsAppCTA
            color={collarColor}
            phone={phone}
            message={whatsappMessage}
            className={styles.whatsappCta}
          />
        </motion.div>
      </div>

      <CarroselDock
        slides={SLIDES}
        currentIndex={currentIndex}
        onSelectSlide={handleSelectSlide}
        onActiveChange={setIsDockActive}
        panelId="hero-slide-panel"
      />
    </motion.div>
  );
}

export default Carrosel;
