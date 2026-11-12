import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./SandboxApp.module.scss";

const OVERLAY_THEMES = [
  { id: "neutral", label: "Fumê Neutro" },
  { id: "cacau", label: "Cacau Torrado" },
  { id: "pistache", label: "Pistache Real" },
];

export function SandboxApp() {
  const [overlayTheme, setOverlayTheme] = useState(OVERLAY_THEMES[0]?.id || "neutral");
  const [glassOpacity, setGlassOpacity] = useState(0.8);
  const [shadowDepth, setShadowDepth] = useState("regular");

  const getOverlayColor = (themeId: string) => {
    switch (themeId) {
      case "cacau":
        return `rgba(48, 28, 17, ${glassOpacity})`;
      case "pistache":
        return `rgba(26, 40, 25, ${glassOpacity})`;
      default:
        return `rgba(20, 20, 24, ${glassOpacity})`;
    }
  };

  return (
    <div className={styles.sandbox}>
      <header className={styles.header}>
        <h1>Antigravity Sandbox</h1>
        <ThemeToggle />
      </header>

      <div className={styles.layout}>
        <aside className={styles.controls}>
          <section>
            <h2>About Cards Playground</h2>
            <label>
              Theme:
              <select value={overlayTheme} onChange={(e) => setOverlayTheme(e.target.value)}>
                {OVERLAY_THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Opacity: {glassOpacity.toFixed(2)}
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Shadow:
              <select value={shadowDepth} onChange={(e) => setShadowDepth(e.target.value)}>
                <option value="regular">Regular</option>
                <option value="deep">Deep</option>
              </select>
            </label>
          </section>
        </aside>

        <main className={styles.stage}>
          <div style={{ padding: 40 }}>
            <div
              style={{
                width: 300,
                height: 400,
                borderRadius: 32,
                background: "#ccc",
                position: "relative",
                boxShadow:
                  shadowDepth === "deep"
                    ? "0 24px 54px -14px rgba(0,0,0,0.2)"
                    : "0 16px 40px -12px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  padding: 20,
                  borderRadius: 20,
                  backdropFilter: "blur(16px)",
                  background: getOverlayColor(overlayTheme),
                }}
              >
                <p style={{ color: "white" }}>Test Card ({overlayTheme})</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
