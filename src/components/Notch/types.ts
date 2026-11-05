import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from "react";

export type NotchCornerPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type NotchPlacement = NotchCornerPlacement | "top-center";

export type NotchVariant = "classic" | "smooth";

export interface ConcentricNotchConfig {
  /** Raio interno do elemento filho (ex.: pílula de navegação ou botão interno) */
  innerRadius: number | string;
  /** Padding voltado para o interior da seção (soma-se ao raio interno para formar o canto convexo) */
  paddingOuter: number | string;
  /** Padding voltado para a borda externa (usado para derivar o fillet côncavo; padrão = paddingOuter) */
  paddingInner?: number | string;
}

export interface NotchOwnProps<T extends ElementType = "div"> {
  /** Elemento HTML ou componente React a ser renderizado (padrão: "div") */
  as?: T;
  /** Posição onde o entalhe se ancora (cantos externos ou topo central) */
  placement: NotchPlacement;
  /** Variante geométrica: "classic" (CSS 90° padrão) ou "smooth" (Bi-arcos SVG de ângulo raso) */
  variant?: NotchVariant;
  /** Raio convexo externo do entalhe (no modo "smooth", define o raio inferior desejado; padrão: 80) */
  radius?: number | string;
  /** Tamanho das curvas côncavas de concordância (sobrescreve cálculo concêntrico no modo "classic") */
  filletSize?: number | string;
  /** Angulação máxima da rampa em graus para o modo "smooth" (ex.: 38 ou "38deg"; padrão: 38) */
  angle?: number | string;
  /** Altura líquida da aba em pixels para o cálculo de bi-arcos no modo "smooth" (padrão: 44) */
  smoothHeight?: number;
  /** Configuração opcional para derivar radius e filletSize concentricamente (modo "classic") */
  concentric?: ConcentricNotchConfig;
  /** Margem/distância horizontal até a superfície adjacente */
  offsetX?: number | string;
  /** Margem/distância vertical até a superfície adjacente */
  offsetY?: number | string;
  /** Cor de preenchimento do entalhe e gradientes (padrão: var(--color-background)) */
  color?: string;
  /** Sombra contínua opcional aplicada via CSS filter drop-shadow (ex.: "0 4px 12px rgb(0 0 0 / 0.12)") */
  dropShadow?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export type NotchContainerProps<T extends ElementType = "div"> = NotchOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof NotchOwnProps<T>>;
