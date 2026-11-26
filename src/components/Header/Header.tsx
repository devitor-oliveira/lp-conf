import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NotchContainer } from "@/components/Notch";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { readRootCssLengthPx } from "@/utils/notch";
import styles from "./Header.module.scss";

const DEFAULT_STAGE_MARGIN_PX = 12; // Fallback para --layout-stage-margin (0.75rem)
const HEADER_NOTCH_ANGLE = 60;
const HEADER_NOTCH_HEIGHT = 48;
const HEADER_RADIUS_BOTTOM = 36;
const HEADER_LEFT_FILLET = 32; // Equivalente ao token --radius-max (2rem) da Hero

export interface HeaderProps {
  /** Define se o Header deve assumir o modo flutuante centralizado (opcional; se omitido, monitora a saída do header ancorado automaticamente) */
  isFloating?: boolean;
  /** Callback disparado quando o estado flutuante se altera */
  onFloatingChange?: (isFloating: boolean) => void;
  /** Classe CSS adicional opcional */
  className?: string;
  /** Margem/offset de referência em pixels até a seção adjacente (padrão: sincronizado com --layout-stage-margin) */
  offset?: number;
  /** Angulação máxima da rampa suave do entalhe em graus (padrão: 60) */
  angle?: number | string;
  /** Altura líquida do entalhe em pixels abaixo do offset superior (padrão: 48) */
  notchHeight?: number;
  /** Raio convexo inferior desejado em pixels (padrão: 36) */
  radiusBottom?: number;
}

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#conheca", label: "Conheça" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#encomende", label: "Encomende Já" },
] as const;

export function Header({
  isFloating: isFloatingProp,
  onFloatingChange,
  className,
  offset,
  angle = HEADER_NOTCH_ANGLE,
  notchHeight = HEADER_NOTCH_HEIGHT,
  radiusBottom = HEADER_RADIUS_BOTTOM,
}: HeaderProps) {
  const dockedRef = useRef<HTMLElement>(null);
  const [internalFloating, setInternalFloating] = useState(false);
  const [stageMarginPx] = useState(() =>
    readRootCssLengthPx("--layout-stage-margin", DEFAULT_STAGE_MARGIN_PX),
  );
  const resolvedOffset = offset ?? stageMarginPx;

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
        variant="smooth"
        angle={angle}
        radius={radiusBottom}
        smoothHeight={notchHeight}
        filletSize={HEADER_LEFT_FILLET}
        offsetX={resolvedOffset}
        offsetY={resolvedOffset}
        className={composedDockedClassName}
        aria-hidden={activeFloating || undefined}
      >
        <nav aria-label="Navegação principal">
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
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
              mass: 0.8,
            }}
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
