import {
  cleanup,
  render,
  screen,
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
    screen.queryByText("Cena 1 · O começo da história"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/pessoas vivem presas desde crianças/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Platão · A República, Livro VII"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 1 de 10" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Descer comigo" }),
  ).toHaveAttribute("href", "/aula/as-sombras/a-descida");
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-width",
    "narrative",
  );
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-welcome-v2.png"),
  );
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
