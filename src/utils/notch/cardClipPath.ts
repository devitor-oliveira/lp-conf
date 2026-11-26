export type NotchedCardPlacement = "top-right" | "bottom-right" | "bottom-left";

export interface NotchedCardCornerSpec {
  readonly placement: NotchedCardPlacement;
  readonly notchWidth: number;
  readonly notchHeight: number;
  readonly notchRadius: number;
  readonly notchFillet: number;
}

export interface NotchedCardClipPathParams {
  readonly width: number;
  readonly height: number;
  readonly placement: NotchedCardPlacement;
  readonly cornerRadius: number;
  readonly notchWidth: number;
  readonly notchHeight: number;
  readonly notchRadius: number;
  readonly notchFillet: number;
}

export interface NotchedCardMultiClipPathParams {
  readonly width: number;
  readonly height: number;
  readonly cornerRadius: number;
  readonly notches: readonly NotchedCardCornerSpec[];
}

interface NormalizedCornerSpec {
  readonly nw: number;
  readonly nh: number;
  readonly nr: number;
  readonly nf: number;
}

function fmt(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function normalizeCornerSpec(
  spec: NotchedCardCornerSpec,
  width: number,
  height: number,
  cornerRadius: number,
): NormalizedCornerSpec {
  const nw = Math.min(Math.max(0, spec.notchWidth), Math.max(0, width - cornerRadius));
  const nh = Math.min(Math.max(0, spec.notchHeight), Math.max(0, height - cornerRadius));
  const nr = Math.min(Math.max(0, spec.notchRadius), nw, nh);
  const nf = Math.min(
    Math.max(0, spec.notchFillet),
    Math.max(0, nh - nr),
    Math.max(0, nw - nr),
    Math.max(0, width - nw - cornerRadius),
    Math.max(0, height - nh - cornerRadius),
  );

  return { nw, nh, nr, nf };
}

/**
 * Gera uma função CSS `path("...")` com o contorno real de uma caixa retangular
 * suportando um ou múltiplos cantos entalhados concêntricos simultaneamente.
 */
export function generateMultiNotchedCardClipPath({
  width,
  height,
  cornerRadius,
  notches,
}: NotchedCardMultiClipPathParams): string | undefined {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined;
  }

  const W = width;
  const H = height;
  const cr = Math.min(Math.max(0, cornerRadius), W / 2, H / 2);

  const cornerMap = new Map<NotchedCardPlacement, NormalizedCornerSpec>();
  for (const notch of notches) {
    cornerMap.set(notch.placement, normalizeCornerSpec(notch, W, H, cr));
  }

  const topRight = cornerMap.get("top-right");
  const bottomRight = cornerMap.get("bottom-right");
  const bottomLeft = cornerMap.get("bottom-left");

  const commands: string[] = [`M 0 ${fmt(cr)}`];
  if (cr > 0) {
    commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(cr)} 0`);
  }

  if (topRight) {
    const { nw, nh, nr, nf } = topRight;
    commands.push(`L ${fmt(W - nw - nf)} 0`);
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 ${fmt(W - nw)} ${fmt(nf)}`);
    }
    if (nh - nr > nf) {
      commands.push(`L ${fmt(W - nw)} ${fmt(nh - nr)}`);
    }
    if (nr > 0) {
      commands.push(`A ${fmt(nr)} ${fmt(nr)} 0 0 0 ${fmt(W - nw + nr)} ${fmt(nh)}`);
    }
    if (nw - nr > nf) {
      commands.push(`L ${fmt(W - nf)} ${fmt(nh)}`);
    }
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 ${fmt(W)} ${fmt(nh + nf)}`);
    }
  } else {
    commands.push(`L ${fmt(W - cr)} 0`);
    if (cr > 0) {
      commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(W)} ${fmt(cr)}`);
    }
  }

  if (bottomRight) {
    const { nw, nh, nr, nf } = bottomRight;
    commands.push(`L ${fmt(W)} ${fmt(H - nh - nf)}`);
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 ${fmt(W - nf)} ${fmt(H - nh)}`);
    }
    if (nw - nr > nf) {
      commands.push(`L ${fmt(W - nw + nr)} ${fmt(H - nh)}`);
    }
    if (nr > 0) {
      commands.push(`A ${fmt(nr)} ${fmt(nr)} 0 0 0 ${fmt(W - nw)} ${fmt(H - nh + nr)}`);
    }
    if (nh - nr > nf) {
      commands.push(`L ${fmt(W - nw)} ${fmt(H - nf)}`);
    }
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 ${fmt(W - nw - nf)} ${fmt(H)}`);
    }
  } else {
    commands.push(`L ${fmt(W)} ${fmt(H - cr)}`);
    if (cr > 0) {
      commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(W - cr)} ${fmt(H)}`);
    }
  }

  if (bottomLeft) {
    const { nw, nh, nr, nf } = bottomLeft;
    commands.push(`L ${fmt(nw + nf)} ${fmt(H)}`);
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 ${fmt(nw)} ${fmt(H - nf)}`);
    }
    if (nh - nr > nf) {
      commands.push(`L ${fmt(nw)} ${fmt(H - nh + nr)}`);
    }
    if (nr > 0) {
      commands.push(`A ${fmt(nr)} ${fmt(nr)} 0 0 0 ${fmt(nw - nr)} ${fmt(H - nh)}`);
    }
    if (nw - nr > nf) {
      commands.push(`L ${fmt(nf)} ${fmt(H - nh)}`);
    }
    if (nf > 0) {
      commands.push(`A ${fmt(nf)} ${fmt(nf)} 0 0 1 0 ${fmt(H - nh - nf)}`);
    }
  } else {
    commands.push(`L ${fmt(cr)} ${fmt(H)}`);
    if (cr > 0) {
      commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 0 ${fmt(H - cr)}`);
    }
  }

  commands.push("Z");
  return `path("${commands.join(" ")}")`;
}

/**
 * Gera uma função CSS `path("...")` com o contorno real de uma caixa retangular
 * com 3 cantos arredondados padrão e 1 canto entalhado concêntrico.
 */
export function generateNotchedCardClipPath({
  width,
  height,
  placement,
  cornerRadius,
  notchWidth,
  notchHeight,
  notchRadius,
  notchFillet,
}: NotchedCardClipPathParams): string | undefined {
  return generateMultiNotchedCardClipPath({
    width,
    height,
    cornerRadius,
    notches: [
      {
        placement,
        notchWidth,
        notchHeight,
        notchRadius,
        notchFillet,
      },
    ],
  });
}
