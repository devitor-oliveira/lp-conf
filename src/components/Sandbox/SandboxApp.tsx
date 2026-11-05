import { ArrowUpRight, Award, Moon, ShoppingBag, Sliders, Sparkles, Sun } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import {
  calculateConcentricNotch,
  DEFAULT_BIARC_ANGLE_DEG,
  NotchContainer,
  type NotchCornerPlacement,
  solveBiArc,
} from "@/components/Notch";
import styles from "./SandboxApp.module.scss";

interface SurfaceOption {
  id: string;
  label: string;
  token: string;
  swatchColor: string;
}

const SURFACE_OPTIONS: readonly SurfaceOption[] = [
  {
    id: "rubi",
    label: "Rubi Framboesa",
    token: "var(--color-surface-slide-1)",
    swatchColor: "#751A1A",
  },
  {
    id: "cacau",
    label: "Cacau Torrado",
    token: "var(--color-surface-slide-2)",
    swatchColor: "#5A3620",
  },
  {
    id: "pistache",
    label: "Pistache Real",
    token: "var(--color-surface-slide-3)",
    swatchColor: "#2E5129",
  },
];

const CORNER_LABELS: readonly { key: NotchCornerPlacement; label: string }[] = [
  { key: "top-left", label: "Top-Left (Logo/Nav)" },
  { key: "top-right", label: "Top-Right (CTA/Tema)" },
  { key: "bottom-left", label: "Bottom-Left (Selo)" },
  { key: "bottom-right", label: "Bottom-Right (Paleta)" },
];

type StageCssVars = CSSProperties & {
  "--stage-margin"?: string;
  "--slot-pad-edge"?: string;
  "--slot-pad-channel"?: string;
  "--pill-height"?: string;
  "--pill-radius"?: string;
  "--active-surface"?: string;
};

export function SandboxApp() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedSurface, setSelectedSurface] = useState<SurfaceOption>(
    SURFACE_OPTIONS[0] ?? {
      id: "rubi",
      label: "Rubi Framboesa",
      token: "var(--color-surface-slide-1)",
      swatchColor: "#751A1A",
    },
  );

  const [mode, setMode] = useState<"concentric" | "manual">("concentric");
  const [innerRadius, setInnerRadius] = useState<number>(26);
  const [paddingChannel, setPaddingChannel] = useState<number>(12);
  const [stageMargin, setStageMargin] = useState<number>(8);

  const [manualRadius, setManualRadius] = useState<number>(38);
  const [manualFillet, setManualFillet] = useState<number>(26);
  const [notchAngle, setNotchAngle] = useState<number>(DEFAULT_BIARC_ANGLE_DEG);
  const [enableShadow, setEnableShadow] = useState<boolean>(false);
  const [enableTopCenterSmooth, setEnableTopCenterSmooth] = useState<boolean>(true);

  const [enabledCorners, setEnabledCorners] = useState<Record<NotchCornerPlacement, boolean>>({
    "top-left": true,
    "top-right": true,
    "bottom-left": true,
    "bottom-right": true,
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  const concentricConfig = {
    innerRadius,
    paddingOuter: paddingChannel,
    paddingInner: stageMargin,
  };

  const computedConcentric = calculateConcentricNotch(concentricConfig, stageMargin);
  const smoothBiArcInfo = solveBiArc({ height: 44, angleDeg: notchAngle, radiusBottom: 80 });

  const activeRadiusDisplay =
    mode === "concentric" ? computedConcentric.radius : `${manualRadius}px`;
  const activeFilletDisplay =
    mode === "concentric" ? computedConcentric.filletSize : `${manualFillet}px`;

  const sharedNotchProps =
    mode === "concentric"
      ? {
          concentric: concentricConfig,
          offsetX: stageMargin,
          offsetY: stageMargin,
          dropShadow: enableShadow ? "0 8px 20px rgb(0 0 0 / 0.18)" : undefined,
        }
      : {
          radius: manualRadius,
          filletSize: manualFillet,
          offsetX: stageMargin,
          offsetY: stageMargin,
          dropShadow: enableShadow ? "0 8px 20px rgb(0 0 0 / 0.18)" : undefined,
        };

  const toggleCorner = (corner: NotchCornerPlacement) => {
    setEnabledCorners((prev) => ({
      ...prev,
      [corner]: !prev[corner],
    }));
  };

  const stageStyle: StageCssVars = {
    "--stage-margin": `${stageMargin}px`,
    "--slot-pad-edge": `${stageMargin}px`,
    "--slot-pad-channel": `${paddingChannel}px`,
    "--pill-height": `${innerRadius * 2}px`,
    "--pill-radius": `${innerRadius}px`,
    "--active-surface": selectedSurface.token,
  };

  return (
    <div className={styles.sandboxWrapper} style={stageStyle}>
      {/* 1. Canto Superior Esquerdo: Header / Marca + Navegação */}
      {enabledCorners["top-left"] && (
        <NotchContainer
          as="header"
          placement="top-left"
          className={styles.slotTopLeft}
          {...sharedNotchProps}
        >
          <nav className={styles.brandNavPill} aria-label="Navegação de demonstração">
            <span className={styles.brandLogo}>
              <Sparkles size={17} aria-hidden="true" />
              Atelier Conf.
            </span>
            <span className={styles.divider} aria-hidden="true" />
            <div className={styles.navLinks}>
              <a className={styles.navLink} href="#sandbox-inspector">
                Coleção
              </a>
              <a className={styles.navLink} href="#sandbox-inspector">
                Degustação
              </a>
              <a className={styles.navLink} href="#sandbox-inspector">
                Atelier
              </a>
            </div>
          </nav>
        </NotchContainer>
      )}

      {/* Aba Central Smooth (Bi-Arc SVG Paramétrico) */}
      {enableTopCenterSmooth && (
        <NotchContainer
          as="div"
          placement="top-center"
          variant="smooth"
          angle={notchAngle}
          radius={80}
          smoothHeight={44}
          offsetY={stageMargin}
          dropShadow={enableShadow ? "0 8px 20px rgb(0 0 0 / 0.18)" : undefined}
          className={styles.slotTopCenter}
        >
          <span className={styles.topCenterLabel}>Smooth • {notchAngle}°</span>
        </NotchContainer>
      )}

      {/* 2. Canto Superior Direito: Ação Rápida + Alternador de Tema */}
      {enabledCorners["top-right"] && (
        <NotchContainer
          as="div"
          placement="top-right"
          className={styles.slotTopRight}
          {...sharedNotchProps}
        >
          <div className={styles.actionGroup}>
            <button
              type="button"
              className={styles.iconPillButton}
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
              title={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            >
              {theme === "light" ? (
                <Moon size={18} aria-hidden="true" />
              ) : (
                <Sun size={18} aria-hidden="true" />
              )}
            </button>
            <button type="button" className={styles.ctaPillButton}>
              <ShoppingBag size={16} aria-hidden="true" />
              Encomendar Caixa
            </button>
          </div>
        </NotchContainer>
      )}

      {/* Seção Principal (Fundo estilo Hero interagindo com os 4 entalhes) */}
      <main>
        <section
          id="sandbox-inspector"
          className={styles.heroCanvas}
          aria-labelledby="sandbox-title"
        >
          <div className={styles.inspectorCard}>
            <div className={styles.inspectorHeader}>
              <span className={styles.eyebrowTag}>
                <Sliders size={13} aria-hidden="true" />
                Notch Engine Sandbox
              </span>
              <h1 id="sandbox-title">Motor Modular de Entalhes Côncavos</h1>
              <p>
                Validação isolada dos 4 cantos externos usando mixins SCSS em{" "}
                <code>_mixins.scss</code>, variáveis CSS reativas e o componente polimórfico{" "}
                <code>&lt;NotchContainer /&gt;</code>.
              </p>
            </div>

            <div className={styles.modeTabs} role="tablist" aria-label="Modo de cálculo geométrico">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "concentric"}
                className={mode === "concentric" ? styles.activeTab : ""}
                onClick={() => setMode("concentric")}
              >
                Cálculo Concêntrico Automático
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "manual"}
                className={mode === "manual" ? styles.activeTab : ""}
                onClick={() => setMode("manual")}
              >
                Dimensões Diretas (Manual)
              </button>
            </div>

            {mode === "concentric" ? (
              <div className={styles.controlsGrid}>
                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-inner-radius">Raio Interno (Pílula)</label>
                    <span className={styles.fieldValue}>{innerRadius}px</span>
                  </div>
                  <input
                    id="ctrl-inner-radius"
                    type="range"
                    min={16}
                    max={32}
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-pad-channel">Padding Interno (Canal)</label>
                    <span className={styles.fieldValue}>{paddingChannel}px</span>
                  </div>
                  <input
                    id="ctrl-pad-channel"
                    type="range"
                    min={6}
                    max={24}
                    value={paddingChannel}
                    onChange={(e) => setPaddingChannel(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-stage-margin">Margem da Seção (Offset)</label>
                    <span className={styles.fieldValue}>{stageMargin}px</span>
                  </div>
                  <input
                    id="ctrl-stage-margin"
                    type="range"
                    min={0}
                    max={20}
                    value={stageMargin}
                    onChange={(e) => setStageMargin(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.controlsGrid}>
                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-manual-radius">Raio Convexo (--notch-radius)</label>
                    <span className={styles.fieldValue}>{manualRadius}px</span>
                  </div>
                  <input
                    id="ctrl-manual-radius"
                    type="range"
                    min={12}
                    max={52}
                    value={manualRadius}
                    onChange={(e) => setManualRadius(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-manual-fillet">Curva Côncava (--notch-fillet)</label>
                    <span className={styles.fieldValue}>{manualFillet}px</span>
                  </div>
                  <input
                    id="ctrl-manual-fillet"
                    type="range"
                    min={8}
                    max={40}
                    value={manualFillet}
                    onChange={(e) => setManualFillet(Number(e.target.value))}
                  />
                </div>

                <div className={styles.controlField}>
                  <div className={styles.fieldHeader}>
                    <label htmlFor="ctrl-manual-offset">Margem da Seção (Offset)</label>
                    <span className={styles.fieldValue}>{stageMargin}px</span>
                  </div>
                  <input
                    id="ctrl-manual-offset"
                    type="range"
                    min={0}
                    max={20}
                    value={stageMargin}
                    onChange={(e) => setStageMargin(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className={styles.controlsGrid}>
              <div className={styles.controlField}>
                <div className={styles.fieldHeader}>
                  <label htmlFor="ctrl-smooth-angle">Angulação Smooth (--notch-angle)</label>
                  <span className={styles.fieldValue}>
                    {notchAngle}deg • {Math.round(smoothBiArcInfo.transitionWidth)}px
                  </span>
                </div>
                <input
                  id="ctrl-smooth-angle"
                  type="range"
                  min={20}
                  max={60}
                  value={notchAngle}
                  onChange={(e) => setNotchAngle(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.togglesRow}>
              <div className={styles.cornerChecks}>
                {CORNER_LABELS.map(({ key, label }) => (
                  <label key={key} className={styles.checkChip}>
                    <input
                      type="checkbox"
                      checked={enabledCorners[key]}
                      onChange={() => toggleCorner(key)}
                    />
                    {label}
                  </label>
                ))}
                <label className={styles.checkChip}>
                  <input
                    type="checkbox"
                    checked={enableTopCenterSmooth}
                    onChange={(e) => setEnableTopCenterSmooth(e.target.checked)}
                  />
                  Top-Center (Smooth Bi-Arc)
                </label>
              </div>

              <label className={styles.checkChip}>
                <input
                  type="checkbox"
                  checked={enableShadow}
                  onChange={(e) => setEnableShadow(e.target.checked)}
                />
                Drop-Shadow Contínuo
              </label>
            </div>

            <pre className={styles.codeReadout}>
              <code>
                {`/* Variáveis CSS ativas (Classic + Smooth Bi-Arc) */
--notch-radius: ${activeRadiusDisplay};
--notch-fillet: ${activeFilletDisplay};
--notch-angle: ${notchAngle}deg; /* Rampa lateral: ${smoothBiArcInfo.transitionWidth.toFixed(1)}px */
--notch-offset-x: ${stageMargin}px;
--notch-offset-y: ${stageMargin}px;
--notch-bg: var(--color-background); /* Tema: ${theme} */`}
              </code>
            </pre>
          </div>
        </section>
      </main>

      {/* 3. Canto Inferior Esquerdo: Selo / Badge Artesanal */}
      {enabledCorners["bottom-left"] && (
        <NotchContainer
          as="aside"
          placement="bottom-left"
          aria-label="Selo de autenticidade artesanal"
          className={styles.slotBottomLeft}
          {...sharedNotchProps}
        >
          <div className={styles.badgePill}>
            <Award size={17} className={styles.badgeIcon} aria-hidden="true" />
            <span>100% Cacau Amazônico • Produção Diária</span>
            <span className={styles.badgeDot} aria-hidden="true" />
          </div>
        </NotchContainer>
      )}

      {/* 4. Canto Inferior Direito: Seletor de Superfície + Link para LP Principal */}
      {enabledCorners["bottom-right"] && (
        <NotchContainer
          as="nav"
          placement="bottom-right"
          aria-label="Controles de superfície e retorno"
          className={styles.slotBottomRight}
          {...sharedNotchProps}
        >
          <div className={styles.paletteDockPill}>
            <span className={styles.dockLabel}>Superfície</span>
            {SURFACE_OPTIONS.map((surface) => {
              const isSelected = surface.id === selectedSurface.id;
              return (
                <button
                  key={surface.id}
                  type="button"
                  className={`${styles.swatchBtn} ${isSelected ? styles.swatchActive : ""}`}
                  style={{ backgroundColor: surface.swatchColor }}
                  onClick={() => setSelectedSurface(surface)}
                  aria-label={`Selecionar superfície ${surface.label}`}
                  aria-pressed={isSelected}
                  title={surface.label}
                />
              );
            })}
            <a href="/" className={styles.backLink}>
              LP Principal
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </NotchContainer>
      )}
    </div>
  );
}
