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
});
