import { type RefObject, useLayoutEffect } from "react";
import { generateNotchedCardClipPath, type NotchedCardPlacement } from "@/utils/notch";

export interface UseNotchedClipPathOptions {
  /** Canto entalhado do elemento recortado */
  placement: NotchedCardPlacement;
  /** Wrapper do botão que ocupa o entalhe (botão + folga); suas dimensões definem o recorte */
  notchRef: RefObject<HTMLElement | null>;
  /** Raio interno do botão (metade da altura) */
  innerRadius: number;
  /** Folga entre o botão e a borda recortada */
  paddingOuter: number;
}

/**
 * Aplica um clip-path real (canal alpha) ao elemento alvo, seguindo o entalhe concêntrico
 * (raio = innerRadius + paddingOuter; filete = innerRadius) e sincronizado via ResizeObserver
 * com o tamanho do wrapper do botão, inclusive durante transições CSS de largura.
 */
export function useNotchedClipPath(
  targetRef: RefObject<HTMLElement | null>,
  { placement, notchRef, innerRadius, paddingOuter }: UseNotchedClipPathOptions,
): void {
  useLayoutEffect(() => {
    const target = targetRef.current;
    const notch = notchRef.current;
    if (!target || !notch) return;

    const applyClipPath = () => {
      const cornerRadius = Number.parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      const clipPath = generateNotchedCardClipPath({
        width: target.offsetWidth,
        height: target.offsetHeight,
        placement,
        cornerRadius,
        notchWidth: notch.offsetWidth,
        notchHeight: notch.offsetHeight,
        notchRadius: innerRadius + paddingOuter,
        notchFillet: innerRadius,
      });
      target.style.clipPath = clipPath ?? "";
    };

    applyClipPath();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(applyClipPath);
    observer.observe(target);
    observer.observe(notch);

    return () => {
      observer.disconnect();
      target.style.clipPath = "";
    };
  }, [targetRef, notchRef, placement, innerRadius, paddingOuter]);
}
