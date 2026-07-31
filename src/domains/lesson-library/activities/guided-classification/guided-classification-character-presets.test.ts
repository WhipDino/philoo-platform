import { describe, expect, it } from "vitest";
import {
  GUIDED_CLASSIFICATION_CHARACTER_BRIEF,
  getGuidedClassificationCharacterPreset,
  getGuidedClassificationGuide,
} from "./guided-classification-character-presets";

describe("guided-classification character presets", () => {
  it("keeps pose, proportions and generation direction in code", () => {
    const preset = getGuidedClassificationCharacterPreset("plato");

    expect(preset.guide).toEqual({
      characterId: "plato",
      pose: "teaching-pointer",
      sizes: "(max-width: 540px) 120px, 210px",
    });
    expect(preset.generationBrief.composition).toMatchObject({
      background: "transparent",
      facing: "direita",
      preferredAspectRatio: "2:3",
    });
    expect(GUIDED_CLASSIFICATION_CHARACTER_BRIEF.renderedSize.phone).toEqual({
      frameWidth: "148 px",
      frameHeight: "154 px",
      imageWidth: "124% do frame para preservar o gesto",
    });
  });

  it("returns a copy so lesson-specific options cannot mutate the preset", () => {
    const guide = getGuidedClassificationGuide("plato");
    guide.priority = true;

    expect(getGuidedClassificationGuide("plato")).not.toHaveProperty(
      "priority",
    );
  });
});
