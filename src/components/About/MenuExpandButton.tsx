import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { scrollToSection } from "@/utils/scrollToSection";
import styles from "./MenuExpandButton.module.scss";

const buttonVariants = {
  hover: { y: -1 },
  tap: { scale: 0.98 },
};

const arrowVariants = {
  hover: { x: 2 },
  tap: { scale: 0.95 },
};

export function MenuExpandButton() {
  const handleScrollToMenu = () => {
    scrollToSection("#cardapio", { fallbackToBottom: true });
  };

  return (
    <motion.button
      type="button"
      className={styles.expandButton}
      onClick={handleScrollToMenu}
      aria-label="Navegar até o Cardápio e Coleções"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className={styles.label}>Explorar Cardápio</span>
      <motion.span
        className={styles.arrowBadge}
        aria-hidden="true"
        variants={arrowVariants}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <ArrowRight size={14} />
      </motion.span>
    </motion.button>
  );
}
