import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import YellowHeroIMG from "@/assets/doce-amarelo.png";
import RedHeroIMG from "@/assets/doce-vermelho.png";

import styles from "@/components/Carrosel/Carrosel.module.scss";
import CarroselDock from "./CarroselDock/CarroselDock";

export interface Slide {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  surfaceColorToken: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    number: "01",
    title: "Display title 01",
    description:
      "Doces artesanais produzidos com dedicação e ingredientes selecionados.",
    image: RedHeroIMG,
    alt: "Doce artesanal vermelho especial",
    surfaceColorToken: "var(--color-surface-slide-1)",
  },
  {
    id: 2,
    number: "02",
    title: "Display title 02",
    description:
      "Sabor cítrico especial em edição exclusiva da nossa confeitaria.",
    image: YellowHeroIMG,
    alt: "Doce artesanal amarelo especial",
    surfaceColorToken: "var(--color-surface-slide-2)",
  },
  {
    id: 3,
    number: "03",
    title: "Display title 03",
    description:
      "Texturas delicadas e acabamento refinado para ocasiões memoráveis.",
    image: RedHeroIMG,
    alt: "Seleção especial de confeitaria",
    surfaceColorToken: "var(--color-surface-slide-3)",
  },
];

const AUTO_PLAY_DURATION = 5000;

export interface CarroselProps {
  onSlideColorChange?: (colorToken: string) => void;
}

export function Carrosel({ onSlideColorChange }: CarroselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isContentHovered, setIsContentHovered] = useState(false);
  const [isDockActive, setIsDockActive] = useState(false);

  const currentSlide = SLIDES[currentIndex];
  const isPaused = isContentHovered || isDockActive;

  // Progresso contínuo (0 a 1) sincronizado em 60/120fps com o anel da dock
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
  }, [currentIndex, currentSlide?.surfaceColorToken, onSlideColorChange]);

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

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsContentHovered(true)}
      onMouseLeave={() => setIsContentHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques da Confeitaria"
    >
      <div className={styles["content-wrapper"]}>
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
          <motion.p variants={contentItemVariants}>
            {currentSlide?.description}
          </motion.p>
          <motion.div
            variants={contentItemVariants}
            className={styles.ctaWrapper}
          >
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

        <div
          className={styles.canvas}
          aria-live="polite"
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        >
          <motion.div
            className={styles.parallaxLayer}
            style={{ x: smoothX, y: smoothY }}
          >
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
      </div>

      <CarroselDock
        slides={SLIDES}
        currentIndex={currentIndex}
        onSelectSlide={handleSelectSlide}
        onActiveChange={setIsDockActive}
        progress={progress}
      />
    </div>
  );
}

export default Carrosel;
