import { describe, expect, it } from "vitest";
import { getPhilosopherGoldCoin, philosopherGoldCoins } from "./philosopher-coin-assets";

describe("philosopherGoldCoins", () => {
  it("maps each built philosopher to a transparent gold coin asset", () => {
    expect(philosopherGoldCoins.plato.src).toContain("plato-gold-coin-v4");
    expect(philosopherGoldCoins.thales.src).toContain("thales-gold-coin-v2");
    expect(philosopherGoldCoins.heraclitus.src).toContain("heraclitus-gold-coin-v2");
  });

  it("resolves coin by character id", () => {
    expect(getPhilosopherGoldCoin("thales")?.alt).toMatch(/tales/i);
    expect(getPhilosopherGoldCoin("heraclitus")?.alt).toMatch(/heráclito/i);
  });
});
