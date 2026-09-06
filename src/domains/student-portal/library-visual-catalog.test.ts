import { describe, expect, it } from "vitest";
import { getLibraryGroupVisual, listPlayableChapterCards } from "./library-visual-catalog";

describe("libraryVisualCatalog", () => {
  it("provides cover art for mapped library modules", () => {
    const cave = getLibraryGroupVisual("cave");
    const presocratics = getLibraryGroupVisual("presocratics");

    expect(cave.coverSrc).toContain("plato-cave");
    expect(presocratics.coverSrc).toContain("presocratics-trail-banner");
  });

  it("lists playable lessons with poster art", () => {
    const playable = listPlayableChapterCards();

    expect(playable.some((chapter) => chapter.id === "thales")).toBe(true);
    expect(playable.find((chapter) => chapter.id === "thales")?.coverSrc).toContain("mileto");
  });
});
