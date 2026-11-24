import { type ConcentricNotchConfig, NotchContainer } from "@/components/Notch";
import type { ThemeMode } from "@/hooks/useTheme";
import { ThemeSwitchPill } from "./ThemeSwitchPill";
import styles from "./ThemeToggle.module.scss";

export interface ThemeToggleProps {
  /** Classe CSS adicional opcional para o container entalhado */
  className?: string;
  /** Raio externo explícito (usado quando em modo manual, ex.: Sandbox) */
  radius?: number | string;
  /** Tamanho do filete côncavo explícito (usado quando em modo manual) */
  filletSize?: number | string;
  /** Configuração concêntrica customizada opcional */
  concentric?: ConcentricNotchConfig;
  /** Margem/offset horizontal em relação à seção adjacente (padrão: --layout-stage-margin) */
  offsetX?: number | string;
  /** Margem/offset vertical em relação à seção adjacente (padrão: --layout-stage-margin) */
  offsetY?: number | string;
  /** Sombra opcional compatível com contornos côncavos */
  dropShadow?: string;
  /** Callback opcional disparado ao alternar o tema */
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeToggle({
  className,
  radius,
  filletSize,
  concentric,
  offsetX = "var(--layout-stage-margin)",
  offsetY = "var(--layout-stage-margin)",
  dropShadow,
  onThemeChange,
}: ThemeToggleProps) {
  const resolvedConcentric: ConcentricNotchConfig | undefined =
    radius !== undefined || filletSize !== undefined
      ? concentric
      : (concentric ?? {
          innerRadius: "var(--toggle-inner-radius, 24px)",
          paddingOuter: "var(--toggle-pad-outer, 12px)",
          paddingInner: offsetX,
        });

  const composedClassName = [styles.toggleContainer, className].filter(Boolean).join(" ");

  return (
    <NotchContainer
      as="div"
      placement="top-right"
      className={composedClassName}
      radius={radius}
      filletSize={filletSize}
      concentric={resolvedConcentric}
      offsetX={offsetX}
      offsetY={offsetY}
      dropShadow={dropShadow}
    >
      <ThemeSwitchPill onThemeChange={onThemeChange} />
    </NotchContainer>
  );
}

export default ThemeToggle;
