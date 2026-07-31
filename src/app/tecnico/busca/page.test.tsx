import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TechnicalDocsSearch, { metadata } from "./page";

describe("TechnicalDocsSearch", () => {
  it("returns guides using terms found inside their real Markdown content", async () => {
    render(
      await TechnicalDocsSearch({
        searchParams: Promise.resolve({ q: "safe area" }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Encontre uma decisão, regra ou exemplo.",
      }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("heading", { name: "Personagens e assets" })
        .closest("a"),
    ).toHaveAttribute("href", "/tecnico/guias/personagens-e-assets");
  });

  it("keeps internal search results out of public indexes", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
