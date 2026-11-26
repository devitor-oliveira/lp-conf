import styles from "./MenuPriceBadge.module.scss";

export interface MenuPriceBadgeProps {
  readonly priceDisplay: string;
  readonly portionsInfo: string;
}

export function MenuPriceBadge({ priceDisplay, portionsInfo }: MenuPriceBadgeProps) {
  return (
    <div className={styles.priceBadge}>
      <span className={styles.priceValue}>{priceDisplay}</span>
      <span className={styles.portionsDivider} aria-hidden="true">
        •
      </span>
      <span className={styles.portionsText}>{portionsInfo}</span>
    </div>
  );
}
