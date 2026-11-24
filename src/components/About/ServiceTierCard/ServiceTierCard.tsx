import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useNotchedClipPath } from "@/hooks/useNotchedClipPath";
import styles from "./ServiceTierCard.module.scss";

const ACTION_NOTCH_INNER_RADIUS = 24; // metade da altura do botão (3rem = 48px)
const ACTION_NOTCH_PADDING = 12; // folga --space-1-5 entre o botão e o card

export interface ServiceTierCardProps {
  readonly id: "delivery" | "encomendas" | "presentes";
  readonly isPrimaryFeatured?: boolean;
  readonly image: string;
  readonly alt: string;
  readonly overlayTheme?: "neutral" | "cacau" | "pistache";
  readonly tag: string;
  readonly title: string;
  readonly leadDescription: string;
  readonly actionLabel: string;
  readonly onActionClick?: () => void;
  readonly href?: string;
}

const OVERLAY_THEME_CLASSES = {
  cacau: styles.themeCacau,
  pistache: styles.themePistache,
  neutral: styles.themeNeutral,
} as const;

export function ServiceTierCard({
  id,
  isPrimaryFeatured = false,
  image,
  alt,
  overlayTheme = "neutral",
  tag,
  title,
  leadDescription,
  actionLabel,
  onActionClick,
  href,
}: ServiceTierCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const actionNotchRef = useRef<HTMLDivElement>(null);

  useNotchedClipPath(cardRef, {
    placement: "bottom-right",
    notchRef: actionNotchRef,
    innerRadius: ACTION_NOTCH_INNER_RADIUS,
    paddingOuter: ACTION_NOTCH_PADDING,
  });

  const shellClassName = [styles.cardShell, isPrimaryFeatured && styles.featuredShell]
    .filter(Boolean)
    .join(" ");

  const cardClassName = [styles.card, isPrimaryFeatured && styles.featuredCard]
    .filter(Boolean)
    .join(" ");

  const themeClassName = OVERLAY_THEME_CLASSES[overlayTheme] ?? styles.themeNeutral;

  const isExternal = Boolean(href?.startsWith("http"));
  const ActionTag = href ? "a" : "button";

  return (
    <article id={`servico-${id}`} className={shellClassName} aria-labelledby={`title-${id}`}>
      <div className={styles.cardShadow}>
        <div ref={cardRef} className={cardClassName}>
          <img src={image} alt={alt} className={styles.cardImage} loading="lazy" decoding="async" />

          <div className={`${styles.glassOverlay} ${themeClassName}`}>
            <div className={styles.cardHeader}>
              <span className={styles.tag}>{tag}</span>
              <h3 id={`title-${id}`} className={styles.cardTitle}>
                {title}
              </h3>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardDescription}>{leadDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={actionNotchRef} className={styles.actionNotchWrapper}>
        <ActionTag
          {...(href ? { href } : { type: "button" })}
          className={styles.cardActionBtn}
          aria-label={actionLabel}
          onClick={onActionClick}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span className={styles.actionLabelTrack}>
            <span className={styles.actionLabelInner}>{actionLabel}</span>
          </span>
          <span className={styles.actionIconWrapper} aria-hidden="true">
            <ArrowRight size={18} strokeWidth={2.2} />
          </span>
        </ActionTag>
      </div>
    </article>
  );
}
