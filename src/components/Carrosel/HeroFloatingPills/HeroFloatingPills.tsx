import { motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { useMemo, useState } from "react";
import { useMagneticHover } from "@/hooks";
import { buildCurvedConnectorPath, computeRadialPillGeometry } from "@/utils/hero/pillGeometry";
import type { HeroFloatingPill } from "@/utils/mockdata";
import styles from "./HeroFloatingPills.module.scss";

type SpotlightState = "idle" | "active" | "dimmed";

export interface HeroFloatingPillsProps {
  readonly pills: readonly HeroFloatingPill[];
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly cutoutScale: number;
}

interface FloatingPillItemProps {
  readonly pill: HeroFloatingPill;
  readonly index: number;
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly cutoutScale: number;
  readonly spotlightState: SpotlightState;
  readonly onHoverStart: (id: string) => void;
  readonly onHoverEnd: (id: string) => void;
}

function FloatingPillItem({
  pill,
  index,
  stageWidth,
  stageHeight,
  cutoutScale,
  spotlightState,
  onHoverStart,
  onHoverEnd,
}: FloatingPillItemProps) {
  const { x: magX, y: magY, onPointerMove, onPointerLeave } = useMagneticHover({ maxOffset: 10 });
  const floatY = useMotionValue(0);

  useAnimationFrame((time) => {
    const frequency = 0.00095 + index * 0.00018;
    const phase = index * 2.1;
    floatY.set(Math.sin(time * frequency + phase) * 2.5);
  });

  const geometry = useMemo(
    () =>
      computeRadialPillGeometry({
        stageWidth,
        stageHeight,
        cutoutScale,
        anchor: pill.anchor,
        angleDeg: pill.angleDeg,
        radiusMultiplier: pill.radiusMultiplier,
      }),
    [stageWidth, stageHeight, cutoutScale, pill.anchor, pill.angleDeg, pill.radiusMultiplier],
  );

  const combinedY = useTransform(() => floatY.get() + magY.get());
  const pathD = useTransform(() =>
    buildCurvedConnectorPath({
      anchorX: geometry.anchorX,
      anchorY: geometry.anchorY,
      targetX: geometry.attachX + magX.get(),
      targetY: geometry.attachY + combinedY.get(),
      side: geometry.side,
      curveDirection: geometry.curveDirection,
    }),
  );

  const lineOpacity = spotlightState === "active" ? 0.95 : spotlightState === "dimmed" ? 0.28 : 0.6;
  const anchorOpacity = spotlightState === "dimmed" ? 0.45 : 1;
  const pillOpacity = spotlightState === "dimmed" ? 0.55 : 1;

  return (
    <>
      <svg
        className={styles.connectorSvg}
        width={stageWidth}
        height={stageHeight}
        viewBox={`0 0 ${stageWidth} ${stageHeight}`}
        aria-hidden="true"
        focusable="false"
      >
        <motion.path
          d={pathD}
          className={styles.connectorPath}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: lineOpacity }}
          transition={{
            pathLength: {
              duration: 0.55,
              delay: 0.18 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: { duration: 0.25 },
          }}
        />
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: anchorOpacity }}
          transition={{ duration: 0.3, delay: 0.12 + index * 0.08 }}
        >
          <circle cx={geometry.anchorX} cy={geometry.anchorY} r={7} className={styles.anchorRing} />
          <circle
            cx={geometry.anchorX}
            cy={geometry.anchorY}
            r={3.5}
            className={styles.anchorCore}
          />
        </motion.g>
      </svg>

      <motion.div
        aria-hidden="true"
        className={styles.pillAnchor}
        data-side={geometry.side}
        style={{
          left: geometry.attachX,
          top: geometry.attachY,
          x: magX,
          y: combinedY,
        }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: pillOpacity, scale: spotlightState === "active" ? 1.03 : 1 }}
        transition={{
          opacity: { duration: 0.35, delay: 0.15 + index * 0.08 },
          scale: { type: "spring", stiffness: 300, damping: 22 },
        }}
      >
        <motion.div
          className={styles.pillHitArea}
          onPointerMove={onPointerMove}
          onPointerEnter={() => onHoverStart(pill.id)}
          onPointerLeave={() => {
            onPointerLeave();
            onHoverEnd(pill.id);
          }}
        >
          <span className={styles.pill}>{pill.label}</span>
        </motion.div>
      </motion.div>
    </>
  );
}

export function HeroFloatingPills({
  pills,
  stageWidth,
  stageHeight,
  cutoutScale,
}: HeroFloatingPillsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const visiblePills = pills.slice(0, 3);

  if (visiblePills.length === 0 || stageWidth <= 0 || stageHeight <= 0) {
    return null;
  }

  return (
    <div className={styles.pillsLayer} aria-hidden="true">
      {visiblePills.map((pill, idx) => {
        const spotlightState: SpotlightState =
          hoveredId === null ? "idle" : hoveredId === pill.id ? "active" : "dimmed";

        return (
          <FloatingPillItem
            key={pill.id}
            pill={pill}
            index={idx}
            stageWidth={stageWidth}
            stageHeight={stageHeight}
            cutoutScale={cutoutScale}
            spotlightState={spotlightState}
            onHoverStart={setHoveredId}
            onHoverEnd={(id) => setHoveredId((prev) => (prev === id ? null : prev))}
          />
        );
      })}
    </div>
  );
}
