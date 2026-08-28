import { useState, useEffect, useCallback } from "react";

export type Theme = "system" | "light" | "dark";

const THEME_SEQUENCE: Record<Theme, Theme> = {
  system: "light",
  light: "dark",
  dark: "system",
};

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const storedTheme = localStorage.getItem("theme");
  return isTheme(storedTheme) ? storedTheme : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }, []);

  // Apply on mount and listen for system changes
  useEffect(() => {
    applyTheme(theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(THEME_SEQUENCE[theme]);
  }, [theme, setTheme]);

  return { theme, toggle };
}
