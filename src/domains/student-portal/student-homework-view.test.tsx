import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentHomeworkView } from "./student-homework-view";

afterEach(cleanup);

describe("StudentHomeworkView", () => {
  it("shows homework cards and opens the details dialog", () => {
    render(<StudentHomeworkView />);

    expect(
      screen.getByRole("heading", { name: /^lições em aberto$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /abertas/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.queryByRole("grid", { name: /dias com entrega/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dóxa em três perguntas/i })).toBeInTheDocument();
    expect(screen.getAllByText(/da trilha/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/da professora/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: /ver detalhes/i })[0]);

    const dialog = screen.getByRole("dialog", { name: /dóxa em três perguntas/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/não quero definição de dicionário/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^começar$/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );

    fireEvent.click(screen.getByLabelText("Fechar"));
    fireEvent.click(screen.getByRole("tab", { name: /esta semana/i }));
    expect(
      screen.getByRole("heading", { name: /^vencem esta semana$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dóxa em três perguntas/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /mapa da caverna/i }),
    ).not.toBeInTheDocument();
  });

  it("enters a trail homework from the card and a teacher homework from the board", () => {
    render(<StudentHomeworkView />);

    expect(screen.getAllByRole("link", { name: /entrar na lição/i })[0]).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );

    fireEvent.click(screen.getAllByRole("button", { name: /entrar na lição/i })[0]);

    expect(
      screen.getByRole("heading", { name: /mapa da caverna, do seu jeito/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /todas as lições de casa/i }),
    ).toBeInTheDocument();
  });

  it("saves draft answers in localStorage", () => {
    window.localStorage.clear();
    render(<StudentHomeworkView initialAssignmentId="doxa-em-tres-perguntas" />);

    fireEvent.click(screen.getByLabelText(/as sombras na parede/i));

    expect(window.localStorage.getItem("philoo:homework:doxa-em-tres-perguntas")).toContain(
      '"q1":"b"',
    );

    window.localStorage.clear();
  });
});
