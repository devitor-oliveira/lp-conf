import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { NotchContainer } from "@/components/Notch";
import type { OrderWhatsAppChannel } from "@/utils/orderData";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_PHONE } from "@/utils/whatsapp";
import styles from "./OrderWhatsAppCards.module.scss";

export interface OrderWhatsAppCardsProps {
  readonly channels: readonly OrderWhatsAppChannel[];
}

export function OrderWhatsAppCards({ channels }: OrderWhatsAppCardsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      id="order-panel-whatsapp"
      role="tabpanel"
      aria-labelledby="order-tab-whatsapp"
      className={styles.cardsGrid}
    >
      {channels.map((channel) => {
        const whatsappHref = buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, channel.whatsappMessage);
        const isFeatured = Boolean(channel.isFeatured);
        const cardClassName = [styles.card, isFeatured && styles.cardFeatured]
          .filter(Boolean)
          .join(" ");
        const ctaClassName = [styles.ctaButton, isFeatured && styles.ctaFeatured]
          .filter(Boolean)
          .join(" ");

        return (
          <motion.article
            key={channel.id}
            id={channel.id}
            className={cardClassName}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {channel.badge && (
              <NotchContainer
                as="div"
                placement="top-right"
                color="var(--color-background)"
                concentric={{
                  innerRadius: 16,
                  paddingOuter: 12,
                  paddingInner: 0,
                }}
                offsetX={0}
                offsetY={0}
                className={styles.badgeNotch}
              >
                <span className={styles.badge}>{channel.badge}</span>
              </NotchContainer>
            )}

            <div className={styles.cardHeader}>
              <div className={styles.tagRow}>
                <span className={styles.tag}>{channel.tag}</span>
              </div>
              <h3 className={styles.title}>{channel.title}</h3>
              <p className={styles.description}>{channel.description}</p>
            </div>

            <ul className={styles.highlightsList}>
              {channel.highlights.map((item) => (
                <li key={item} className={styles.highlightItem}>
                  <Check size={16} className={styles.checkIcon} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.cardFooter}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.ariaLabel}
                className={ctaClassName}
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span>{channel.ctaLabel}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
