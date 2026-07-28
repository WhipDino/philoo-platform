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

// Production break caught: the scene can keep the old final-path language,
// replace the replayable demonstration with a static note, or leave the next
// lesson exposed after a learner returns a completed piece.
it("teaches the approved causal path and reverses scene completion", () => {
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
  expect(screen.getAllByText("Objeto").length).toBeGreaterThan(0);
  expect(
    screen.getByText("Posição 2", {
      selector: "[data-causal-destination-label]",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ver novamente" }),
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
  for (const hint of [
    "A fogueira produz a luz.",
    "O que a luz encontra pelo caminho?",
    "O que aparece quando a luz é bloqueada?",
    "O que as pessoas fazem quando reconhecem a forma?",
  ]) {
    expect(screen.getByText(hint)).toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 2, vazia" }),
  );
  expect(
    screen.getByRole("button", {
      name: "Posição 2, Objeto. Devolver peça",
    }),
  ).toHaveTextContent("Objeto");

  helpButton.focus();
  fireEvent.click(helpButton);
  expect(
    screen.getByRole("dialog", { name: "Monte o caminho da sombra" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Vamos montar" }));
  expect(helpButton).toHaveFocus();
  expect(
    screen.getByRole("button", {
      name: "Posição 2, Objeto. Devolver peça",
    }),
  ).toHaveTextContent("Objeto");

  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 3, vazia" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Nomeiam" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Posição 4, vazia" }),
  );

  expect(
    screen.getByRole("button", {
      name: "Posição 4, Nomeiam. Devolver peça",
    }),
  ).toHaveAccessibleDescription(
    "Elas nomeiam a forma que interpretam.",
  );
  expect(
    screen.getByRole("link", { name: /conhecer a dóxa/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/doxa");
  fireEvent.click(
    screen.getByRole("button", {
      name: "Posição 4, Nomeiam. Devolver peça",
    }),
  );
  expect(
    screen.queryByRole("link", { name: /conhecer a dóxa/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/placar|pontos|falhou|punição/i),
  ).not.toBeInTheDocument();
});
