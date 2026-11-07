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
  /** Distância horizontal do centro (50%) até a borda esquerda da moldura da imagem (padrão: igual ao gap) */
  imageStartOffset?: number;
  /** Raio convexo de saída na lateral esquerda da imagem em pixels (padrão: 32) */
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
 * Gera o colar concêntrico exato (curva paralela a distância G) para esculpir o canto superior esquerdo da imagem,
 * calculando analiticamente a tangência G1 do arco convexo de saída com a borda esquerda real da foto (imageStartOffset)
 * para eliminar qualquer quina reta de 90° em divisões assimétricas (ex.: 55% / 45%).
 */
export function generateConcentricCollarSvgPath({
  height,
  flatHalfWidth,
  angleDeg,
  radiusBottom,
  gap = 12,
  imageStartOffset,
  exitRadius = 32,
}: ConcentricCollarSvgParams): GeneratedSvgGeometry {
  const safeGap = Math.max(0, gap);
  const biArc = solveBiArc({
    height,
    angleDeg,
    radiusBottom,
    minRadiusTop: safeGap + 14,
  });

  const sinTheta = Math.sin(biArc.angleRad);
  const cosTheta = Math.cos(biArc.angleRad);

  const rTopCollar = biArc.radiusTop - safeGap;
  const rBottomCollar = biArc.radiusBottom + safeGap;

  const xA = Math.max(safeGap, flatHalfWidth);
  const xB = xA + biArc.transitionWidth;

  const xInfCollar = xA + rBottomCollar * sinTheta;
  const yC2 = biArc.height - biArc.radiusBottom;
  const yInfCollar = yC2 + rBottomCollar * cosTheta;
  const yCollarBottom = biArc.height + safeGap;

  const xLeft = Math.max(0, imageStartOffset ?? safeGap);
  const xCoverLeft = Math.max(0, xLeft - 2);
  const maxAllowedExit = Math.max(4, rTopCollar - 4);
  const rExit = Math.min(Math.max(0, exitRadius), maxAllowedExit);
  const xc = xLeft + rExit;

  if (xc >= xB || rExit <= 0) {
    return {
      svgWidth: 0,
      svgHeight: 0,
      transitionWidth: biArc.transitionWidth,
      d: "",
    };
  }

  const svgWidth = Math.ceil(xB) + 2;

  // Regime 1: A concordância de saída ocorre no trecho horizontal plano (xc <= xA)
  if (xc <= xA) {
    const yc = yCollarBottom + rExit;
    const svgHeight = Math.ceil(yc) + 2;

    const commands = [
      `M ${fmt(xCoverLeft)} 0`,
      `L ${fmt(svgWidth)} 0`,
      `L ${fmt(svgWidth)} ${fmt(safeGap)}`,
      `L ${fmt(xB)} ${fmt(safeGap)}`,
      `A ${fmt(rTopCollar)} ${fmt(rTopCollar)} 0 0 0 ${fmt(xInfCollar)} ${fmt(yInfCollar)}`,
      `A ${fmt(rBottomCollar)} ${fmt(rBottomCollar)} 0 0 1 ${fmt(xA)} ${fmt(yCollarBottom)}`,
      `L ${fmt(xc)} ${fmt(yCollarBottom)}`,
      `A ${fmt(rExit)} ${fmt(rExit)} 0 0 0 ${fmt(xLeft)} ${fmt(yc)}`,
      `L ${fmt(xCoverLeft)} ${fmt(yc)}`,
      "Z",
    ];

    return {
      svgWidth,
      svgHeight,
      transitionWidth: biArc.transitionWidth,
      d: commands.join(" "),
    };
  }

  // Regime 2: Tangência externa G1 direta entre o arco inferior C2 e o fillet convexo da borda da imagem
  const dx2 = xc - xA;
  const rSum2 = rBottomCollar + rExit;
  if (dx2 < rSum2) {
    const xTan2 = xA + (rBottomCollar / rSum2) * dx2;
    if (xTan2 <= xInfCollar + 0.001) {
      const dy2 = Math.sqrt(Math.max(0, rSum2 * rSum2 - dx2 * dx2));
      const yc = yC2 + dy2;
      const yTan2 = yC2 + (rBottomCollar / rSum2) * dy2;
      const svgHeight = Math.ceil(yc) + 2;

      const commands = [
        `M ${fmt(xCoverLeft)} 0`,
        `L ${fmt(svgWidth)} 0`,
        `L ${fmt(svgWidth)} ${fmt(safeGap)}`,
        `L ${fmt(xB)} ${fmt(safeGap)}`,
        `A ${fmt(rTopCollar)} ${fmt(rTopCollar)} 0 0 0 ${fmt(xInfCollar)} ${fmt(yInfCollar)}`,
        `A ${fmt(rBottomCollar)} ${fmt(rBottomCollar)} 0 0 1 ${fmt(xTan2)} ${fmt(yTan2)}`,
        `A ${fmt(rExit)} ${fmt(rExit)} 0 0 0 ${fmt(xLeft)} ${fmt(yc)}`,
        `L ${fmt(xCoverLeft)} ${fmt(yc)}`,
        "Z",
      ];

      return {
        svgWidth,
        svgHeight,
        transitionWidth: biArc.transitionWidth,
        d: commands.join(" "),
      };
    }
  }

  // Regime 3: Tangência interna G1 direta entre o arco superior C1 e o fillet convexo da borda da imagem
  const dx1 = xB - xc;
  const rDiff1 = rTopCollar - rExit;
  if (dx1 >= 0 && dx1 < rDiff1) {
    const dy1 = Math.sqrt(Math.max(0, rDiff1 * rDiff1 - dx1 * dx1));
    const yc = biArc.radiusTop - dy1;
    const xTan1 = xB - (rTopCollar / rDiff1) * dx1;
    const yTan1 = biArc.radiusTop - (rTopCollar / rDiff1) * dy1;
    const svgHeight = Math.ceil(yc) + 2;

    const commands = [
      `M ${fmt(xCoverLeft)} 0`,
      `L ${fmt(svgWidth)} 0`,
      `L ${fmt(svgWidth)} ${fmt(safeGap)}`,
      `L ${fmt(xB)} ${fmt(safeGap)}`,
      `A ${fmt(rTopCollar)} ${fmt(rTopCollar)} 0 0 0 ${fmt(xTan1)} ${fmt(yTan1)}`,
      `A ${fmt(rExit)} ${fmt(rExit)} 0 0 0 ${fmt(xLeft)} ${fmt(yc)}`,
      `L ${fmt(xCoverLeft)} ${fmt(yc)}`,
      "Z",
    ];

    return {
      svgWidth,
      svgHeight,
      transitionWidth: biArc.transitionWidth,
      d: commands.join(" "),
    };
  }

  return {
    svgWidth: 0,
    svgHeight: 0,
    transitionWidth: biArc.transitionWidth,
    d: "",
  };
}
