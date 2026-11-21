import { type CSSProperties, useMemo } from "react";
import type { NotchOwnProps } from "@/components/Notch/types";
import {
  buildNotchCssVars,
  calculateConcentricNotch,
  calculateConcentricSmoothHeight,
  generateBiArcWingSvgPath,
  parseNumericPx,
  toCssLength,
} from "@/utils/notch";

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
    smoothHeight,
    concentric,
    offsetX,
    offsetY,
    color,
    dropShadow,
    style,
  } = options;

  const isSmoothTopCenter = variant === "smooth" && placement === "top-center";
  const isSmoothTopLeft = variant === "smooth" && placement === "top-left";
  const isSmooth = isSmoothTopCenter || isSmoothTopLeft;

  // Cálculos concêntricos caso habilitados
  const concentricValues = useMemo(() => {
    if (isSmooth || !concentric) return undefined;
    return calculateConcentricNotch(concentric, offsetX ?? offsetY ?? 0);
  }, [isSmooth, concentric, offsetX, offsetY]);

  const resolvedRadius = toCssLength(radius) ?? concentricValues?.radius;
  const resolvedFillet = toCssLength(filletSize) ?? concentricValues?.filletSize;

  const numericOffsetY = Math.max(0, parseNumericPx(offsetY, 0));
  const numericRadiusBottom = parseNumericPx(resolvedRadius, 80);
  const safeSmoothHeight =
    smoothHeight !== undefined && Number.isFinite(smoothHeight)
      ? Math.max(0, smoothHeight)
      : calculateConcentricSmoothHeight(concentric, 44);

  // Memoiza cálculos trigonométricos pesados de bi-arco (G1 tangency)
  const wings = useMemo(() => {
    if (!isSmooth) return null;

    const commonParams = {
      height: safeSmoothHeight,
      angleDeg: angle,
      radiusBottom: numericRadiusBottom,
      offsetY: numericOffsetY,
      overlapPx: 1,
    };

    return {
      left: isSmoothTopCenter ? generateBiArcWingSvgPath({ ...commonParams, side: "left" }) : null,
      right: generateBiArcWingSvgPath({ ...commonParams, side: "right" }),
    };
  }, [isSmooth, isSmoothTopCenter, safeSmoothHeight, angle, numericRadiusBottom, numericOffsetY]);

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
      smoothTotalHeight: isSmooth ? numericOffsetY + safeSmoothHeight : undefined,
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
    isSmooth,
    numericOffsetY,
    safeSmoothHeight,
    style,
  ]);

  return {
    isSmooth,
    isSmoothTopCenter,
    isSmoothTopLeft,
    wings,
    mergedStyle,
  };
}
