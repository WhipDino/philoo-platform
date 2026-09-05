import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { portalLessonNotebooks } from "./student-notebook-content";
import { StudentNotebookView } from "./student-notebook-view";

afterEach(cleanup);

describe("StudentNotebookView", () => {
  it("lists all built lesson cadernos grouped by era in preview", () => {
    render(<StudentNotebookView />);

    expect(screen.getByRole("heading", { name: /^caderno$/i })).toBeInTheDocument();
    expect(screen.getByText(/5 cadernos desbloqueados/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mito da caverna/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /pré-socráticos/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /as sombras/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tales e a arché/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /heráclito e a mudança/i })).toBeInTheDocument();
  });

  it("opens a lesson caderno in folio voice with paginated review", () => {
    render(<StudentNotebookView />);

    fireEvent.click(screen.getByRole("button", { name: /tales e a arché/i }));

    expect(
      screen.getByRole("heading", { level: 1, name: /tales e a arché/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/conceito-chave da lição/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /^arché/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^continuar$/i }));
    expect(screen.getByRole("heading", { level: 2, name: /mileto e a variedade/i })).toBeInTheDocument();

    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: /^continuar$/i }));
    }

    fireEvent.click(screen.getByRole("button", { name: /revisar esta lição/i }));

    expect(screen.getAllByRole("button", { name: /toque para ver a resposta/i }).length).toBe(3);
    expect(screen.queryByRole("heading", { level: 2, name: /mileto e a variedade/i })).not.toBeInTheDocument();
  });
});

describe("portalLessonNotebooks", () => {
  it("covers built lessons through Heraclitus", () => {
    expect(portalLessonNotebooks.map((notebook) => notebook.id)).toEqual([
      "as-sombras",
      "a-subida",
      "o-retorno",
      "tales",
      "heraclitus",
    ]);
  });
});
