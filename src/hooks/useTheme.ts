import { useCallback, useEffect, useRef, useState } from "react";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "lp-conf-theme";
export const THEME_CHANGE_EVENT = "lp-conf-theme-change";
export const THEME_META_LIGHT = "#f8f4e8";
export const THEME_META_DARK = "#171210";

/**
 * Resolve o tema inicial seguindo a hierarquia de fontes de verdade:
 * 1. Escolha persistida explicitamente em localStorage.
 * 2. Atributo data-theme já aplicado pelo script síncrono anti-FOUC no <head>.
 * 3. Preferência de sistema do usuário (prefers-color-scheme).
 * 4. Fallback padrão: "light".
 */
export function resolveInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch {
    // Ignora restrições de sandbox / navegação privada
  }

  if (document.documentElement.getAttribute("data-theme") === "dark") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Atualiza os atributos estruturais do documento, a propriedade CSS nativa color-scheme
 * e a meta tag theme-color da barra de status móvel (iOS Safari / Android Chrome).
 */
export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "light";
  }

  const targetColor = theme === "dark" ? THEME_META_DARK : THEME_META_LIGHT;
  for (const metaThemeColor of document.querySelectorAll('meta[name="theme-color"]')) {
    metaThemeColor.setAttribute("content", targetColor);
  }
}

export interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

/**
 * Custom hook desacoplado que centraliza a tríade de sincronização de estado de tema:
 * SO (prefers-color-scheme), persistência sob demanda (localStorage) e multi-abas (evento storage).
 */
export function useTheme(onThemeChange?: (theme: ThemeMode) => void): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>(resolveInitialTheme);

  const onThemeChangeRef = useRef(onThemeChange);
  useEffect(() => {
    onThemeChangeRef.current = onThemeChange;
  });

  // Sincroniza atributos do DOM sempre que o tema muda
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Escuta preferências do SO caso o usuário não tenha preferência manual fixa
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      try {
        const hasManual = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (hasManual === "dark" || hasManual === "light") {
          return;
        }
      } catch {
        // Segue preferência do SO se o localStorage estiver bloqueado
      }

      const nextTheme: ThemeMode = event.matches ? "dark" : "light";
      setThemeState(nextTheme);
      onThemeChangeRef.current?.(nextTheme);
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // Escuta sincronização multi-abas (storage event) e intra-aba (custom event) em tempo real
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const newTheme = event.newValue;
      if (newTheme === "dark" || newTheme === "light") {
        setThemeState(newTheme);
        onThemeChangeRef.current?.(newTheme);
      }
    };

    const handleCustomChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      const newTheme = customEvent.detail;
      if (newTheme === "dark" || newTheme === "light") {
        setThemeState(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(THEME_CHANGE_EVENT, handleCustomChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(THEME_CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignora restrições de quota/armazenamento
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, { detail: nextTheme }));
    }
    onThemeChangeRef.current?.(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
