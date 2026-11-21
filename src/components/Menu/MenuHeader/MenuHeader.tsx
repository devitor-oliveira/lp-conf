import { motion } from "motion/react";
import styles from "./MenuHeader.module.scss";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function MenuHeader() {
  return (
    <motion.header
      className={styles.header}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      <div className={styles.titleBlock}>
        <motion.p className={styles.eyebrow} variants={itemVariants}>
          • Cardápio &amp; Coleções
        </motion.p>
        <motion.h2 id="menu-title" className={styles.title} variants={itemVariants}>
          Criações Autorais
        </motion.h2>
      </div>
    </motion.header>
  );
}
