import { toCssAngle } from "./biarc";
import type { ConcentricNotchConfig } from "./types";

export interface NotchCssParams {
  radius?: string;
  fillet?: string;
  angle?: number | string;
  offsetX?: number | string;
  offsetY?: number | string;
  color?: string;
  dropShadow?: string;
  smoothTotalHeight?: number;
}

/**
 * Converte de forma segura número ou string para comprimento CSS válido (px).
 * Rejeita valores nulos, vazios ou NaN.
 */
export function toCssLength(value: number | string | undefined | null): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") {
    return Number.isFinite(value) ? `${value}px` : undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /^-?\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

/**
 * Sanitiza cor removendo espaços e descartando strings vazias para preservar o fallback CSS.
 */
export function sanitizeColor(color: string | undefined | null): string | undefined {
  if (!color) return undefined;
  const trimmed = color.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Sanitiza a especificação de sombra drop-shadow prevenindo CSS inválido ou wrappers duplicados.
 */
export function sanitizeDropShadow(shadow: string | undefined | null): string | undefined {
  if (!shadow) return undefined;
  const trimmed = shadow.trim();
  if (!trimmed || trimmed === "none") return "none";
  if (trimmed.startsWith("drop-shadow(") && trimmed.endsWith(")")) {
    return trimmed;
  }
  return `drop-shadow(${trimmed})`;
}

/**
 * Filtra de forma funcional entradas nulas/indefinidas/vazias sem imperatividade.
 */
export function compactCssVars(vars: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(vars).filter(
      (entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== "",
    ),
  );
}

/**
 * Padrão 1: Dicionário declarativo e compacto de mapeamento para variáveis CSS.
 * Elimina toda a cadeia de ifs manuais e centraliza a sanitização.
 */
export function buildNotchCssVars(params: NotchCssParams): Record<string, string> {
  return compactCssVars({
    "--notch-radius": params.radius,
    "--notch-fillet": params.fillet,
    "--notch-angle":
      params.angle !== undefined && params.angle !== null && params.angle !== ""
        ? toCssAngle(params.angle)
        : undefined,
    "--notch-offset-x": toCssLength(params.offsetX),
    "--notch-offset-y": toCssLength(params.offsetY),
    "--notch-bg": sanitizeColor(params.color),
    "--notch-shadow": sanitizeDropShadow(params.dropShadow),
    "--notch-smooth-total-height":
      params.smoothTotalHeight !== undefined && Number.isFinite(params.smoothTotalHeight)
        ? `${params.smoothTotalHeight}px`
        : undefined,
  });
}

/**
 * Parsing numérico estrito garantindo limites finitos e não negativos.
 */
export function parseNumericPx(value: number | string | undefined, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.trim());
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }
  return Math.max(0, fallback);
}

/**
 * Cálculo analítico de concordância concêntrica para cantos.
 */
export function calculateConcentricNotch(
  config: ConcentricNotchConfig,
  offset: number | string = 0,
): { radius: string; filletSize: string } {
  if (
    typeof config.innerRadius === "number" &&
    typeof config.paddingOuter === "number" &&
    (config.paddingInner === undefined || typeof config.paddingInner === "number") &&
    typeof offset === "number"
  ) {
    const padInner = config.paddingInner ?? config.paddingOuter;
    return {
      radius: `${config.innerRadius + config.paddingOuter}px`,
      filletSize: `${Math.max(0, padInner + config.innerRadius - offset)}px`,
    };
  }

  const inner = toCssLength(config.innerRadius) ?? "0px";
  const padOuter = toCssLength(config.paddingOuter) ?? "0px";
  const padInner = toCssLength(config.paddingInner ?? config.paddingOuter) ?? padOuter;
  const off = toCssLength(offset) ?? "0px";

  return {
    radius: `calc(${inner} + ${padOuter})`,
    filletSize: `max(0px, calc(${padInner} + ${inner} - ${off}))`,
  };
}
