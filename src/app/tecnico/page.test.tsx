import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TechnicalDocumentationHome, { metadata } from "./page";

describe("TechnicalDocumentationHome", () => {
  it("routes context-free contributors to lessons, exercises, UI and quality docs", () => {
    render(<TechnicalDocumentationHome />);

    expect(
      screen.getByRole("heading", {
        name: /comece com uma pergunta/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Criar uma aula")).toBeInTheDocument();
    expect(screen.getByText("Escolher um exercício")).toBeInTheDocument();
    expect(screen.getByText("Mudar botão, card ou layout")).toBeInTheDocument();
    expect(
      screen.getAllByText("docs/playbooks/CREATE_A_LESSON.md").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("src/domains/lesson-library/index.ts").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", {
        name: /abrir biblioteca de exercícios/i,
      }),
    ).toHaveAttribute("href", "/tecnico/biblioteca");
  });

  it("keeps internal contributor documentation out of search indexes", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
