import { motion, useReducedMotion } from "motion/react";
import Carrosel from "@/components/Carrosel/Carrosel";
import styles from "./Hero.module.scss";

export function Hero() {
  // const reducedMotion = useReducedMotion();

  return (
    <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
      <Carrosel />
    </section>
  );
}
