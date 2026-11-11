import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { MenuItem } from "@/utils/mockdata";
import styles from "./MenuCard.module.scss";
import { WhatsAppButton } from "./WhatsAppButton";

export interface MenuCardProps {
  readonly item: MenuItem;
  readonly onOrderClick: () => void;
}

export function MenuCard({ item, onOrderClick }: MenuCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.2,
      },
    },
  };

  return (
    <motion.article
      layout={!shouldReduceMotion}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.card}
    >
      <figure className={styles.imageContainer}>
        <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
        <figcaption className={styles.sensoryBadgeList}>
          {item.sensoryNotes.map((note) => (
            <span key={note} className={styles.sensoryBadge}>
              {note}
            </span>
          ))}
        </figcaption>
      </figure>

      <div className={styles.cardBody}>
        <div className={styles.cardHeaderRow}>
          <span className={styles.cardSubtitle}>{item.subtitle}</span>
          <span className={styles.cardPortionsBadge}>{item.portionsInfo}</span>
        </div>

        <h3 className={styles.cardTitle}>{item.name}</h3>
        <p className={styles.cardDescription}>{item.description}</p>

        <div className={styles.priceContainer}>
          <span className={styles.priceLabel}>Valor de referência</span>
          <span className={styles.priceValue}>{item.priceDisplay}</span>
        </div>

        <div className={styles.actionsContainer}>
          <button type="button" className={styles.primaryBtn} onClick={onOrderClick}>
            <span>Encomendar / Ver Opções</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <WhatsAppButton presetMessage={item.whatsappPresetMessage} productName={item.name} />
        </div>
      </div>
    </motion.article>
  );
}
