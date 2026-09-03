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
});
