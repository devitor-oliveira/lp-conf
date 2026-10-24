import { MotionConfig } from "motion/react";

import { Hero } from "@/sections/Hero";
import styles from "./App.module.scss";

export function App() {
  return (
    <MotionConfig>
      <header className={styles.header}>
        <nav aria-label="Navegação principal">
          <a href="/">Alo</a>
          <a href="/">alo</a>
          <a href="/">alo</a>
        </nav>
      </header>
      <main className={styles.main} id="conteudo" tabIndex={-1}>
        <Hero />
      </main>
      <footer className={styles.footer}></footer>
    </MotionConfig>
  );
}
