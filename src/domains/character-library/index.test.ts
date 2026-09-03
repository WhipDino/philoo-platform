import { describe, expect, it } from "vitest";
import { getCharacter, getCharacterPose } from "./index";

describe("character library", () => {
  it("registers Plato with an identity anchor and semantic poses", () => {
    const plato = getCharacter("plato");

    expect(plato.displayName).toBe("Platão");
    expect(plato.identityAnchorSrc).toContain("plato-invitation");
    expect(getCharacterPose("plato", "light-pain-guide").src).toContain(
      "plato-light-pain-guide",
    );
  });

  it("registers Thales with an identity anchor and eight semantic poses", () => {
    const thales = getCharacter("thales");

    expect(thales.id).toBe("thales");
    expect(thales.displayName).toBe("Tales");
    expect(thales.identityAnchorSrc).toContain("thales-identity-anchor-v1");
    expect(thales.chromaKey).toBe("#00FF00");
    expect(Object.keys(thales.poses)).toEqual([
      "identity-anchor",
      "point-harbor",
      "present-panel",
      "open-hands-variety",
      "hold-question",
      "water-answer",
      "present-word",
      "hook-open",
    ]);
    expect(getCharacterPose("thales", "present-word").src).toContain(
      "thales-present-word-v1",
    );
  });

  it("registers Heraclitus with an identity anchor and eight semantic poses", () => {
    const heraclitus = getCharacter("heraclitus");

    expect(heraclitus.id).toBe("heraclitus");
    expect(heraclitus.displayName).toBe("Heráclito");
    expect(heraclitus.identityAnchorSrc).toContain(
      "heraclitus-identity-anchor-v1",
    );
    expect(heraclitus.chromaKey).toBe("#00FF00");
    expect(Object.keys(heraclitus.poses)).toEqual([
      "identity-anchor",
      "point-river",
      "present-panel",
      "open-hands-flow",
      "hold-paradox",
      "opposites-gesture",
      "present-word",
      "hook-open",
    ]);
    expect(getCharacterPose("heraclitus", "present-word").src).toContain(
      "heraclitus-present-word-v1",
    );
  });
});
