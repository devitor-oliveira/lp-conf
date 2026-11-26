import { type RefObject, useLayoutEffect, useRef } from "react";
import {
  generateMultiNotchedCardClipPath,
  type NotchedCardCornerSpec,
  type NotchedCardPlacement,
} from "@/utils/notch";

export interface NotchedCornerConfig {
  /** Canto entalhado do elemento recortado */
  readonly placement: NotchedCardPlacement;
  /** Wrapper do componente que ocupa o entalhe (conteúdo + colarinho); suas dimensões definem o recorte */
  readonly notchRef: RefObject<HTMLElement | null>;
  /** Raio interno do elemento (metade da altura ou border-radius real) */
  readonly innerRadius: number;
  /** Folga entre o elemento e a borda recortada */
  readonly paddingOuter: number;
}

export type UseNotchedClipPathOptions =
  | NotchedCornerConfig
  | {
      readonly notches: readonly NotchedCornerConfig[];
    };

/**
 * Aplica um `clip-path` real (canal alpha) ao elemento alvo, suportando um ou múltiplos
 * entalhes concêntricos (`raio = innerRadius + paddingOuter`, `filete = innerRadius`)
 * sincronizados via `ResizeObserver` sem recriar observadores a cada renderização.
 */
export function useNotchedClipPath(
  targetRef: RefObject<HTMLElement | null>,
  options: UseNotchedClipPathOptions,
): void {
  const configs = "notches" in options ? options.notches : [options];
  const configsRef = useRef<readonly NotchedCornerConfig[]>(configs);
  configsRef.current = configs;

  const configKey = configs
    .map((cfg) => `${cfg.placement}:${cfg.innerRadius}:${cfg.paddingOuter}`)
    .join("|");

  useLayoutEffect(() => {
    const target = targetRef.current;
    const activeConfigs = configsRef.current;
    if (!target || !configKey || activeConfigs.length === 0) return;

    const observedNotches = activeConfigs
      .map((cfg) => cfg.notchRef.current)
      .filter((el): el is HTMLElement => el !== null);

    if (observedNotches.length !== activeConfigs.length) return;

    const applyClipPath = () => {
      const cornerRadius = Number.parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      const notchSpecs: NotchedCardCornerSpec[] = [];

      for (const cfg of configsRef.current) {
        const notchEl = cfg.notchRef.current;
        if (!notchEl) continue;

        notchSpecs.push({
          placement: cfg.placement,
          notchWidth: notchEl.offsetWidth,
          notchHeight: notchEl.offsetHeight,
          notchRadius: cfg.innerRadius + cfg.paddingOuter,
          notchFillet: cfg.innerRadius,
        });
      }

      const clipPath = generateMultiNotchedCardClipPath({
        width: target.offsetWidth,
        height: target.offsetHeight,
        cornerRadius,
        notches: notchSpecs,
      });

      target.style.clipPath = clipPath ?? "";
    };

    applyClipPath();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(applyClipPath);
    observer.observe(target);
    for (const notchEl of observedNotches) {
      observer.observe(notchEl);
    }

    return () => {
      observer.disconnect();
      target.style.clipPath = "";
    };
  }, [targetRef, configKey]);
}
