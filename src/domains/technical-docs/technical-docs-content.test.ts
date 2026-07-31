import { describe, expect, it } from "vitest";
import {
  getTechnicalDocumentHeadings,
  searchTechnicalDocuments,
  slugifyTechnicalHeading,
} from "./technical-docs-content";

describe("technical docs content", () => {
  it("creates stable unique anchors for Portuguese headings", () => {
    expect(slugifyTechnicalHeading("Personagens e proporção")).toBe(
      "personagens-e-proporcao",
    );
    expect(
      getTechnicalDocumentHeadings(
        "## Qualidade\n### Viewports\n## Qualidade",
      ),
    ).toEqual([
      { id: "qualidade", level: 2, text: "Qualidade" },
      { id: "viewports", level: 3, text: "Viewports" },
      { id: "qualidade-2", level: 2, text: "Qualidade" },
    ]);
  });

  it("searches the real guide contents, including terms absent from titles", () => {
    const results = searchTechnicalDocuments("safe area");

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some(
        ({ document }) => document.slug === "personagens-e-assets",
      ),
    ).toBe(true);
  });
});
