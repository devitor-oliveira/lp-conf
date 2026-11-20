import Carrosel from "@/components/Carrosel/Carrosel";
import styles from "./Hero.module.scss";

export interface HeroProps {
  onSlideColorChange?: (colorToken: string) => void;
  activeColor?: string;
}

export function Hero({ onSlideColorChange, activeColor }: HeroProps) {
  return (
    <section
      className={styles.hero}
      id="inicio"
      aria-labelledby="hero-title"
      style={{
        backgroundColor: activeColor || "var(--color-surface-slide-1)",
      }}
    >
      <Carrosel activeSurfaceColor={activeColor} onSlideColorChange={onSlideColorChange} />
    </section>
  );
}
