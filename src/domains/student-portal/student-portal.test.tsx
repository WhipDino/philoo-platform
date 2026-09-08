import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentPortal } from "./student-portal";

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
});

describe("StudentPortal", () => {
  it("shows a clear next step on Início and links to the current lesson", () => {
    render(<StudentPortal />);

    expect(
      screen.getByRole("heading", {
        name: /olá, ana/i,
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /^as sombras$/i,
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continuar aula/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/doxa");
    expect(screen.getByRole("progressbar", { name: /progresso em as sombras/i })).toHaveAttribute(
      "aria-valuenow",
      "67",
    );
    expect(
      screen.getByRole("heading", { name: /na sua fila/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mapa do módulo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /explorar o acervo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^biblioteca$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^caderno/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^trilha$/i })).toBeInTheDocument();
  });

  it("opens the Duolingo-style trail from the nav and home shortcut", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /^trilha$/i }));
    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /encontros de saindo da caverna/i })).toBeInTheDocument();
    expect(screen.getByText(/você está aqui/i)).toBeInTheDocument();
  });

  it("opens the student library with the current cave group and module map", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /^biblioteca$/i }));
    expect(screen.getByRole("heading", { name: /^biblioteca$/i })).toBeInTheDocument();
    expect(screen.getByText("Você está aqui")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /as sombras/i }).some(
        (link) => link.getAttribute("href") === "/aula/as-sombras/doxa",
      ),
    ).toBe(true);
    expect(screen.getByRole("heading", { name: /^pré-socráticos$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tales e a arché/i })).toHaveAttribute(
      "href",
      "/aula/tales/ola",
    );
    fireEvent.click(screen.getByRole("button", { name: /^medieval$/i }));
    expect(screen.getByText(/esta era ainda está sendo montada/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /todas as eras/i }));
    fireEvent.click(screen.getByRole("button", { name: /abrir mapa de a caverna de platão/i }));
    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^explorar$/i })).not.toBeInTheDocument();
  });

  it("lets the student move through the learning platform", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /mapa do módulo/i }));
    expect(
      screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continuar lição/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/doxa");

    fireEvent.click(screen.getAllByRole("button", { name: /lição de casa/i })[0]);
    expect(
      screen.getByRole("heading", { name: /^lição de casa$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /dóxa em três perguntas/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /abrir perfil/i }));
    expect(
      screen.getByRole("heading", { name: /seu perfil acompanha/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ana nascimento/i })).toHaveAttribute(
      "aria-label",
      "Ana Nascimento",
    );
  });

  it("previews notifications before opening the full list", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /3 avisos não lidos/i }));
    expect(
      screen.getByRole("complementary", { name: /prévia dos avisos/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /3 novidades/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ver todos os avisos/i }));
    expect(screen.getByRole("heading", { name: /3 novidades/i })).toBeInTheDocument();
    expect(screen.getAllByRole("article", { name: /não lido/i })).toHaveLength(3);

    fireEvent.click(screen.getAllByRole("button", { name: /marcar como lido/i })[0]);

    expect(screen.getByRole("heading", { name: /2 novidades/i })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: /\. Lido$/ })).toBeInTheDocument();

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

  it("opens the library from the explore view query", async () => {
    window.history.pushState({}, "", "/inicio?view=explore");

    render(<StudentPortal />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /^biblioteca$/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /tales e a arché/i })).toHaveAttribute(
      "href",
      "/aula/tales/ola",
    );

    window.history.pushState({}, "", "/");
  });

  it("opens the coin trail from legacy trail URLs and library module map", async () => {
    window.history.pushState({}, "", "/inicio?view=trail");

    render(<StudentPortal />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /saindo da caverna/i, level: 1 }),
      ).toBeInTheDocument();
      expect(screen.getByRole("list", { name: /encontros de saindo da caverna/i })).toBeInTheDocument();
    });

    window.history.pushState({}, "", "/inicio?view=explore&module=presocratics");

    render(<StudentPortal />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /os primeiros pensadores/i, level: 1 }),
      ).toBeInTheDocument();
    });

    window.history.pushState({}, "", "/");
  });
});
