import { MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header/Header";
import { ThemeToggle } from "@/components/ThemeToggle";
import { About } from "@/sections/About";
import { Hero } from "@/sections/Hero";
import { Menu } from "@/sections/Menu";
import styles from "./App.module.scss";

export function App() {
  const [_activeTextColor, _setActiveTextColor] = useState<string>("var(--color-text-slide-1)");
  void _activeTextColor;
  void _setActiveTextColor;

  const [activeSurfaceColor, setActiveSurfaceColor] = useState<string>(
    "var(--color-surface-slide-1)",
  );
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = heroSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry) {
          setIsHeroInView(firstEntry.isIntersecting);
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const headerNavBg = isHeroInView ? activeSurfaceColor : "var(--color-surface-default)";

  return (
    <MotionConfig>
      <Header navBgColor={headerNavBg} />
      <ThemeToggle />
      <main className={styles.main} id="conteudo" tabIndex={-1}>
        <Hero
          heroRef={heroSectionRef}
          activeColor={activeSurfaceColor}
          onSlideColorChange={setActiveSurfaceColor}
        />
        <About />
        <Menu />
      </main>
      <footer className={styles.footer} />
    </MotionConfig>
  );
}
