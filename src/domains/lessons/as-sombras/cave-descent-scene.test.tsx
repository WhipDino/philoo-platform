import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CaveDescentScene } from "./cave-descent-scene";

vi.mock("../use-story-scene-transition", () => ({
  useStorySceneTransition: () => ({
    phase: "idle",
    beginNavigation: vi.fn(),
    completeExit: vi.fn(),
  }),
}));

afterEach(cleanup);

it("presents the approved descent beat without questioning the learner", () => {
  const { container } = render(<CaveDescentScene />);

  expect(
    screen.getByRole("heading", {
      name: "A luz fica para trás.",
      level: 2,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "A descida",
      level: 1,
    }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Cena 2 · A descida")).not.toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /platão guia você pela descida/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-descent-v1.png"),
  );
  expect(
    screen.getByText(/pessoas de quem falei/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/elas nunca puderam se virar/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/não lhes falta inteligência/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 2 de 10" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Chegar até elas" }),
  ).toHaveAttribute("href", "/aula/as-sombras/so-a-parede");
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Platão · A República, Livro VII"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /voltar/i }),
  ).toHaveAttribute("href", "/aula/as-sombras/primeira-tela");
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-width",
    "narrative",
  );
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
});
