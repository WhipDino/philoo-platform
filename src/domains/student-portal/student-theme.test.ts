import { afterEach, describe, expect, it } from "vitest";
import {
  PHILOO_THEME_KEY,
  applyPhilooTheme,
  persistPhilooTheme,
  readStoredTheme,
} from "./student-theme";

afterEach(() => {
  window.localStorage.removeItem(PHILOO_THEME_KEY);
  delete document.documentElement.dataset.theme;
});

describe("student theme", () => {
  it("treats anything other than night as day", () => {
    expect(readStoredTheme()).toBe("day");
    window.localStorage.setItem(PHILOO_THEME_KEY, "night");
    expect(readStoredTheme()).toBe("night");
  });

  it("writes the html dataset used by CSS", () => {
    applyPhilooTheme("night");
    expect(document.documentElement.dataset.theme).toBe("night");
    persistPhilooTheme("day");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(window.localStorage.getItem(PHILOO_THEME_KEY)).toBe("day");
  });
});
