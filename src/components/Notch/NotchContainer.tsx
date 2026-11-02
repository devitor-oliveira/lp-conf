import type { CSSProperties, ElementType } from "react";
import styles from "./NotchContainer.module.scss";
import type { ConcentricNotchConfig, NotchContainerProps, NotchCornerPlacement } from "./types";

const PLACEMENT_CLASS_MAP: Record<NotchCornerPlacement, string | undefined> = {
  "top-left": styles.topLeft,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-right": styles.bottomRight,
};

export function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function calculateConcentricNotch(
  config: ConcentricNotchConfig,
  offset: number | string = 0,
): { radius: string; filletSize: string } {
  if (
    typeof config.innerRadius === "number" &&
    typeof config.paddingOuter === "number" &&
    (config.paddingInner === undefined || typeof config.paddingInner === "number") &&
    typeof offset === "number"
  ) {
    const padInner = config.paddingInner ?? config.paddingOuter;
    return {
      radius: `${config.innerRadius + config.paddingOuter}px`,
      filletSize: `${Math.max(0, padInner + config.innerRadius - offset)}px`,
    };
  }

  const inner = toCssLength(config.innerRadius);
  const padOuter = toCssLength(config.paddingOuter);
  const padInner = toCssLength(config.paddingInner ?? config.paddingOuter);
  const off = toCssLength(offset);

  return {
    radius: `calc(${inner} + ${padOuter})`,
    filletSize: `max(0px, calc(${padInner} + ${inner} - ${off}))`,
  };
}

type NotchCustomCssVars = CSSProperties & {
  "--notch-radius"?: string;
  "--notch-fillet"?: string;
  "--notch-offset-x"?: string;
  "--notch-offset-y"?: string;
  "--notch-bg"?: string;
  "--notch-shadow"?: string;
};

export function NotchContainer<T extends ElementType = "div">({
  as,
  placement,
  radius,
  filletSize,
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

  const concentricValues = concentric
    ? calculateConcentricNotch(concentric, offsetX ?? offsetY ?? 0)
    : undefined;

  const resolvedRadius = radius !== undefined ? toCssLength(radius) : concentricValues?.radius;
  const resolvedFillet =
    filletSize !== undefined ? toCssLength(filletSize) : concentricValues?.filletSize;

  const inlineVars: NotchCustomCssVars = {};

  if (resolvedRadius !== undefined) {
    inlineVars["--notch-radius"] = resolvedRadius;
  }
  if (resolvedFillet !== undefined) {
    inlineVars["--notch-fillet"] = resolvedFillet;
  }
  if (offsetX !== undefined) {
    inlineVars["--notch-offset-x"] = toCssLength(offsetX);
  }
  if (offsetY !== undefined) {
    inlineVars["--notch-offset-y"] = toCssLength(offsetY);
  }
  if (color !== undefined) {
    inlineVars["--notch-bg"] = color;
  }
  if (dropShadow !== undefined) {
    inlineVars["--notch-shadow"] = `drop-shadow(${dropShadow})`;
  }

  const mergedStyle: CSSProperties = {
    ...inlineVars,
    ...style,
  };

  const placementClass = PLACEMENT_CLASS_MAP[placement] ?? "";
  const composedClassName = [styles.notch, placementClass, className].filter(Boolean).join(" ");

  return (
    <Component className={composedClassName} style={mergedStyle} {...restProps}>
      {children}
    </Component>
  );
}
