import { MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Hero } from "@/sections/Hero";
import styles from "./App.module.scss";

export function App() {
  const [activeTextColor, setActiveTextColor] = useState<string>(
    "var(--color-text-slide-1)",
  );
  const [activeSurfaceColor, setActiveSurfaceColor] = useState<string>(
    "var(--color-surface-slide-1)",
  );
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = heroSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const headerNavBg = isHeroInView
    ? activeSurfaceColor
    : "var(--color-surface-default)";

  return (
    <MotionConfig>
      <header className={styles.header}>
        <nav
          aria-label="Navegação principal"
          style={{ backgroundColor: headerNavBg }}
        >
          <a href="/">Inicio</a>
          <a href="/">Conheça</a>
          <a href="/">Encomende Já</a>
        </nav>
      </header>
      <main className={styles.main} id="conteudo" tabIndex={-1}>
        <Hero
          heroRef={heroSectionRef}
          activeColor={activeSurfaceColor}
          onSlideColorChange={setActiveSurfaceColor}
        />
      </main>
      <footer className={styles.footer}></footer>
    </MotionConfig>
  );
}
