import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import styles from "./MenuHeader.module.scss";

export function MenuHeader() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.header
      className={styles.header}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      <motion.p className={styles.eyebrow} variants={itemVariants}>
        <Sparkles size={14} aria-hidden="true" />
        <span>Cardápio &amp; Coleções</span>
      </motion.p>
      <motion.h2 id="menu-title" className={styles.title} variants={itemVariants}>
        Criações autorais em edições limitadas
      </motion.h2>
      <motion.p className={styles.lead} variants={itemVariants}>
        Doces concebidos individualmente para degustação imediata, caixas sofisticadas para
        presentear ou lotes exclusivos para celebrações memoráveis.
      </motion.p>
    </motion.header>
  );
}
