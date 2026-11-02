import type { ComponentPropsWithRef, CSSProperties, ElementType, ReactNode } from "react";

export type NotchCornerPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
  /** Canto externo onde o entalhe se ancora */
  placement: NotchCornerPlacement;
  /** Raio convexo externo do entalhe (sobrescreve cálculo concêntrico se informado) */
  radius?: number | string;
  /** Tamanho das curvas côncavas de concordância (sobrescreve cálculo concêntrico se informado) */
  filletSize?: number | string;
  /** Configuração opcional para derivar radius e filletSize concentricamente */
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
