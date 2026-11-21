import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ThemeMode, useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggle.module.scss";

export interface ThemeToggleButtonProps {
  /** Classe CSS adicional opcional para o botão circular */
  className?: string;
  /** Callback opcional disparado ao alternar o tema */
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeToggleButton({ className, onThemeChange }: ThemeToggleButtonProps) {
  const { theme, toggleTheme, isDark } = useTheme(onThemeChange);

  const composedClassName = [styles.toggleButton, className].filter(Boolean).join(" ");
  const actionLabel = theme === "light" ? "Alternar para tema escuro" : "Alternar para tema claro";

  return (
    <motion.button
      type="button"
      className={composedClassName}
      onClick={toggleTheme}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 20 }}
      aria-label={actionLabel}
      aria-pressed={isDark}
      title={actionLabel}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className={styles.iconWrapper}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {theme === "light" ? (
            <Moon size={20} aria-hidden="true" />
          ) : (
            <Sun size={20} aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
