import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PLATO_POSES } from "./plato-pose-catalog";

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
  "review-argument",
  "celebrate-discovery",
  "gentle-retry",
  "revision-change",
  "revision-maintain",
  "revision-uncertainty",
  "frame-versus-claim",
] as const;

describe("Plato pose catalog", () => {
  it("uses only the canonical v2 pose collection for every live lesson state", () => {
    expect(Object.keys(PLATO_POSES)).toEqual(EXPECTED_POSES);

    for (const pose of EXPECTED_POSES) {
      const asset = PLATO_POSES[pose];

      expect(asset.src).toMatch(/^\/images\/story\/plato-v2\/plato-.+\.png$/);
      expect(
        existsSync(join(process.cwd(), "public", asset.src)),
        `missing ${pose} asset at ${asset.src}`,
      ).toBe(true);
    }
  });
});
