import { type CSSProperties, useMemo } from "react";
import { generateBiArcWingSvgPath } from "./biarc";
import {
  buildNotchCssVars,
  calculateConcentricNotch,
  parseNumericPx,
  toCssLength,
} from "./notchUtils";
import type { NotchOwnProps } from "./types";

export interface UseNotchOptions extends Omit<NotchOwnProps, "as" | "className" | "children"> {}

/**
 * Hook customizado que encapsula o ciclo de vida, memoização geométrica e variáveis CSS do entalhe.
 * Evita recálculos trigonométricos a cada frame de renderização do componente.
 */
export function useNotch(options: UseNotchOptions) {
  const {
    placement,
    variant = "classic",
    radius,
    filletSize,
    angle,
    smoothHeight = 44,
    concentric,
    offsetX,
    offsetY,
    color,
    dropShadow,
    style,
  } = options;

  const isSmoothTopCenter = variant === "smooth" && placement === "top-center";

  // Cálculos concêntricos caso habilitados
  const concentricValues = useMemo(() => {
    if (isSmoothTopCenter || !concentric) return undefined;
    return calculateConcentricNotch(concentric, offsetX ?? offsetY ?? 0);
  }, [isSmoothTopCenter, concentric, offsetX, offsetY]);

  const resolvedRadius = toCssLength(radius) ?? concentricValues?.radius;
  const resolvedFillet = toCssLength(filletSize) ?? concentricValues?.filletSize;

  const numericOffsetY = Math.max(0, parseNumericPx(offsetY, 0));
  const numericRadiusBottom = parseNumericPx(radius, 80);
  const safeSmoothHeight = Math.max(0, smoothHeight);

  // Memoiza cálculos trigonométricos pesados de bi-arco (G1 tangency)
  const wings = useMemo(() => {
    if (!isSmoothTopCenter) return null;

    const commonParams = {
      height: safeSmoothHeight,
      angleDeg: angle,
      radiusBottom: numericRadiusBottom,
      offsetY: numericOffsetY,
      overlapPx: 1,
    };

    return {
      left: generateBiArcWingSvgPath({ ...commonParams, side: "left" }),
      right: generateBiArcWingSvgPath({ ...commonParams, side: "right" }),
    };
  }, [isSmoothTopCenter, safeSmoothHeight, angle, numericRadiusBottom, numericOffsetY]);

  // Montagem declarativa de estilo e variáveis CSS via Padrão 1
  const mergedStyle = useMemo<CSSProperties>(() => {
    const cssVars = buildNotchCssVars({
      radius: resolvedRadius,
      fillet: resolvedFillet,
      angle,
      offsetX,
      offsetY,
      color,
      dropShadow,
      smoothTotalHeight: isSmoothTopCenter ? numericOffsetY + safeSmoothHeight : undefined,
    });

    return {
      ...cssVars,
      ...style,
    };
  }, [
    resolvedRadius,
    resolvedFillet,
    angle,
    offsetX,
    offsetY,
    color,
    dropShadow,
    isSmoothTopCenter,
    numericOffsetY,
    safeSmoothHeight,
    style,
  ]);

  return {
    isSmoothTopCenter,
    wings,
    mergedStyle,
  };
}
