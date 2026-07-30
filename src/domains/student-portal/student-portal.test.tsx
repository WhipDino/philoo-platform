import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentPortal } from "./student-portal";

afterEach(cleanup);

describe("StudentPortal", () => {
  it("prioritizes the current lesson and links to the Story Folio journey", () => {
    render(<StudentPortal />);

    expect(
      screen.getByRole("heading", {
        name: /seu próximo passo já está aberto/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continuar aula/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
    expect(
      screen.getByRole("progressbar", { name: /progresso em as sombras/i }),
    ).toHaveAttribute("aria-valuenow", "67");
  });

  it("lets the student move through the learning platform", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getAllByRole("button", { name: /^explorar$/i })[0]);
    expect(
      screen.getByRole("heading", { name: /escolha por onde sua curiosidade/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /meu caminho/i })[0]);
    expect(
      screen.getByRole("heading", { name: /cada capítulo muda/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /abrir perfil/i }));
    expect(
      screen.getByRole("heading", { name: /seu perfil acompanha/i }),
    ).toBeInTheDocument();
  });

  it("marks teacher announcements as read without hiding them", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /3 avisos não lidos/i }));
    expect(screen.getByRole("heading", { name: /3 novidades/i })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /marcar como lido/i })[0]);

    expect(screen.getByRole("heading", { name: /2 novidades/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /uma pergunta para levar com você/i,
      }),
    ).toBeInTheDocument();
  });

  it("offers readable motion and text preferences", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /abrir perfil/i }));

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
