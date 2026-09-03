import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPlatoPose, PLATO_POSES } from "./plato-pose-catalog";

const EXPECTED_POSES = [
  "invitation",
  "descent",
  "deeper-entrance-fades",
  "prisoners-empathy",
  "first-wall-reveal",
  "observe-with-them",
  "listening-prisoner",
  "shadow-expert",
  "appearance-source",
  "first-question",
  "diagnose-anomaly",
  "prediction-model",
  "review-evidence",
  "guided-classification",
  "teaching-pointer",
  "review-argument",
  "celebrate-discovery",
  "gentle-retry",
  "revision-change",
  "revision-maintain",
  "revision-uncertainty",
  "frame-versus-claim",
  "shadow-celebration",
  "curious-interruption",
  "reveal-behind",
  "causal-path",
  "doxa",
  "first-doubt",
  "invite-turn",
  "periagoge-guide",
  "light-pain-guide",
  "gradual-seeing-guide",
  "return-compassion-guide",
  "point-into-darkness",
  "feeling-dark",
  "show-shadow-game",
  "invite-stack",
  "point-descent",
  "briefing-lenses",
  "thoughtful-chin",
  "speaking-gesture",
] as const;

describe("Plato pose catalog", () => {
  it("registers every approved semantic pose and its committed asset", () => {
    expect(Object.keys(PLATO_POSES)).toEqual(EXPECTED_POSES);

    for (const pose of EXPECTED_POSES) {
      const asset = PLATO_POSES[pose];

      expect(asset.src).toMatch(/^\/images\/story\/.+\/plato-.+\.png$/);
      expect(
        existsSync(join(process.cwd(), "public", asset.src)),
        `missing ${pose} asset at ${asset.src}`,
      ).toBe(true);
    }
  });
});

it.each([
  "shadow-celebration",
  "curious-interruption",
  "reveal-behind",
  "causal-path",
  "doxa",
  "first-doubt",
  "invite-turn",
] as const)("registers the %s Lesson One pose", (pose) => {
  expect(getPlatoPose(pose).src).toMatch(/^\/images\/story\/plato-v2\//);
  expect(getPlatoPose(pose).alt.length).toBeGreaterThan(20);
});
