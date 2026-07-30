import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentPortal } from "./student-portal";

afterEach(cleanup);

describe("StudentPortal", () => {
  it("prioritizes the current lesson and links to the Story Folio journey", () => {
    render(<StudentPortal />);

    expect(
      screen.getByRole("heading", {
        name: /o que vamos descobrir hoje/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continuar as sombras/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
    expect(
      screen.getByRole("progressbar", { name: /progresso em as sombras/i }),
    ).toHaveAttribute("aria-valuenow", "67");
  });

  it("lets the student move between the portal notebook tabs", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("tab", { name: /aulas/i }));
    expect(
      screen.getByRole("heading", { name: /suas aulas têm histórias/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /turma/i }));
    expect(
      screen.getByRole("heading", { name: /também é um lugar de ideias/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /perfil/i }));
    expect(
      screen.getByRole("heading", { name: /seu espaço, do seu jeito/i }),
    ).toBeInTheDocument();
  });

  it("marks teacher announcements as read without hiding them", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("tab", { name: /avisos/i }));
    expect(screen.getByText(/3 avisos novos/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /marcar como lido/i })[0]);

    expect(screen.getByText(/2 avisos novos/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /uma pergunta para levar para a aula/i,
      }),
    ).toBeInTheDocument();
  });

  it("offers readable motion and text preferences", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("tab", { name: /perfil/i }));

    const largerText = screen.getByRole("checkbox", {
      name: /texto um pouco maior/i,
    });
    const quietMotion = screen.getByRole("checkbox", {
      name: /movimentos mais tranquilos/i,
    });

    fireEvent.click(largerText);
    fireEvent.click(quietMotion);

    expect(largerText).toBeChecked();
    expect(quietMotion).toBeChecked();
  });
});
