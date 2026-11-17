import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";
import type { MenuItem } from "@/utils/mockdata";
import styles from "./MenuFeaturedStage.module.scss";
import { WhatsAppButton } from "./WhatsAppButton";

export interface MenuFeaturedStageProps {
  readonly item: MenuItem;
  readonly onOrderClick: (tier: MenuItem["targetServiceTier"]) => void;
}

export const MenuFeaturedStage = memo(function MenuFeaturedStage({
  item,
  onOrderClick,
}: MenuFeaturedStageProps) {
  const transitionConfig = {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <article className={styles.stageContainer} aria-label={`Destaque: ${item.name}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`image-${item.id}`}
          className={styles.heroImageLayer}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={transitionConfig}
        >
          <img src={item.image} alt={item.alt} loading="eager" decoding="async" />
        </motion.div>
      </AnimatePresence>

      <div className={styles.scrimOverlay} aria-hidden="true" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${item.id}`}
          className={styles.contentCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transitionConfig}
        >
          <div className={styles.badgesRow}>
            <span className={styles.portionsBadge}>{item.portionsInfo}</span>
            {item.sensoryNotes.map((note) => (
              <span key={note} className={styles.sensoryBadge}>
                {note}
              </span>
            ))}
          </div>

          <div className={styles.textGroup}>
            <span className={styles.subtitle}>{item.subtitle}</span>
            <h3 className={styles.title}>{item.name}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>

          <div className={styles.footerActions}>
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>Valor de referência</span>
              <span className={styles.priceValue}>{item.priceDisplay}</span>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onOrderClick(item.targetServiceTier)}
              >
                <span>Encomendar / Ver Opções</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>

              <WhatsAppButton presetMessage={item.whatsappPresetMessage} productName={item.name} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </article>
  );
});
