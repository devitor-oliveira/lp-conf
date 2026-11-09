export {
  type BiArcParams,
  type BiArcWingSvgParams,
  type ConcentricCollarSvgParams,
  clampAngleDeg,
  DEFAULT_BIARC_ANGLE_DEG,
  type GeneratedSvgGeometry,
  generateBiArcWingSvgPath,
  generateConcentricCollarSvgPath,
  generateTopCenterBiArcSvgPath,
  MAX_BIARC_ANGLE_DEG,
  MIN_BIARC_ANGLE_DEG,
  parseAngleDeg,
  type SolvedBiArc,
  solveBiArc,
  type TopCenterBiArcSvgParams,
  toCssAngle,
} from "./biarc";

export { NotchContainer } from "./NotchContainer";

export {
  buildNotchCssVars,
  calculateConcentricNotch,
  calculateConcentricSmoothHeight,
  compactCssVars,
  type NotchCssParams,
  parseNumericPx,
  sanitizeColor,
  sanitizeDropShadow,
  toCssLength,
} from "./notchUtils";

export type {
  ConcentricNotchConfig,
  NotchContainerProps,
  NotchCornerPlacement,
  NotchOwnProps,
  NotchPlacement,
  NotchVariant,
} from "./types";

export { type UseNotchOptions, useNotch } from "./useNotch";
