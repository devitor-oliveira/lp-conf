import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ConcentricNotchConfig, NotchContainer } from "@/components/Notch";
import styles from "./ThemeToggle.module.scss";
import { type ThemeMode, useTheme } from "./useTheme";

export interface ThemeToggleProps {
  /** Classe CSS adicional opcional para o container entalhado */
  className?: string;
  /** Raio externo explícito (usado quando em modo manual, ex.: Sandbox) */
  radius?: number | string;
  /** Tamanho do filete côncavo explícito (usado quando em modo manual) */
  filletSize?: number | string;
  /** Configuração concêntrica customizada opcional */
  concentric?: ConcentricNotchConfig;
  /** Margem/offset horizontal em relação à seção adjacente (padrão: --layout-stage-margin) */
  offsetX?: number | string;
  /** Margem/offset vertical em relação à seção adjacente (padrão: --layout-stage-margin) */
  offsetY?: number | string;
  /** Sombra opcional compatível com contornos côncavos */
  dropShadow?: string;
  /** Callback opcional disparado ao alternar o tema */
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeToggle({
  className,
  radius,
  filletSize,
  concentric,
  offsetX = "var(--layout-stage-margin)",
  offsetY = "var(--layout-stage-margin)",
  dropShadow,
  onThemeChange,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme(onThemeChange);
  const shouldReduceMotion = useReducedMotion();

  const resolvedConcentric: ConcentricNotchConfig | undefined =
    radius !== undefined || filletSize !== undefined
      ? concentric
      : (concentric ?? {
          innerRadius: "var(--toggle-inner-radius, 28px)",
          paddingOuter: "var(--toggle-pad-outer, 12px)",
          paddingInner: offsetX,
        });

  const composedClassName = [styles.toggleContainer, className].filter(Boolean).join(" ");
  const actionLabel = theme === "light" ? "Alternar para tema escuro" : "Alternar para tema claro";
  const isDark = theme === "dark";

  return (
    <NotchContainer
      as="div"
      placement="top-right"
      className={composedClassName}
      radius={radius}
      filletSize={filletSize}
      concentric={resolvedConcentric}
      offsetX={offsetX}
      offsetY={offsetY}
      dropShadow={dropShadow}
    >
      <motion.button
        type="button"
        className={styles.toggleButton}
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
            initial={shouldReduceMotion ? { opacity: 0 } : { rotate: -90, scale: 0.35, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { rotate: 90, scale: 0.35, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 340, damping: 20 }
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
    </NotchContainer>
  );
}

export default ThemeToggle;
