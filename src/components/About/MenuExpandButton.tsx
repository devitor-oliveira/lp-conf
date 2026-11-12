import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./MenuExpandButton.module.scss";

export function MenuExpandButton() {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToMenu = () => {
    const target = document.querySelector("#cardapio");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      type="button"
      className={styles.expandButton}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={handleScrollToMenu}
      aria-label="Navegar até o Cardápio e Coleções"
    >
      <motion.span
        className={styles.label}
        animate={{
          width: isHovered && !shouldReduceMotion ? "auto" : "max-content",
        }}
      >
        {isHovered ? "Explorar Coleções" : "Ver Cardápio"}
      </motion.span>
      <span className={styles.arrowBadge} aria-hidden="true">
        <ArrowRight size={14} />
      </span>
    </button>
  );
}
