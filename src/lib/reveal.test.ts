import { describe, expect, it } from "vitest";
import { clampReveal } from "./reveal";

describe("clampReveal", () => {
  it.each([
    [-20, 0],
    [0, 0],
    [48, 48],
    [100, 100],
    [130, 100],
  ])("normalizes %s to %s", (input, expected) => {
    expect(clampReveal(input)).toBe(expected);
  });
});
