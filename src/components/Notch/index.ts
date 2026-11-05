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
export { calculateConcentricNotch, NotchContainer, toCssLength } from "./NotchContainer";
export type {
  ConcentricNotchConfig,
  NotchContainerProps,
  NotchCornerPlacement,
  NotchOwnProps,
  NotchPlacement,
  NotchVariant,
} from "./types";
