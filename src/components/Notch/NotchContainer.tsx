import type { CSSProperties, ElementType } from "react";
import { generateBiArcWingSvgPath, toCssAngle } from "./biarc";
import styles from "./NotchContainer.module.scss";
import type { ConcentricNotchConfig, NotchContainerProps, NotchPlacement } from "./types";

const PLACEMENT_CLASS_MAP: Record<NotchPlacement, string | undefined> = {
  "top-left": styles.topLeft,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-right": styles.bottomRight,
  "top-center": styles.topCenter,
};

export function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function parseNumericPx(value: number | string | undefined, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
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
  "--notch-angle"?: string;
  "--notch-smooth-total-height"?: string;
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
  const isSmoothTopCenter = variant === "smooth" && placement === "top-center";

  const concentricValues =
    !isSmoothTopCenter && concentric
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
  if (angle !== undefined) {
    inlineVars["--notch-angle"] = toCssAngle(angle);
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

  if (isSmoothTopCenter) {
    const numericOffsetY = Math.max(0, parseNumericPx(offsetY, 0));
    const numericRadiusBottom = parseNumericPx(radius, 80);

    const leftWing = generateBiArcWingSvgPath({
      side: "left",
      height: smoothHeight,
      angleDeg: angle,
      radiusBottom: numericRadiusBottom,
      offsetY: numericOffsetY,
      overlapPx: 1,
    });

    const rightWing = generateBiArcWingSvgPath({
      side: "right",
      height: smoothHeight,
      angleDeg: angle,
      radiusBottom: numericRadiusBottom,
      offsetY: numericOffsetY,
      overlapPx: 1,
    });

    inlineVars["--notch-smooth-total-height"] = `${numericOffsetY + smoothHeight}px`;

    const mergedSmoothStyle: CSSProperties = {
      ...inlineVars,
      ...style,
    };

    const smoothClassName = [styles.notch, styles.smoothTopCenter, className]
      .filter(Boolean)
      .join(" ");

    return (
      <Component className={smoothClassName} style={mergedSmoothStyle} {...restProps}>
        <svg
          className={styles.smoothWingLeft}
          width={leftWing.svgWidth}
          height={leftWing.svgHeight}
          viewBox={`0 0 ${leftWing.svgWidth} ${leftWing.svgHeight}`}
          aria-hidden="true"
        >
          <path className={styles.smoothWingPath} d={leftWing.d} />
        </svg>
        <svg
          className={styles.smoothWingRight}
          width={rightWing.svgWidth}
          height={rightWing.svgHeight}
          viewBox={`0 0 ${rightWing.svgWidth} ${rightWing.svgHeight}`}
          aria-hidden="true"
        >
          <path className={styles.smoothWingPath} d={rightWing.d} />
        </svg>
        {children}
      </Component>
    );
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
