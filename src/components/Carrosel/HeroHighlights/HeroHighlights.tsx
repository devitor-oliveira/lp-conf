import {
  Gift,
  Hand,
  Layers,
  Leaf,
  MessageCircle,
  Package,
  SlidersHorizontal,
  Sparkles,
  Store,
} from "lucide-react";
import styles from "./HeroHighlights.module.scss";

const ICONS = {
  hand: Hand,
  layers: Layers,
  leaf: Leaf,
  gift: Gift,
  package: Package,
  sparkles: Sparkles,
  message: MessageCircle,
  sliders: SlidersHorizontal,
  store: Store,
} as const;

export type HeroHighlightIcon = keyof typeof ICONS;

export interface HeroHighlight {
  id: string;
  icon: HeroHighlightIcon;
  label: string;
}

export interface HeroHighlightsProps {
  highlights: readonly HeroHighlight[];
  showRatingBadge?: boolean;
}

export function HeroHighlights({ highlights, showRatingBadge = false }: HeroHighlightsProps) {
  if (!showRatingBadge && highlights.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {showRatingBadge && (
        <li className={styles.ratingPill}>
          <span aria-hidden="true">★</span>
          <span>4.9 (1.200+ avaliações)</span>
        </li>
      )}
      {highlights.map(({ id, icon, label }) => {
        const Icon = ICONS[icon];

        return (
          <li key={id} className={styles.pill}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
