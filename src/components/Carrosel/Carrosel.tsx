import { Sparkles } from "lucide-react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from "motion/react";
import { type CSSProperties, useEffect, useState } from "react";

import styles from "@/components/Carrosel/Carrosel.module.scss";
import { SLIDES } from "@/utils/mockdata";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import CarroselDock from "./CarroselDock/CarroselDock";
import CarroselProgress from "./CarroselProgress/CarroselProgress";
import { HeroHighlights } from "./HeroHighlights/HeroHighlights";

const AUTO_PLAY_DURATION = 8000;
const PROGRESS_NOTCH_HEIGHT = 32;
const PROGRESS_NOTCH_ANGLE = 48;
const PROGRESS_RADIUS_BOTTOM = 32;

type ContentCssVars = CSSProperties & {
  "--slide-text": string;
};

type FloatStageCssVars = CSSProperties & {
  "--cutout-shadow-bottom"?: string;
  "--cutout-offset-x"?: string;
  "--cutout-offset-y"?: string;
};

export interface CarroselProps {
  activeSurfaceColor?: string;
  /** Angulação máxima da rampa suave do entalhe central (padrão: 48) */
  notchAngle?: number | string;
  onSlideColorChange?: (colorToken: string) => void;
  phone?: string;
  whatsappMessage?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.344-1.766-.656-3.094-1.328-5.109-4.453-5.266-4.656-.156-.203-1.266-1.688-1.266-3.219s.797-2.281 1.078-2.594c.281-.313.609-.391.813-.391.203 0 .406.016.578.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.281.5-.141.172-.297.391-.422.516-.141.141-.281.297-.125.578.156.281.703 1.156 1.516 1.875 1.047.922 1.922 1.219 2.203 1.359.281.141.438.109.609-.078.172-.188.734-.859.938-1.156.203-.297.406-.25.672-.156.266.094 1.703.813 1.984.953.281.141.469.219.547.344.078.125.078.719-.172 1.422z" />
    </svg>
  );
}

export function Carrosel({
  notchAngle = PROGRESS_NOTCH_ANGLE,
  onSlideColorChange,
  phone,
  whatsappMessage,
}: CarroselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentHovered, setIsContentHovered] = useState(false);
  const [isDockActive, setIsDockActive] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

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

  const contentStyle: ContentCssVars = {
    "--slide-text": currentSlide?.textColorToken ?? "var(--color-text)",
  };

  const cutoutScale = currentSlide?.cutoutScale ?? 1;
  const floatStageStyle: FloatStageCssVars | undefined =
    currentSlide?.cutoutShadowBottom || currentSlide?.cutoutOffsetX || currentSlide?.cutoutOffsetY
      ? {
          ...(currentSlide.cutoutShadowBottom
            ? { "--cutout-shadow-bottom": currentSlide.cutoutShadowBottom }
            : {}),
          ...(currentSlide.cutoutOffsetX
            ? { "--cutout-offset-x": currentSlide.cutoutOffsetX }
            : {}),
          ...(currentSlide.cutoutOffsetY
            ? { "--cutout-offset-y": currentSlide.cutoutOffsetY }
            : {}),
        }
      : undefined;

  return (
    <motion.div
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
          style={contentStyle}
        >
          {currentSlide?.eyebrow && (
            <motion.p className={styles.eyebrow} variants={contentItemVariants}>
              <Sparkles size={14} aria-hidden="true" />
              <span>{currentSlide.eyebrow}</span>
            </motion.p>
          )}
          <motion.h1 id="hero-title" variants={contentItemVariants}>
            {currentSlide?.title}
          </motion.h1>
          <motion.p className={styles.lead} variants={contentItemVariants}>
            {currentSlide?.description}
          </motion.p>
          <motion.div variants={contentItemVariants} className={styles.ctaGroup}>
            <a
              className={styles.ctaPrimary}
              href={buildWhatsAppUrl(phone, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir doces pelo WhatsApp (abre em nova aba)"
            >
              <WhatsAppIcon className={styles.whatsappIcon} />
              <span>Pedir pelo WhatsApp</span>
            </a>
            <a className={styles.ctaSecondary} href="#cardapio">
              Ver Cardápio Completo
            </a>
          </motion.div>
          <motion.div variants={contentItemVariants}>
            <HeroHighlights highlights={currentSlide?.highlights ?? []} />
          </motion.div>
        </motion.div>

        <div className={styles.canvas} aria-live="polite">
          {!currentSlide?.isCutout && <div className={styles.imageHalo} aria-hidden="true" />}
          <div className={styles.floatStage} style={floatStageStyle}>
            {currentSlide?.isCutout && (
              <div className={styles.cutoutGroundShadow} aria-hidden="true" />
            )}
            <div className={currentSlide?.isCutout ? styles.cutoutFrame : styles.organicFrame}>
              <AnimatePresence mode="sync">
                <motion.img
                  key={`img-${currentSlide?.id}`}
                  src={currentSlide?.image}
                  alt={currentSlide?.alt}
                  fetchPriority={currentIndex === 0 ? "high" : undefined}
                  initial={{
                    x: 64,
                    opacity: 0,
                    scale: currentSlide?.isCutout ? cutoutScale * 0.96 : 1.04,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    scale: currentSlide?.isCutout ? cutoutScale : 1.08,
                  }}
                  exit={{
                    x: -64,
                    opacity: 0,
                    scale: currentSlide?.isCutout ? cutoutScale * 0.96 : 1.02,
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </AnimatePresence>
            </div>

            {currentSlide?.isCutout &&
              currentSlide.floatingPills?.slice(0, 3).map((label, idx) => (
                <motion.span
                  key={label}
                  aria-hidden="true"
                  className={`${styles.floatingPill} ${styles[`floatingPill${idx + 1}`] ?? ""}`}
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {label}
                </motion.span>
              ))}
          </div>
        </div>
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
