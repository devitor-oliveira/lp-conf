import type { ElementType } from "react";
import styles from "./NotchContainer.module.scss";
import type { NotchContainerProps, NotchPlacement } from "./types";
import { useNotch } from "./useNotch";

const PLACEMENT_CLASS_MAP: Record<NotchPlacement, string | undefined> = {
  "top-left": styles.topLeft,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-right": styles.bottomRight,
  "top-center": styles.topCenter,
};

export function NotchContainer<T extends ElementType = "div">({
  as,
  placement,
  variant = "classic",
  radius,
  filletSize,
  angle,
  smoothHeight = 44,
  concentric,
  offsetX,
  offsetY,
  color,
  dropShadow,
  className,
  style,
  children,
  ...restProps
}: NotchContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;

  const { isSmoothTopCenter, wings, mergedStyle } = useNotch({
    placement,
    variant,
    radius,
    filletSize,
    angle,
    smoothHeight,
    concentric,
    offsetX,
    offsetY,
    color,
    dropShadow,
    style,
  });

  const placementClass = isSmoothTopCenter
    ? styles.smoothTopCenter
    : (PLACEMENT_CLASS_MAP[placement] ?? "");

  const composedClassName = [styles.notch, placementClass, className].filter(Boolean).join(" ");

  return (
    <Component className={composedClassName} style={mergedStyle} {...restProps}>
      {isSmoothTopCenter && wings && (
        <>
          <svg
            className={styles.smoothWingLeft}
            width={wings.left.svgWidth}
            height={wings.left.svgHeight}
            viewBox={`0 0 ${wings.left.svgWidth} ${wings.left.svgHeight}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className={styles.smoothWingPath} d={wings.left.d} />
          </svg>
          <svg
            className={styles.smoothWingRight}
            width={wings.right.svgWidth}
            height={wings.right.svgHeight}
            viewBox={`0 0 ${wings.right.svgWidth} ${wings.right.svgHeight}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className={styles.smoothWingPath} d={wings.right.d} />
          </svg>
        </>
      )}
      {children}
    </Component>
  );
}

// Re-exportações canônicas para manter retrocompatibilidade com importações diretas
export { calculateConcentricNotch, toCssLength } from "./notchUtils";
