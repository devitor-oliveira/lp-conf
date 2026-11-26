import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { type CSSProperties, type FocusEvent, useEffect, useState } from "react";
import { HeroHighlights } from "@/components/Carrosel/HeroHighlights/HeroHighlights";
import type { Slide } from "@/utils/mockdata";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import styles from "./HeroSlideContent.module.scss";

type ContentCssVars = CSSProperties & {
  "--slide-text": string;
};

const CONTENT_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const CONTENT_ITEM_VARIANTS = {
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

export interface HeroSlideContentProps {
  readonly slide: Slide;
  readonly phone?: string;
  readonly whatsappMessage?: string;
  readonly onInteractionChange?: (active: boolean) => void;
}

export function HeroSlideContent({
  slide,
  phone,
  whatsappMessage,
  onInteractionChange,
}: HeroSlideContentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  useEffect(() => {
    onInteractionChange?.(isHovered || isFocusWithin);
  }, [isHovered, isFocusWithin, onInteractionChange]);

  const handleFocusCapture = () => {
    setIsFocusWithin(true);
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusWithin(false);
    }
  };

  const contentStyle: ContentCssVars = {
    "--slide-text": slide.textColorToken ?? "var(--color-text)",
  };

  return (
    <motion.div
      key={`content-${slide.id}`}
      variants={CONTENT_CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      className={styles.content}
      style={contentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      {slide.eyebrow && (
        <motion.p className={styles.eyebrow} variants={CONTENT_ITEM_VARIANTS}>
          <Sparkles size={14} aria-hidden="true" />
          <span>{slide.eyebrow}</span>
        </motion.p>
      )}
      <motion.h1 id="hero-title" variants={CONTENT_ITEM_VARIANTS}>
        {slide.title}
      </motion.h1>
      <motion.p className={styles.lead} variants={CONTENT_ITEM_VARIANTS}>
        {slide.description}
      </motion.p>
      <motion.div variants={CONTENT_ITEM_VARIANTS} className={styles.ctaGroup}>
        <a
          className={styles.ctaPrimary}
          href={buildWhatsAppUrl(phone, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir doces pelo WhatsApp (abre em nova aba)"
        >
          <MessageCircle
            className={styles.whatsappIcon}
            size={18}
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span>Pedir pelo WhatsApp</span>
        </a>
        <a className={styles.ctaSecondary} href="#cardapio">
          Ver Cardápio Completo
        </a>
      </motion.div>
      <motion.div variants={CONTENT_ITEM_VARIANTS} className={styles.highlightsWrapper}>
        <HeroHighlights highlights={slide.highlights} />
      </motion.div>
    </motion.div>
  );
}
