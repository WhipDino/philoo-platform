import {
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CaveInvitationScene } from "./cave-invitation-scene";

vi.mock("../use-story-scene-transition", () => ({
  useStorySceneTransition: () => ({
    phase: "idle",
    beginNavigation: vi.fn(),
    completeExit: vi.fn(),
  }),
}));

afterEach(cleanup);

it("presents the approved invitation story beat", () => {
  const { container } = render(<CaveInvitationScene />);

  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-guide-side", "end");
  expect(composition).toHaveAttribute("data-has-illustration", "false");

  expect(
    screen.getByRole("heading", {
      name: "Venha comigo até uma caverna.",
      level: 2,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "O começo da história",
      level: 1,
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Capítulo 1 · O começo da história"),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/pessoas vivem presas desde crianças/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Platão · A República, Livro VII"),
  ).toBeInTheDocument();
  const journey = screen.getByRole("complementary", {
    name: "Sua jornada em As Sombras",
  });
  expect(
    within(journey).getByText("O começo da história"),
  ).toHaveAttribute("aria-current", "step");
  expect(
    screen.queryByRole("progressbar", { name: "Cena 1 de 10" }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Descer comigo" }),
  ).toHaveAttribute("href", "/aula/as-sombras/a-descida");
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
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-invitation-v3.png"),
  );
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
