export type PillSide = "left" | "right";

export interface RadialPillGeometry {
  readonly anchorX: number;
  readonly anchorY: number;
  readonly attachX: number;
  readonly attachY: number;
  readonly side: PillSide;
  readonly curveDirection: 1 | -1;
}

export interface ComputeRadialPillParams {
  readonly stageWidth: number;
  readonly stageHeight: number;
  readonly cutoutScale: number;
  readonly anchor: { readonly x: number; readonly y: number };
  readonly angleDeg: number;
  readonly radiusMultiplier?: number;
}

export interface CurvedConnectorParams {
  readonly anchorX: number;
  readonly anchorY: number;
  readonly targetX: number;
  readonly targetY: number;
  readonly side: PillSide;
  readonly curveDirection: 1 | -1;
}

/**
 * Calcula o ponto de ancoragem sobre o doce e a coordenada radial de conexão da pill
 * garantindo afastamento (clearance) proporcional ao raio e escala do produto cutout.
 */
export function computeRadialPillGeometry({
  stageWidth,
  stageHeight,
  cutoutScale,
  anchor,
  angleDeg,
  radiusMultiplier = 1,
}: ComputeRadialPillParams): RadialPillGeometry {
  const cx = stageWidth / 2;
  const cy = stageHeight / 2;

  const anchorX = anchor.x * stageWidth;
  const anchorY = anchor.y * stageHeight;

  const scaleBias = 1 + Math.max(0, cutoutScale - 1) * 0.1;
  const rx = stageWidth * 0.38 * scaleBias;
  const ry = stageHeight * 0.48 * scaleBias;
  const clearance = Math.max(30, Math.min(stageWidth * 0.1, 52));

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const attachX = cx + cos * (rx + clearance) * radiusMultiplier;
  const rawAttachY = cy + sin * (ry + clearance * 0.85) * radiusMultiplier;
  const attachY = Math.max(-stageHeight * 0.12, Math.min(stageHeight * 1.12, rawAttachY));

  const side: PillSide = cos >= 0 ? "right" : "left";
  const curveDirection: 1 | -1 = sin <= 0 ? -1 : 1;

  return {
    anchorX,
    anchorY,
    attachX,
    attachY,
    side,
    curveDirection,
  };
}

/**
 * Gera o path SVG em curva Bézier cúbica conectando o ponto de ancoragem no doce
 * à borda interna da pill flutuante com tangência horizontal suave.
 */
export function buildCurvedConnectorPath({
  anchorX,
  anchorY,
  targetX,
  targetY,
  side,
  curveDirection,
}: CurvedConnectorParams): string {
  const endX = side === "right" ? targetX + 2 : targetX - 2;
  const dx = endX - anchorX;
  const dy = targetY - anchorY;
  const dist = Math.hypot(dx, dy);

  const isNearlyHorizontal = Math.abs(dy) < Math.abs(dx) * 0.3;
  const approachOffset = Math.max(34, Math.abs(dx) * 0.48);
  const c2x = side === "right" ? endX - approachOffset : endX + approachOffset;

  if (isNearlyHorizontal) {
    const arcDepth = Math.max(26, Math.min(44, dist * 0.28)) * curveDirection;
    const c1x = anchorX + dx * 0.32;
    const c1y = anchorY + arcDepth;
    const c2y = targetY + arcDepth * 0.35;

    return `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${endX.toFixed(1)} ${targetY.toFixed(1)}`;
  }

  const overshoot = Math.max(12, Math.min(26, dist * 0.14)) * curveDirection;
  const c1x = anchorX + dx * 0.2;
  const c1y = targetY + overshoot;
  const c2y = targetY;

  return `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${endX.toFixed(1)} ${targetY.toFixed(1)}`;
}
