export const MIN_BIARC_ANGLE_DEG = 15;
export const MAX_BIARC_ANGLE_DEG = 85;
export const DEFAULT_BIARC_ANGLE_DEG = 38;

export interface BiArcParams {
  /** Queda vertical líquida da curva em pixels (ex.: 44) */
  height: number;
  /** Ângulo máximo de inclinação no ponto de inflexão em graus (padrão: 38) */
  angleDeg?: number | string;
  /** Raio convexo inferior desejado em pixels (opcional; ajustado se exceder o limite geométrico) */
  radiusBottom?: number;
  /** Raio mínimo reservado para o arco superior côncavo (padrão: 18) */
  minRadiusTop?: number;
}

export interface SolvedBiArc {
  height: number;
  angleDeg: number;
  angleRad: number;
  radiusTop: number;
  radiusBottom: number;
  transitionWidth: number;
  inflectionX: number;
  inflectionY: number;
}

export interface BiArcWingSvgParams extends BiArcParams {
  side: "left" | "right";
  /** Offset vertical da margem de topo antes do início da curva (padrão: 0) */
  offsetY?: number;
  /** Sobreposição interna horizontal em pixels para evitar frestas sub-pixel (padrão: 1) */
  overlapPx?: number;
}

export interface TopCenterBiArcSvgParams extends BiArcParams {
  /** Largura plana central entre as duas asas em pixels */
  contentWidth: number;
  /** Offset vertical antes do início da curva (padrão: 0) */
  offsetY?: number;
}

export interface ConcentricCollarSvgParams extends BiArcParams {
  /** Meia-largura do trecho plano central da aba superior em pixels */
  flatHalfWidth: number;
  /** Espessura constante do canal paralelo entre a aba e a imagem em pixels (padrão: 12) */
  gap?: number;
  /** Raio convexo de saída na lateral esquerda da imagem em pixels (padrão: 34) */
  exitRadius?: number;
}

export interface GeneratedSvgGeometry {
  svgWidth: number;
  svgHeight: number;
  transitionWidth: number;
  d: string;
}

function fmt(value: number): string {
  return Number(value.toFixed(3)).toString();
}

export function clampAngleDeg(deg: number): number {
  return Math.min(MAX_BIARC_ANGLE_DEG, Math.max(MIN_BIARC_ANGLE_DEG, deg));
}

export function parseAngleDeg(
  angle: number | string | undefined,
  fallback: number = DEFAULT_BIARC_ANGLE_DEG,
): number {
  if (typeof angle === "number" && Number.isFinite(angle)) {
    return clampAngleDeg(angle);
  }
  if (typeof angle === "string") {
    const parsed = Number.parseFloat(angle.trim());
    if (Number.isFinite(parsed)) {
      return clampAngleDeg(parsed);
    }
  }
  return clampAngleDeg(fallback);
}

export function toCssAngle(angle: number | string): string {
  return typeof angle === "number" ? `${angle}deg` : angle;
}

/**
 * Resolve analiticamente o par de arcos circulares tangentes (G1) para um dado ângulo raso θ:
 * H = (R_top + R_bottom) * (1 - cos θ)
 * W_trans = (R_top + R_bottom) * sin θ = H * cot(θ / 2)
 */
export function solveBiArc({
  height,
  angleDeg,
  radiusBottom,
  minRadiusTop = 18,
}: BiArcParams): SolvedBiArc {
  const safeHeight = Math.max(1, height);
  const deg = parseAngleDeg(angleDeg);
  const rad = (deg * Math.PI) / 180;
  const oneMinusCos = 1 - Math.cos(rad);
  const sinTheta = Math.sin(rad);

  const radiusSum = safeHeight / oneMinusCos;
  const effectiveMinTop = Math.min(minRadiusTop, radiusSum * 0.45);

  const rBottom =
    radiusBottom !== undefined && Number.isFinite(radiusBottom) && radiusBottom > 0
      ? Math.min(radiusBottom, Math.max(4, radiusSum - effectiveMinTop))
      : radiusSum * 0.44;

  const rTop = Math.max(4, radiusSum - rBottom);
  const transitionWidth = (rTop + rBottom) * sinTheta;
  const inflectionX = rTop * sinTheta;
  const inflectionY = rTop * oneMinusCos;

  return {
    height: safeHeight,
    angleDeg: deg,
    angleRad: rad,
    radiusTop: rTop,
    radiusBottom: rBottom,
    transitionWidth,
    inflectionX,
    inflectionY,
  };
}

/**
 * Gera a asa lateral esquerda ou direita em SVG para acoplamento a qualquer container central de largura dinâmica.
 */
export function generateBiArcWingSvgPath({
  side,
  height,
  angleDeg,
  radiusBottom,
  minRadiusTop,
  offsetY = 0,
  overlapPx = 1,
}: BiArcWingSvgParams): GeneratedSvgGeometry {
  const biArc = solveBiArc({ height, angleDeg, radiusBottom, minRadiusTop });
  const safeOffsetY = Math.max(0, offsetY);
  const safeOverlap = Math.max(0, overlapPx);

  const svgWidth = biArc.transitionWidth + safeOverlap;
  const svgHeight = safeOffsetY + biArc.height;
  const sinTheta = Math.sin(biArc.angleRad);

  if (side === "left") {
    const d = [
      `M 0 ${fmt(safeOffsetY)}`,
      `A ${fmt(biArc.radiusTop)} ${fmt(biArc.radiusTop)} 0 0 1 ${fmt(biArc.inflectionX)} ${fmt(safeOffsetY + biArc.inflectionY)}`,
      `A ${fmt(biArc.radiusBottom)} ${fmt(biArc.radiusBottom)} 0 0 0 ${fmt(biArc.transitionWidth)} ${fmt(svgHeight)}`,
      `L ${fmt(svgWidth)} ${fmt(svgHeight)}`,
      `L ${fmt(svgWidth)} 0`,
      "L 0 0",
      "Z",
    ].join(" ");

    return {
      svgWidth,
      svgHeight,
      transitionWidth: biArc.transitionWidth,
      d,
    };
  }

  const rightInflectionX = safeOverlap + biArc.radiusBottom * sinTheta;
  const rightInflectionY = safeOffsetY + biArc.inflectionY;

  const d = [
    `M 0 ${fmt(svgHeight)}`,
    `L ${fmt(safeOverlap)} ${fmt(svgHeight)}`,
    `A ${fmt(biArc.radiusBottom)} ${fmt(biArc.radiusBottom)} 0 0 0 ${fmt(rightInflectionX)} ${fmt(rightInflectionY)}`,
    `A ${fmt(biArc.radiusTop)} ${fmt(biArc.radiusTop)} 0 0 1 ${fmt(svgWidth)} ${fmt(safeOffsetY)}`,
    `L ${fmt(svgWidth)} 0`,
    "L 0 0",
    "Z",
  ].join(" ");

  return {
    svgWidth,
    svgHeight,
    transitionWidth: biArc.transitionWidth,
    d,
  };
}

/**
 * Gera um path SVG único e contínuo para um entalhe "top-center" completo quando a largura central é conhecida.
 */
export function generateTopCenterBiArcSvgPath({
  height,
  contentWidth,
  angleDeg,
  radiusBottom,
  minRadiusTop,
  offsetY = 0,
}: TopCenterBiArcSvgParams): GeneratedSvgGeometry {
  const biArc = solveBiArc({ height, angleDeg, radiusBottom, minRadiusTop });
  const safeContentWidth = Math.max(0, contentWidth);
  const safeOffsetY = Math.max(0, offsetY);

  const wTrans = biArc.transitionWidth;
  const svgWidth = safeContentWidth + wTrans * 2;
  const svgHeight = safeOffsetY + biArc.height;
  const sinTheta = Math.sin(biArc.angleRad);

  const rightBottomStart = wTrans + safeContentWidth;
  const rightInflectionX = rightBottomStart + biArc.radiusBottom * sinTheta;
  const inflectionY = safeOffsetY + biArc.inflectionY;

  const d = [
    `M 0 ${fmt(safeOffsetY)}`,
    `A ${fmt(biArc.radiusTop)} ${fmt(biArc.radiusTop)} 0 0 1 ${fmt(biArc.inflectionX)} ${fmt(inflectionY)}`,
    `A ${fmt(biArc.radiusBottom)} ${fmt(biArc.radiusBottom)} 0 0 0 ${fmt(wTrans)} ${fmt(svgHeight)}`,
    `L ${fmt(rightBottomStart)} ${fmt(svgHeight)}`,
    `A ${fmt(biArc.radiusBottom)} ${fmt(biArc.radiusBottom)} 0 0 0 ${fmt(rightInflectionX)} ${fmt(inflectionY)}`,
    `A ${fmt(biArc.radiusTop)} ${fmt(biArc.radiusTop)} 0 0 1 ${fmt(svgWidth)} ${fmt(safeOffsetY)}`,
    ...(safeOffsetY > 0 ? [`L ${fmt(svgWidth)} 0`, "L 0 0"] : []),
    "Z",
  ].join(" ");

  return {
    svgWidth,
    svgHeight,
    transitionWidth: wTrans,
    d,
  };
}

/**
 * Gera o colar concêntrico exato (curva paralela a distância G) para esculpir o canto superior esquerdo da imagem.
 * Pelo teorema de offset de círculos: R_top_collar = R_top - G e R_bottom_collar = R_bottom + G.
 */
export function generateConcentricCollarSvgPath({
  height,
  flatHalfWidth,
  angleDeg,
  radiusBottom,
  gap = 12,
  exitRadius = 34,
}: ConcentricCollarSvgParams): GeneratedSvgGeometry {
  const safeGap = Math.max(0, gap);
  const biArc = solveBiArc({
    height,
    angleDeg,
    radiusBottom,
    minRadiusTop: safeGap + 10,
  });

  const sinTheta = Math.sin(biArc.angleRad);
  const cosTheta = Math.cos(biArc.angleRad);

  const rTopCollar = biArc.radiusTop - safeGap;
  const rBottomCollar = biArc.radiusBottom + safeGap;

  const xA = Math.max(safeGap, flatHalfWidth);
  const xB = xA + biArc.transitionWidth;

  const xInfCollar = xA + rBottomCollar * sinTheta;
  const yInfCollar = biArc.height - biArc.radiusBottom + rBottomCollar * cosTheta;

  const yCollarBottom = biArc.height + safeGap;
  const safeExitRadius = Math.min(Math.max(0, exitRadius), Math.max(0, xA - safeGap));

  const svgWidth = Math.ceil(xB) + 2;
  const svgHeight = Math.ceil(yCollarBottom + safeExitRadius) + 2;

  const commands = [
    "M 0 0",
    `L ${fmt(svgWidth)} 0`,
    `L ${fmt(svgWidth)} ${fmt(safeGap)}`,
    `L ${fmt(xB)} ${fmt(safeGap)}`,
    `A ${fmt(rTopCollar)} ${fmt(rTopCollar)} 0 0 0 ${fmt(xInfCollar)} ${fmt(yInfCollar)}`,
    `A ${fmt(rBottomCollar)} ${fmt(rBottomCollar)} 0 0 1 ${fmt(xA)} ${fmt(yCollarBottom)}`,
    `L ${fmt(safeGap + safeExitRadius)} ${fmt(yCollarBottom)}`,
  ];

  if (safeExitRadius > 0) {
    commands.push(
      `A ${fmt(safeExitRadius)} ${fmt(safeExitRadius)} 0 0 0 ${fmt(safeGap)} ${fmt(yCollarBottom + safeExitRadius)}`,
    );
  }

  commands.push(`L 0 ${fmt(yCollarBottom + safeExitRadius)}`, "Z");

  return {
    svgWidth,
    svgHeight,
    transitionWidth: biArc.transitionWidth,
    d: commands.join(" "),
  };
}
