export { type UseNotchOptions, useNotch } from "@/hooks/useNotch";

export {
  type BiArcParams,
  type BiArcWingSvgParams,
  buildNotchCssVars,
  type ConcentricCollarSvgParams,
  calculateConcentricNotch,
  calculateConcentricSmoothHeight,
  clampAngleDeg,
  compactCssVars,
  DEFAULT_BIARC_ANGLE_DEG,
  type GeneratedSvgGeometry,
  generateBiArcWingSvgPath,
  generateConcentricCollarSvgPath,
  generateNotchedCardClipPath,
  generateTopCenterBiArcSvgPath,
  MAX_BIARC_ANGLE_DEG,
  MIN_BIARC_ANGLE_DEG,
  type NotchCssParams,
  type NotchedCardClipPathParams,
  type NotchedCardPlacement,
  parseAngleDeg,
  parseNumericPx,
  type SolvedBiArc,
  sanitizeColor,
  sanitizeDropShadow,
  solveBiArc,
  type TopCenterBiArcSvgParams,
  toCssAngle,
  toCssLength,
} from "@/utils/notch";

export { NotchContainer } from "./NotchContainer";

export type {
  ConcentricNotchConfig,
  NotchContainerProps,
  NotchCornerPlacement,
  NotchOwnProps,
  NotchPlacement,
  NotchVariant,
} from "./types";
