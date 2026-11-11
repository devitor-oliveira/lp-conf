import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./ThemeToggle.module.scss";
import { type ThemeMode, useTheme } from "./useTheme";

export interface ThemeToggleButtonProps {
  /** Classe CSS adicional opcional para o botão circular */
  className?: string;
  /** Callback opcional disparado ao alternar o tema */
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeToggleButton({ className, onThemeChange }: ThemeToggleButtonProps) {
  const { theme, toggleTheme, isDark } = useTheme(onThemeChange);
  // Reduced motion temporariamente desligado a pedido do usuário
  const shouldReduceMotion = false;

  const composedClassName = [styles.toggleButton, className].filter(Boolean).join(" ");
  const actionLabel = theme === "light" ? "Alternar para tema escuro" : "Alternar para tema claro";

  return (
    <motion.button
      type="button"
      className={composedClassName}
      onClick={toggleTheme}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.07 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 20 }
      }
      aria-label={actionLabel}
      aria-pressed={isDark}
      title={actionLabel}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className={styles.iconWrapper}
          initial={shouldReduceMotion ? { opacity: 0 } : { rotate: -90, scale: 0, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { rotate: 90, scale: 0, opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 400, damping: 25 }
          }
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
