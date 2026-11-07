import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { type ConcentricNotchConfig, NotchContainer } from "@/components/Notch";
import styles from "./ThemeToggle.module.scss";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "lp-conf-theme";

function resolveInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch {
    // Ignora restrições de armazenamento privado
  }

  if (document.documentElement.getAttribute("data-theme") === "dark") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDocumentTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

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
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme);

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      try {
        const hasManualPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (hasManualPreference === "dark" || hasManualPreference === "light") {
          return;
        }
      } catch {
        // Segue preferência do sistema caso localStorage esteja indisponível
      }
      const nextTheme: ThemeMode = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      onThemeChange?.(nextTheme);
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [onThemeChange]);

  const handleToggle = () => {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignora erros de quota/privacidade no localStorage
    }
    onThemeChange?.(nextTheme);
  };

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

  return (
    <NotchContainer
      as="aside"
      placement="top-right"
      aria-label="Preferência de tema"
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
        onClick={handleToggle}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 450, damping: 20 }}
        aria-label={actionLabel}
        title={actionLabel}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className={styles.iconWrapper}
            initial={{ rotate: -90, scale: 0.35, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.35, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 20,
            }}
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
