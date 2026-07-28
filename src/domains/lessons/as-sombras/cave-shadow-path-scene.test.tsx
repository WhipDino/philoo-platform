import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { CaveShadowPathScene } from "./cave-shadow-path-scene";

afterEach(cleanup);

// Production break caught: opening the portal during server rendering can
// reference `document` before the route reaches the browser.
it("server-renders the route before opening its client briefing", () => {
  expect(() => renderToString(<CaveShadowPathScene />)).not.toThrow();
});

// Production break caught: reopening instructions can recreate/reset the
// activity, and completing the path can expose the wrong lesson destination.
it("briefs first, preserves work when reopened, and completes toward doxa", () => {
  const { container } = render(<CaveShadowPathScene />);

  expect(
    screen.getByRole("dialog", { name: "Monte o caminho da sombra" }),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Descubra como uma coisa que ninguém vê termina virando um nome na parede.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Escolha uma peça.")).toBeInTheDocument();
  expect(
    screen.getByText("Coloque-a na próxima parte do caminho."),
  ).toBeInTheDocument();
  expect(
    document.querySelector('[data-plato-pose="causal-path"]'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Vamos montar" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-plato-pose]"),
  ).not.toBeInTheDocument();
  const helpButton = screen.getByRole("button", { name: "Como jogar" });
  expect(helpButton).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Objeto" })).toHaveFocus();
  expect(
    screen.queryByRole("link", { name: /conhecer a dóxa/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 2, vazia" }),
  );
  expect(
    screen.getByRole("button", { name: "Posição 2, Objeto" }),
  ).toHaveTextContent("Objeto");

  helpButton.focus();
  fireEvent.click(helpButton);
  expect(
    screen.getByRole("dialog", { name: "Monte o caminho da sombra" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Vamos montar" }));
  expect(helpButton).toHaveFocus();
  expect(
    screen.getByRole("button", { name: "Posição 2, Objeto" }),
  ).toHaveTextContent("Objeto");

  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 3, vazia" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 4, vazia" }),
  );

  expect(
    screen.getByRole("link", { name: /conhecer a dóxa/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/doxa");
  expect(screen.queryByText(/placar|pontos|falhou|punição/i)).not.toBeInTheDocument();
});
