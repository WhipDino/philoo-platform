import {
  cleanup,
  render,
  screen,
  within,
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

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-guide-side", "start");
  expect(composition).toHaveAttribute("data-has-illustration", "false");

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
  expect(screen.getByText("Cena 2 · A descida")).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /platão guia você pela descida/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("plato-descent-v2.png"),
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
  const journey = screen.getByRole("complementary", {
    name: "Sua jornada em As Sombras",
  });
  expect(
    within(journey).getByText("A descida"),
  ).toHaveAttribute("aria-current", "step");
  expect(
    screen.queryByRole("progressbar", { name: "Cena 2 de 10" }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
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
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-treatment",
    "folio",
  );
  expect(container.querySelector("[data-philoo-folio-stage]")).toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
});
