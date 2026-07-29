import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { CaveDoxaScene } from "./cave-doxa-scene";

afterEach(cleanup);

// Production break caught: presenting the definition, image, and Plato at the
// same time overwhelms the learner instead of guiding one discovery at a time.
it("guides the learner through meaning, observation, reveal, and connection", () => {
  const { container } = render(<CaveDoxaScene />);

  expect(screen.getByRole("heading", { name: "Dóxa" })).toBeInTheDocument();
  expect(screen.getByText("δόξα")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /opinião ou crença/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/formada a partir de como algo aparece/i),
  ).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: /duas crianças/i })).not.toBeInTheDocument();
  expect(container.querySelector('[data-plato-pose="doxa"]')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /ver um exemplo/i }));

  expect(
    screen.getByText(/olhando apenas para este recorte/i),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-doxa-tap-cue]")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /revelar o quadro inteiro/i }),
  );

  expect(screen.getByText(/talvez tenha parecido/i)).toBeInTheDocument();
  expect(screen.getByText(/entregando o giz à outra/i)).toBeInTheDocument();
  expect(container.querySelector("[data-doxa-tap-cue]")).not.toBeInTheDocument();
  expect(container.querySelector('[data-plato-pose="doxa"]')).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /entender o que aconteceu/i }),
  );

  expect(container.querySelector('[data-plato-pose="doxa"]')).toBeInTheDocument();
  expect(screen.getByText(/isso é dóxa/i)).toBeInTheDocument();
  expect(
    screen.getByText(/os prisioneiros faziam o mesmo com as sombras/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /continuar a investigação/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-chegou-ate-eles");
  expect(
    screen.queryByText(/placar|pontos|acertou|errou|nota/i),
  ).not.toBeInTheDocument();
});

// Production break caught: children can miss a text-only reveal affordance,
// while a cue that reappears after use becomes distracting rather than helpful.
it("visually teaches the image click and then gets out of the way", () => {
  const { container } = render(<CaveDoxaScene />);

  fireEvent.click(screen.getByRole("button", { name: /ver um exemplo/i }));

  const cue = container.querySelector("[data-doxa-tap-cue]");
  expect(cue).toBeInTheDocument();
  expect(cue).toHaveAttribute("aria-hidden", "true");

  fireEvent.click(
    screen.getByRole("button", { name: /revelar o quadro inteiro/i }),
  );

  expect(
    container.querySelector("[data-doxa-tap-cue]"),
  ).not.toBeInTheDocument();
});

// Production break caught: swapping in a generated "answer" image would make
// the reveal dishonest instead of exposing more of the accepted source frame.
it("reveals omitted context from the same accepted event frame", () => {
  render(<CaveDoxaScene />);

  fireEvent.click(screen.getByRole("button", { name: /ver um exemplo/i }));

  const frame = screen.getByRole("img", {
    name: /um instante de um acontecimento/i,
  });
  expect(frame.getAttribute("src")).toContain("cave-cropped-event-v1.webp");

  const reveal = screen.getByRole("button", {
    name: /revelar o quadro inteiro/i,
  });

  fireEvent.click(reveal);

  expect(
    screen.getByRole("img", {
      name: /duas crianças sorrindo/i,
    }),
  ).toBe(frame);
  expect(
    screen.getByText(/uma criança estava entregando o giz à outra/i),
  ).toBeInTheDocument();
});

it("keeps exactly one active learning moment in the stage", () => {
  const { container } = render(<CaveDoxaScene />);
  const stage = container.querySelector("[data-doxa-stage]");

  expect(container.querySelectorAll("[data-doxa-moment]")).toHaveLength(1);
  expect(stage).toHaveAttribute("data-moment", "meaning");

  fireEvent.click(screen.getByRole("button", { name: /ver um exemplo/i }));
  expect(container.querySelectorAll("[data-doxa-moment]")).toHaveLength(1);
  expect(stage).toHaveAttribute("data-moment", "observe");

  fireEvent.click(
    screen.getByRole("button", { name: /revelar o quadro inteiro/i }),
  );
  expect(container.querySelectorAll("[data-doxa-moment]")).toHaveLength(1);
  expect(stage).toHaveAttribute("data-moment", "reveal");

  fireEvent.click(
    screen.getByRole("button", { name: /entender o que aconteceu/i }),
  );
  expect(container.querySelectorAll("[data-doxa-moment]")).toHaveLength(1);
  expect(stage).toHaveAttribute("data-moment", "connect");
});

// Production break caught: browser-only state or image behavior can make the
// public route fail before hydration.
it("server-renders the vocabulary artifact", () => {
  expect(() => renderToString(<CaveDoxaScene />)).not.toThrow();
});
