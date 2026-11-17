import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NotchContainer } from "@/components/Notch";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import styles from "./Header.module.scss";

export interface HeaderProps {
  /** Cor de fundo dinâmica da pílula de navegação ancorada no Hero */
  navBgColor?: string;
  /** Define se o Header deve assumir o modo flutuante centralizado (opcional; se omitido, monitora a saída do header ancorado automaticamente) */
  isFloating?: boolean;
  /** Callback disparado quando o estado flutuante se altera */
  onFloatingChange?: (isFloating: boolean) => void;
  /** Classe CSS adicional opcional */
  className?: string;
  /** Margem/offset de referência em relação à seção adjacente (padrão: token --layout-stage-margin) */
  offset?: number | string;
  /** Raio interno base da pílula para o cálculo concêntrico (padrão: 32px) */
  innerRadius?: number | string;
  /** Espaçamento voltado para o interior da seção (padrão: 12px) */
  paddingOuter?: number | string;
  /** Espaçamento voltado para a borda externa da janela (padrão: token --layout-stage-margin) */
  paddingInner?: number | string;
}

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#conheca", label: "Conheça" },
  { href: "#encomende", label: "Encomende Já" },
] as const;

export function Header({
  navBgColor = "var(--color-surface-default)",
  isFloating: isFloatingProp,
  onFloatingChange,
  className,
  offset = "var(--layout-stage-margin)",
  innerRadius = 32,
  paddingOuter = 12,
  paddingInner = "var(--layout-stage-margin)",
}: HeaderProps) {
  const dockedRef = useRef<HTMLElement>(null);
  const [internalFloating, setInternalFloating] = useState(false);

  const activeFloating = isFloatingProp !== undefined ? isFloatingProp : internalFloating;

  useEffect(() => {
    if (isFloatingProp !== undefined) return;

    const target = dockedRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // O header flutuante surge assim que o header ancorado sair pelo topo da tela
        const isPastTop = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        setInternalFloating(isPastTop);
        onFloatingChange?.(isPastTop);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isFloatingProp, onFloatingChange]);

  const composedDockedClassName = [styles.header, className].filter(Boolean).join(" ");

  return (
    <>
      <NotchContainer
        ref={dockedRef}
        as="header"
        placement="top-left"
        className={composedDockedClassName}
        concentric={{
          innerRadius,
          paddingOuter,
          paddingInner,
        }}
        offsetX={offset}
        offsetY={offset}
        aria-hidden={activeFloating || undefined}
      >
        <nav aria-label="Navegação principal" style={{ backgroundColor: navBgColor }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} tabIndex={activeFloating ? -1 : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
      </NotchContainer>

      <AnimatePresence>
        {activeFloating && (
          <motion.header
            key="floating-header"
            className={styles.floatingHeader}
            initial={{ y: -140, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -140, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
          >
            <nav aria-label="Navegação principal" className={styles.floatingNav}>
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>

            <motion.div
              className={styles.floatingToggleWrapper}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
            >
              <ThemeToggleButton className={styles.floatingToggleButton} />
            </motion.div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
