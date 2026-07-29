import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { CaveDoxaScene } from "./cave-doxa-scene";

afterEach(cleanup);

// Production break caught: the vocabulary artifact can lose its philosophical
// definition, its Cave connection, or turn the learner's reveal into a score.
it("names, explains, and applies dóxa without grading the learner", () => {
  const { container } = render(<CaveDoxaScene />);

  expect(screen.getByRole("heading", { name: "Dóxa" })).toBeInTheDocument();
  expect(screen.getByText("δόξα")).toBeInTheDocument();
  expect(
    screen.getByText(/opinião ou crença formada/i),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-plato-pose="doxa"]'),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      /uma imagem pode ser verdadeira e ainda assim incompleta/i,
    ),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /testar essa diferença/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /ver o que ficou fora/i }),
  );

  expect(
    screen.getByText(/no recorte, parecia que as crianças disputavam o giz/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/os prisioneiros faziam o mesmo com as sombras/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /testar essa diferença/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-chegou-ate-eles");
  expect(
    screen.queryByText(/placar|pontos|acertou|errou|nota/i),
  ).not.toBeInTheDocument();
});

// Production break caught: children can miss a text-only reveal affordance,
// while a cue that reappears after use becomes distracting rather than helpful.
it("visually teaches the image click once and then gets out of the way", () => {
  const { container } = render(<CaveDoxaScene />);

  const cue = container.querySelector("[data-doxa-tap-cue]");
  expect(cue).toBeInTheDocument();
  expect(cue).toHaveAttribute("aria-hidden", "true");

  fireEvent.click(
    screen.getByRole("button", { name: /ver o que ficou fora/i }),
  );

  expect(
    container.querySelector("[data-doxa-tap-cue]"),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /voltar ao recorte/i }));

  expect(
    container.querySelector("[data-doxa-tap-cue]"),
  ).not.toBeInTheDocument();
});

// Production break caught: swapping in a generated "answer" image would make
// the reveal dishonest instead of exposing more of the accepted source frame.
it("reveals omitted context from the same accepted event frame", () => {
  render(<CaveDoxaScene />);

  const frame = screen.getByRole("img", {
    name: /um instante de um acontecimento/i,
  });
  expect(frame.getAttribute("src")).toContain("cave-cropped-event-v1.webp");

  const reveal = screen.getByRole("button", {
    name: /ver o que ficou fora/i,
  });
  expect(reveal).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(reveal);

  expect(reveal).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("img", {
      name: /um instante de um acontecimento/i,
    }),
  ).toBe(frame);
  expect(
    screen.getByText(/uma estava entregando o giz à outra/i),
  ).toBeInTheDocument();
});

// Production break caught: browser-only state or image behavior can make the
// public route fail before hydration.
it("server-renders the vocabulary artifact", () => {
  expect(() => renderToString(<CaveDoxaScene />)).not.toThrow();
});
