import { describe, expect, it } from "vitest";
import {
  GUIDED_CLASSIFICATION_CHARACTER_BRIEF,
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  GuidedClassificationActivity,
  GuidedClassificationExercise,
  getGuidedClassificationGuide,
} from "./index";

describe("lesson-library public API", () => {
  it("exposes the author API and the controlled runtime API from one import", () => {
    expect(GuidedClassificationExercise).toBeTypeOf("function");
    expect(GuidedClassificationActivity).toBeTypeOf("function");
    expect(getGuidedClassificationGuide).toBeTypeOf("function");
    expect(GUIDED_CLASSIFICATION_SCHEMA_VERSION).toBe("1");
    expect(GUIDED_CLASSIFICATION_CHARACTER_BRIEF.composition.facing).toBe(
      "direita",
    );
  });

  it("re-exports the candidate engines so lessons do not copy their source", async () => {
    const library = await import("./index");

    expect(library.PredictionConsequence).toBeTypeOf("function");
    expect(library.PhilooPairConnect).toBeTypeOf("function");
    expect(library.PhilooCausalPath).toBeTypeOf("function");
    expect(library.PhilooDecisionLayers).toBeTypeOf("function");
    expect(library.PhilooDualLens).toBeTypeOf("function");
    expect(library.selectExercisesForChapter).toBeTypeOf("function");
  });
});
