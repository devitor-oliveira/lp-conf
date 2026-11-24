export type NotchedCardPlacement = "top-right" | "bottom-right";

export interface NotchedCardClipPathParams {
  width: number;
  height: number;
  placement: NotchedCardPlacement;
  cornerRadius: number;
  notchWidth: number;
  notchHeight: number;
  notchRadius: number;
  notchFillet: number;
}

function fmt(value: number): string {
  return Number(value.toFixed(3)).toString();
}

/**
 * Gera uma função CSS `path("...")` com o contorno real de uma caixa retangular
 * com 3 cantos arredondados padrão e 1 canto entalhado concêntrico ("top-right" ou "bottom-right").
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
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined;
  }

  const W = width;
  const H = height;
  const cr = Math.min(Math.max(0, cornerRadius), W / 2, H / 2);
  const nw = Math.min(Math.max(0, notchWidth), Math.max(0, W - cr));
  const nh = Math.min(Math.max(0, notchHeight), Math.max(0, H - cr));
  const nr = Math.min(Math.max(0, notchRadius), nw, nh);
  const nf = Math.min(
    Math.max(0, notchFillet),
    Math.max(0, nh - nr),
    Math.max(0, nw - nr),
    Math.max(0, W - nw - cr),
    Math.max(0, H - nh - cr),
  );

  const commands: string[] = [`M 0 ${fmt(cr)}`];
  if (cr > 0) {
    commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(cr)} 0`);
  }

  if (placement === "top-right") {
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

    commands.push(`L ${fmt(W)} ${fmt(H - cr)}`);
    if (cr > 0) {
      commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(W - cr)} ${fmt(H)}`);
    }
  } else {
    commands.push(`L ${fmt(W - cr)} 0`);
    if (cr > 0) {
      commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 ${fmt(W)} ${fmt(cr)}`);
    }

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
  }

  commands.push(`L ${fmt(cr)} ${fmt(H)}`);
  if (cr > 0) {
    commands.push(`A ${fmt(cr)} ${fmt(cr)} 0 0 1 0 ${fmt(H - cr)}`);
  }
  commands.push("Z");

  return `path("${commands.join(" ")}")`;
}
