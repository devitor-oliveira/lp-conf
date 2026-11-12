import { ArrowRight, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./ServiceTierCard.module.scss";

export interface ServiceTierCardProps {
  readonly id: "delivery" | "encomendas" | "presentes";
  readonly isPrimaryFeatured?: boolean;
  readonly icon: ReactNode;
  readonly badgeText: string;
  readonly regionTag: string;
  readonly title: string;
  readonly leadDescription: string;
  readonly keyHighlights: readonly string[];
  readonly timeframeInfo: string;
  readonly actionLabel: string;
  readonly onActionClick?: () => void;
  readonly href?: string;
}

export function ServiceTierCard({
  id,
  isPrimaryFeatured = false,
  icon,
  badgeText,
  regionTag,
  title,
  leadDescription,
  keyHighlights,
  timeframeInfo,
  actionLabel,
  onActionClick,
  href,
}: ServiceTierCardProps) {
  const cardClassName = isPrimaryFeatured ? `${styles.card} ${styles.featuredCard}` : styles.card;

  const btnClassName = isPrimaryFeatured
    ? `${styles.cardActionBtn} ${styles.featuredBtn}`
    : styles.cardActionBtn;

  return (
    <article id={`servico-${id}`} className={cardClassName} aria-labelledby={`title-${id}`}>
      {isPrimaryFeatured && (
        <div className={styles.flagshipBadge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Carro-chefe do Atelier</span>
        </div>
      )}

      <div className={styles.cardHeader}>
        <div className={styles.iconBadge} aria-hidden="true">
          {icon}
        </div>
        <div className={styles.badgesGroup}>
          <span className={styles.statusTag}>{badgeText}</span>
          <span className={styles.regionTag}>{regionTag}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 id={`title-${id}`} className={styles.cardTitle}>
          {title}
        </h3>
        <p className={styles.cardDescription}>{leadDescription}</p>

        <ul className={styles.highlightsList} aria-label={`Destaques de ${title}`}>
          {keyHighlights.map((highlight) => (
            <li key={highlight} className={styles.highlightItem}>
              <span className={styles.bulletDot} aria-hidden="true">
                •
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className={styles.timeframeBadge}>
          <span>{timeframeInfo}</span>
        </div>
      </div>

      {href ? (
        <a
          href={href}
          className={btnClassName}
          onClick={onActionClick}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span>{actionLabel}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      ) : (
        <button type="button" className={btnClassName} onClick={onActionClick}>
          <span>{actionLabel}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
    </article>
  );
}
