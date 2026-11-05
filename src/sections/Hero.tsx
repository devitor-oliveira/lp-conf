import type React from "react";
import Carrosel from "@/components/Carrosel/Carrosel";
import styles from "./Hero.module.scss";

export interface HeroProps {
  onSlideColorChange?: (colorToken: string) => void;
  activeColor?: string;
  heroRef?: React.Ref<HTMLElement>;
}

export function Hero({ onSlideColorChange, activeColor, heroRef }: HeroProps) {
  return (
    <section
      ref={heroRef}
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
