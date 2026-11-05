import { NotchContainer } from "@/components/Notch";
import styles from "./Header.module.scss";

export interface HeaderProps {
  /** Cor de fundo dinâmica da pílula de navegação */
  navBgColor?: string;
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

export function Header({
  navBgColor = "var(--color-surface-default)",
  className,
  offset = "var(--layout-stage-margin)",
  innerRadius = 32,
  paddingOuter = 12,
  paddingInner = "var(--layout-stage-margin)",
}: HeaderProps) {
  const composedClassName = [styles.header, className].filter(Boolean).join(" ");

  return (
    <NotchContainer
      as="header"
      placement="top-left"
      className={composedClassName}
      concentric={{
        innerRadius,
        paddingOuter,
        paddingInner,
      }}
      offsetX={offset}
      offsetY={offset}
    >
      <nav aria-label="Navegação principal" style={{ backgroundColor: navBgColor }}>
        <a href="#inicio">Inicio</a>
        <a href="#conheca">Conheça</a>
        <a href="#encomende">Encomende Já</a>
      </nav>
    </NotchContainer>
  );
}
