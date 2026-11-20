import { MotionConfig } from "motion/react";
import { useState } from "react";
import { Header } from "@/components/Header/Header";
import { ThemeToggle } from "@/components/ThemeToggle";
import { About } from "@/sections/About";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { Menu } from "@/sections/Menu";
import { Order } from "@/sections/Order";
import styles from "./App.module.scss";

export function App() {
  const [activeSurfaceColor, setActiveSurfaceColor] = useState<string>(
    "var(--color-surface-slide-1)",
  );

  return (
    <MotionConfig reducedMotion="never">
      <Header />
      <ThemeToggle />
      <main className={styles.main} id="conteudo" tabIndex={-1}>
        <Hero activeColor={activeSurfaceColor} onSlideColorChange={setActiveSurfaceColor} />
        <About />
        <Menu />
        <Order />
      </main>
      <Footer />
    </MotionConfig>
  );
}
