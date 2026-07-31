import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LessonLibraryPage, { metadata } from "./page";

describe("LessonLibraryPage", () => {
  it("documents the reusable exercises and their responsive contract", () => {
    render(<LessonLibraryPage />);

    expect(
      screen.getByRole("heading", {
        name: /uma linguagem comum para construir experiências/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("EX-01")).toBeInTheDocument();
    expect(screen.getByText("EX-05")).toBeInTheDocument();
    expect(screen.getByText("390 × 844")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ver tela-fonte: caminho da sombra/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/caminho-da-sombra");
  });

  it("keeps the internal documentation out of search indexes", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
