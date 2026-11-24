import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { type ThemeMode, useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggle.module.scss";

export interface ThemeSwitchPillProps {
  /** Classe CSS adicional opcional para o botão switch */
  className?: string;
  /** Callback opcional disparado ao alternar o tema */
  onThemeChange?: (theme: ThemeMode) => void;
}

const THUMB_SPRING_TRANSITION = {
  type: "spring",
  stiffness: 500,
  damping: 32,
} as const;

export function ThemeSwitchPill({ className, onThemeChange }: ThemeSwitchPillProps) {
  const { toggleTheme, isDark } = useTheme(onThemeChange);

  const composedClassName = [styles.switchTrack, isDark && styles.isDark, className]
    .filter(Boolean)
    .join(" ");

  const actionLabel = isDark ? "Alternar para tema claro" : "Alternar para tema escuro";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Tema escuro"
      title={actionLabel}
      className={composedClassName}
      onClick={toggleTheme}
    >
      <span className={styles.switchDots} aria-hidden="true">
        <span className={styles.switchDot} />
        <span className={`${styles.switchDot} ${styles.switchDotSmall}`} />
      </span>

      <motion.span
        layout="position"
        transition={THUMB_SPRING_TRANSITION}
        className={styles.switchThumb}
      >
        <span className={styles.switchThumbIcon} aria-hidden="true">
          {isDark ? <Moon size={16} strokeWidth={2.2} /> : <Sun size={16} strokeWidth={2.2} />}
        </span>
      </motion.span>
    </button>
  );
}
