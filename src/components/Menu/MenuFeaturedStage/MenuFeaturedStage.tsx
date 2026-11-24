import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useRef } from "react";
import { useNotchedClipPath } from "@/hooks/useNotchedClipPath";
import type { MenuItem } from "@/utils/mockdata";
import { WhatsAppButton } from "../WhatsAppButton/WhatsAppButton";
import styles from "./MenuFeaturedStage.module.scss";

export interface MenuFeaturedStageProps {
  readonly item: MenuItem;
  readonly onOrderClick: (tier: MenuItem["targetServiceTier"]) => void;
}

const CTA_NOTCH_INNER_RADIUS = 28; // metade do WhatsAppButton (--space-7 = 56px)
const CTA_NOTCH_PADDING = 12; // folga --space-1-5 entre o botão e a foto

const transitionConfig = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

const ctaButtonVariants = {
  hover: {},
  tap: { scale: 0.97 },
};

const ctaArrowVariants = {
  hover: { x: 3 },
  tap: { scale: 0.95 },
};

export const MenuFeaturedStage = memo(function MenuFeaturedStage({
  item,
  onOrderClick,
}: MenuFeaturedStageProps) {
  const visualStageRef = useRef<HTMLDivElement>(null);
  const ctaNotchRef = useRef<HTMLDivElement>(null);

  useNotchedClipPath(visualStageRef, {
    placement: "top-right",
    notchRef: ctaNotchRef,
    innerRadius: CTA_NOTCH_INNER_RADIUS,
    paddingOuter: CTA_NOTCH_PADDING,
  });

  return (
    <article className={styles.stageLayout} aria-label={`Destaque: ${item.name}`}>
      <div className={styles.visualStageFrame}>
        <div className={styles.visualStageShadow}>
          <div ref={visualStageRef} className={styles.visualStage}>
            <AnimatePresence initial={false}>
              <motion.div
                key={`image-${item.id}`}
                className={styles.heroImageLayer}
                initial={{ opacity: 0, scale: 1.02, zIndex: 1 }}
                animate={{ opacity: 1, scale: 1, zIndex: 1 }}
                exit={{ opacity: 0.99, scale: 1, zIndex: 0 }}
                transition={{ ...transitionConfig, zIndex: { duration: 0 } }}
              >
                <img src={item.image} alt={item.alt} loading="eager" decoding="sync" />
              </motion.div>
            </AnimatePresence>

            <div className={styles.priceGlassOverlay}>
              <span className={styles.priceValue}>{item.priceDisplay}</span>
              <span className={styles.portionsDivider} aria-hidden="true">
                •
              </span>
              <span className={styles.portionsText}>{item.portionsInfo}</span>
            </div>
          </div>
        </div>

        <div ref={ctaNotchRef} className={styles.ctaNotchWrapper}>
          <WhatsAppButton presetMessage={item.whatsappPresetMessage} productName={item.name} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`editorial-${item.id}`}
          className={styles.editorialPanel}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={transitionConfig}
        >
          <div className={styles.headingGroup}>
            <p className={styles.subtitle}>• {item.subtitle}</p>
            <h3 className={styles.title}>{item.name}</h3>
          </div>

          <p className={styles.sensoryMetaLine}>{item.sensoryNotes.join("  •  ")}</p>

          <ul className={styles.featureList}>
            {item.features.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                {feature}
              </li>
            ))}
          </ul>

          <div className={styles.editorialActions}>
            <motion.button
              type="button"
              className={styles.orderCtaButton}
              onClick={() => onOrderClick(item.targetServiceTier)}
              variants={ctaButtonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
            >
              <span className={styles.ctaLabel}>Encomendar</span>
              <motion.span
                className={styles.arrowBadge}
                aria-hidden="true"
                variants={ctaArrowVariants}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
              >
                <ArrowRight size={14} strokeWidth={2.2} />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </article>
  );
});
