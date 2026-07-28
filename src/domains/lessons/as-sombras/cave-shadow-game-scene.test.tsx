import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveShadowGameScene } from "./cave-shadow-game-scene";

afterEach(cleanup);

it("lets the learner experience the prisoners' successful shadow game", () => {
  const { container } = render(<CaveShadowGameScene />);

  expect(
    screen.getByRole("heading", { name: "Jogue como eles" }),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-treatment",
    "folio",
  );
  expect(
    screen.getByRole("img", { name: "Sombra de um pássaro na parede" }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-shadow-recognition-set-v1.webp"),
  );
  expect(
    screen.getByRole("img", {
      name: /platão se abaixa para observar/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-observe-with-them-v2.png"),
  );
  expect(
    screen.queryByRole("img", {
      name: /platão reconhece com alegria o acerto/i,
    }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  expect(
    screen.getByText(/você reconheceu o pássaro/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /platão reconhece com alegria o acerto/i,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Sombra de um pássaro na parede" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Próxima sombra" }));
  expect(
    screen.getByRole("img", { name: "Sombra de uma ânfora na parede" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Ânfora" }));
  expect(
    screen.getByText(/você reconheceu a ânfora/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Sombra de uma ânfora na parede" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Próxima sombra" }));
  expect(
    screen.getByRole("img", { name: "Sombra de um cavalo na parede" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Cavalo" }));
  expect(
    screen.getByText(/você reconheceu o cavalo/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Sombra de um cavalo na parede" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/você aprendeu o jogo da parede/i),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Ouvir a pergunta" }));
  expect(
    screen.getByText(/você aprendeu o jogo da parede/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/isso significa que sabe o que a produziu/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /platão levanta um dedo com gentileza/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-curious-interruption-v1.png"),
  );
  expect(
    screen.getByRole("link", { name: /olhar para trás/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-existe-atras");
});

it("keeps a missed recognition gentle and lets the learner try again", () => {
  render(<CaveShadowGameScene />);

  const missedChoice = screen.getByRole("button", { name: "Cavalo" });
  missedChoice.focus();
  fireEvent.click(missedChoice);

  expect(
    screen.getByRole("img", { name: "Sombra de um pássaro na parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/olhe mais uma vez/i)).toBeInTheDocument();
  expect(screen.queryByText(/placar|pontos|falhou|erro/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cavalo" })).toHaveFocus();

  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  expect(screen.queryByText(/olhe mais uma vez/i)).not.toBeInTheDocument();
  expect(screen.getByText(/você reconheceu o pássaro/i)).toBeInTheDocument();
});
