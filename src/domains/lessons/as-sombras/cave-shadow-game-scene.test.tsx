import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CaveShadowGameScene } from "./cave-shadow-game-scene";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("randomizes the answer order when the activity begins", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);

  render(<CaveShadowGameScene />);
  fireEvent.click(screen.getByRole("button", { name: "Começar o jogo" }));

  const choices = within(
    screen.getByRole("group", { name: /escolha o nome da sombra/i }),
  )
    .getAllByRole("button")
    .map((button) => button.textContent);

  expect(choices).toEqual(["Cavalo", "Jarro", "Pássaro"]);
});

it("lets the learner experience the prisoners' successful shadow game", () => {
  const { container } = render(<CaveShadowGameScene />);

  expect(
    screen.getByRole("dialog", { name: "Reconheça as sombras" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Começar o jogo" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ver instruções" }),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
  expect(
    container.querySelector('[data-shadow-game-layout="viewport-fit"]'),
  ).toBeInTheDocument();
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
  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  expect(
    screen.getByText(/você reconheceu o pássaro/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Sombra de um pássaro na parede" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Próxima sombra" }));
  expect(
    screen.getByRole("img", { name: "Sombra de um jarro na parede" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Jarro" }));
  expect(
    screen.getByText(/você reconheceu o jarro/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Sombra de um jarro na parede" }),
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
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /olhar para trás/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-existe-atras");
});

it("keeps a missed recognition gentle and lets the learner try again", () => {
  render(<CaveShadowGameScene />);
  fireEvent.click(screen.getByRole("button", { name: "Começar o jogo" }));

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

it("reopens the shadow-game briefing without resetting the round", () => {
  const { container } = render(<CaveShadowGameScene />);
  fireEvent.click(screen.getByRole("button", { name: "Começar o jogo" }));
  fireEvent.click(screen.getByRole("button", { name: "Pássaro" }));
  fireEvent.click(screen.getByRole("button", { name: "Próxima sombra" }));

  const help = screen.getByRole("button", { name: "Ver instruções" });
  fireEvent.click(help);
  expect(
    screen.getByRole("dialog", { name: "Reconheça as sombras" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Voltar ao jogo" }));

  expect(
    screen.getByRole("img", { name: "Sombra de um jarro na parede" }),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
});
