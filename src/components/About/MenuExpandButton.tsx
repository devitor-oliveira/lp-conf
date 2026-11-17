import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { scrollToSection } from "@/utils/scrollToSection";
import styles from "./MenuExpandButton.module.scss";

export function MenuExpandButton() {
  const handleScrollToMenu = () => {
    scrollToSection("#cardapio", { fallbackToBottom: true });
  };

  return (
    <button
      type="button"
      className={styles.expandButton}
      onClick={handleScrollToMenu}
      aria-label="Navegar até o Cardápio e Coleções"
    >
      <span className={styles.label}>Explorar Cardápio</span>
      <motion.span
        className={styles.arrowBadge}
        aria-hidden="true"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowRight size={14} />
      </motion.span>
    </button>
  );
}
