import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StudentPortal } from "./student-portal";

afterEach(cleanup);

describe("StudentPortal", () => {
  it("prioritizes the current lesson and links to the Story Folio journey", () => {
    render(<StudentPortal />);

    expect(
      screen.getByRole("heading", {
        name: /^as sombras$/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /platão na entrada da caverna/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continuar aula/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/doxa");
    expect(screen.getByRole("progressbar", { name: /progresso em as sombras/i })).toHaveAttribute(
      "aria-valuenow",
      "67",
    );
    expect(
      screen.getByRole("link", { name: /seguir para o capítulo 8/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/o-que-chegou-ate-eles");
    expect(
      screen.getByRole("button", { name: /abrir o seu caderno/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ver o que a professora pediu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^seu caminho$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/você está aqui/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /fazer agora/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/doxa");
    expect(screen.getByRole("button", { name: /^abrir o caderno$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^acesso rápido$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^biblioteca$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^caderno/i })).toBeInTheDocument();
  });

  it("opens the student library with the current cave group and resume card", () => {
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
    fireEvent.click(screen.getByRole("button", { name: /abrir meu caminho/i }));
    expect(
      screen.getByRole("heading", { name: /módulo 1 · o mito da caverna/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^explorar$/i })).not.toBeInTheDocument();
  });

  it("lets the student move through the learning platform", () => {
    render(<StudentPortal />);

    fireEvent.click(screen.getByRole("button", { name: /^meu caminho$/i }));
    expect(screen.getByRole("heading", { name: /módulo 1 · o mito da caverna/i })).toBeInTheDocument();
    expect(screen.getByText(/porta de entrada do philoo/i)).toBeInTheDocument();
    expect(screen.queryByText(/parou no meio da conversa/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /as 3 lições, em ordem/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^as sombras$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^a subida$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^o retorno$/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /retomar a conversa/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^retomar$/i })).toHaveAttribute(
      "href",
      "/aula/as-sombras/doxa",
    );
    expect(screen.queryByRole("button", { name: /ver próximas lições/i })).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /progresso da lição as sombras/i })).toHaveAttribute(
      "aria-valuenow",
      "67",
    );
    expect(screen.getByRole("progressbar", { name: /progresso da lição a subida/i })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByText(/módulo 2 · pré-socráticos/i)).toBeInTheDocument();
    expect(screen.queryByText(/você parou aqui/i)).not.toBeInTheDocument();

    const placeToggle = screen.getByRole("button", { name: /onde você está$/i });
    const placeWasOpen = placeToggle.getAttribute("aria-expanded") === "true";
    fireEvent.click(placeToggle);
    expect(placeToggle).toHaveAttribute("aria-expanded", placeWasOpen ? "false" : "true");

    fireEvent.click(screen.getAllByRole("button", { name: /lição de casa/i })[0]);
    expect(
      screen.getByRole("heading", { name: /o que marina pediu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /abrir as sombras/i }),
    ).toHaveAttribute("href", "/aula/as-sombras/doxa");

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

  it("opens Meu caminho from the view query used when leaving a lesson", async () => {
    window.history.pushState({}, "", "/inicio?view=journey");

    render(<StudentPortal />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /módulo 1/i }),
      ).toBeInTheDocument();
    });

    window.history.pushState({}, "", "/");
  });
});
