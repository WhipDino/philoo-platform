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
      name: /platão reconhece com alegria o acerto/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-shadow-celebration-v1.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  expect(
    screen.getByRole("img", { name: "Sombra de uma ânfora na parede" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Ânfora" }));
  expect(
    screen.getByRole("img", { name: "Sombra de um cavalo na parede" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Cavalo" }));
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

  fireEvent.click(screen.getByRole("button", { name: "Cavalo" }));

  expect(
    screen.getByRole("img", { name: "Sombra de um pássaro na parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/olhe mais uma vez/i)).toBeInTheDocument();
  expect(screen.queryByText(/placar|pontos|falhou|erro/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  expect(
    screen.getByRole("img", { name: "Sombra de uma ânfora na parede" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/olhe mais uma vez/i)).not.toBeInTheDocument();
});
