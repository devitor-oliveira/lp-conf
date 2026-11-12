import { ArrowRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./ServiceTierCard.module.scss";

export interface ServiceTierCardProps {
  readonly id: "delivery" | "encomendas" | "presentes";
  readonly isPrimaryFeatured?: boolean;
  readonly image: string;
  readonly alt: string;
  readonly height?: string | number;
  readonly overlayTheme?: "neutral" | "cacau" | "pistache";
  readonly tag: string;
  readonly title: string;
  readonly leadDescription: string;
  readonly actionLabel: string;
  readonly onActionClick?: () => void;
  readonly href?: string;
  readonly children?: ReactNode;
}

export function ServiceTierCard({
  id,
  isPrimaryFeatured = false,
  image,
  alt,
  height,
  overlayTheme = "neutral",
  tag,
  title,
  leadDescription,
  actionLabel,
  onActionClick,
  href,
}: ServiceTierCardProps) {
  const cardClassName = isPrimaryFeatured ? `${styles.card} ${styles.featuredCard}` : styles.card;

  const themeClassName =
    overlayTheme === "cacau"
      ? styles.themeCacau
      : overlayTheme === "pistache"
        ? styles.themePistache
        : styles.themeNeutral;

  const cardStyle: CSSProperties = {
    height: height ?? (isPrimaryFeatured ? "520px" : "460px"),
  };

  return (
    <article
      id={`servico-${id}`}
      className={cardClassName}
      style={cardStyle}
      aria-labelledby={`title-${id}`}
    >
      <img src={image} alt={alt} className={styles.cardImage} />

      <div className={`${styles.glassOverlay} ${themeClassName}`}>
        <div className={styles.cardHeader}>
          <span className={styles.tag}>{tag}</span>
          <h3 id={`title-${id}`} className={styles.cardTitle}>
            {title}
          </h3>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.cardDescription}>{leadDescription}</p>

          {href ? (
            <a
              href={href}
              className={styles.cardActionBtn}
              onClick={onActionClick}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span>{actionLabel}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          ) : (
            <button type="button" className={styles.cardActionBtn} onClick={onActionClick}>
              <span>{actionLabel}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
