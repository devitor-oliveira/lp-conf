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
export {
  generateMultiNotchedCardClipPath,
  generateNotchedCardClipPath,
  type NotchedCardClipPathParams,
  type NotchedCardCornerSpec,
  type NotchedCardMultiClipPathParams,
  type NotchedCardPlacement,
} from "./cardClipPath";

export {
  buildNotchCssVars,
  calculateConcentricNotch,
  calculateConcentricSmoothHeight,
  compactCssVars,
  type NotchCssParams,
  parseNumericPx,
  readRootCssLengthPx,
  sanitizeColor,
  sanitizeDropShadow,
  toCssLength,
} from "./notchUtils";
