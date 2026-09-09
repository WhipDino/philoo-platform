export const PHILOO_THEME_KEY = "philoo-theme";

export type PhilooTheme = "day" | "night";

export function readStoredTheme(): PhilooTheme {
  if (typeof window === "undefined") {
    return "day";
  }
  try {
    return window.localStorage.getItem(PHILOO_THEME_KEY) === "night" ? "night" : "day";
  } catch {
    return "day";
  }
}

export function applyPhilooTheme(theme: PhilooTheme) {
  if (typeof document === "undefined") {
    return;
  }
  if (theme === "night") {
    document.documentElement.dataset.theme = "night";
  } else {
    delete document.documentElement.dataset.theme;
  }
}

export function persistPhilooTheme(theme: PhilooTheme) {
  applyPhilooTheme(theme);
  try {
    window.localStorage.setItem(PHILOO_THEME_KEY, theme);
  } catch {
    /* preview / private mode */
  }
}
