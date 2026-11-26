import { useEffect, useState } from "react";
import styles from "@/components/Carrosel/Carrosel.module.scss";
import { useCarouselAutoplay } from "@/hooks";
import { SLIDES } from "@/utils/mockdata";
import CarroselDock from "./CarroselDock/CarroselDock";
import CarroselProgress from "./CarroselProgress/CarroselProgress";
import { HeroProductStage } from "./HeroProductStage/HeroProductStage";
import { HeroSlideContent } from "./HeroSlideContent/HeroSlideContent";

const AUTO_PLAY_DURATION = 8000;
const PROGRESS_NOTCH_HEIGHT = 32;
const PROGRESS_NOTCH_ANGLE = 48;
const PROGRESS_RADIUS_BOTTOM = 32;

export interface CarroselProps {
  /** Angulação máxima da rampa suave do entalhe central (padrão: 48) */
  readonly notchAngle?: number | string;
  readonly onSlideColorChange?: (colorToken: string) => void;
  readonly phone?: string;
  readonly whatsappMessage?: string;
}

export function Carrosel({
  notchAngle = PROGRESS_NOTCH_ANGLE,
  onSlideColorChange,
  phone,
  whatsappMessage,
}: CarroselProps) {
  const [isContentInteracting, setIsContentInteracting] = useState(false);
  const [isStageInteracting, setIsStageInteracting] = useState(false);
  const [isDockActive, setIsDockActive] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  const isPaused = isContentInteracting || isStageInteracting || isDockActive || isProgressHovered;

  const { currentIndex, progress, lastChangeSource, selectSlide } = useCarouselAutoplay({
    totalSlides: SLIDES.length,
    durationMs: AUTO_PLAY_DURATION,
    isPaused,
  });

  const currentSlide = SLIDES[currentIndex];

  useEffect(() => {
    if (currentSlide?.surfaceColorToken) {
      onSlideColorChange?.(currentSlide.surfaceColorToken);
    }
  }, [currentSlide?.surfaceColorToken, onSlideColorChange]);

  return (
    <section
      className={styles.wrapper}
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
        onSelectSlide={selectSlide}
        onHoverChange={setIsProgressHovered}
      />

      {currentSlide && (
        <p
          className={styles.srOnly}
          aria-live={lastChangeSource === "manual" ? "polite" : "off"}
          aria-atomic="true"
        >
          Slide {currentSlide.number} de {SLIDES.length}: {currentSlide.name} — {currentSlide.title}
        </p>
      )}

      {currentSlide && (
        <div
          className={styles["content-wrapper"]}
          id="hero-slide-panel"
          role="tabpanel"
          aria-labelledby={`dock-tab-${currentSlide.id}`}
        >
          <HeroSlideContent
            slide={currentSlide}
            phone={phone}
            whatsappMessage={whatsappMessage}
            onInteractionChange={setIsContentInteracting}
          />

          <HeroProductStage
            slide={currentSlide}
            isFirstSlide={currentIndex === 0}
            onInteractionChange={setIsStageInteracting}
          />
        </div>
      )}

      <CarroselDock
        slides={SLIDES}
        currentIndex={currentIndex}
        onSelectSlide={selectSlide}
        onActiveChange={setIsDockActive}
        panelId="hero-slide-panel"
      />
    </section>
  );
}

export default Carrosel;
