import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { HeroFloatingPills } from "@/components/Carrosel/HeroFloatingPills/HeroFloatingPills";
import type { Slide } from "@/utils/mockdata";
import styles from "./HeroProductStage.module.scss";

type FloatStageCssVars = CSSProperties & {
  "--cutout-shadow-bottom"?: string;
  "--cutout-offset-x"?: string;
  "--cutout-offset-y"?: string;
};

export interface HeroProductStageProps {
  readonly slide: Slide;
  readonly isFirstSlide: boolean;
  readonly onInteractionChange?: (active: boolean) => void;
}

export function HeroProductStage({
  slide,
  isFirstSlide,
  onInteractionChange,
}: HeroProductStageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setFrameSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height },
      );
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const cutoutScale = slide.cutoutScale ?? 1;
  const floatStageStyle: FloatStageCssVars | undefined =
    slide.cutoutShadowBottom || slide.cutoutOffsetX || slide.cutoutOffsetY
      ? {
          ...(slide.cutoutShadowBottom
            ? { "--cutout-shadow-bottom": slide.cutoutShadowBottom }
            : {}),
          ...(slide.cutoutOffsetX ? { "--cutout-offset-x": slide.cutoutOffsetX } : {}),
          ...(slide.cutoutOffsetY ? { "--cutout-offset-y": slide.cutoutOffsetY } : {}),
        }
      : undefined;

  return (
    <div className={styles.canvas}>
      <motion.div
        className={styles.floatStage}
        style={floatStageStyle}
        onMouseEnter={() => onInteractionChange?.(true)}
        onMouseLeave={() => onInteractionChange?.(false)}
      >
        <div className={styles.cutoutGroundShadow} aria-hidden="true" />
        <div ref={frameRef} className={styles.cutoutFrame}>
          <AnimatePresence mode="sync">
            <motion.img
              key={`img-${slide.id}`}
              src={slide.image}
              alt={slide.alt ?? slide.name}
              fetchPriority={isFirstSlide ? "high" : undefined}
              initial={{
                x: 64,
                opacity: 0,
                scale: cutoutScale * 0.96,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: cutoutScale,
              }}
              exit={{
                x: -64,
                opacity: 0,
                scale: cutoutScale * 0.96,
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </AnimatePresence>

          <HeroFloatingPills
            key={slide.id}
            pills={slide.floatingPills ?? []}
            stageWidth={frameSize.width}
            stageHeight={frameSize.height}
            cutoutScale={cutoutScale}
          />
        </div>
      </motion.div>
    </div>
  );
}
