import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CavePrisonerWallScene } from "./cave-prisoner-wall-scene";

vi.mock("../use-story-scene-transition", () => ({
  useStorySceneTransition: () => ({
    phase: "idle",
    beginNavigation: vi.fn(),
    completeExit: vi.fn(),
  }),
}));

afterEach(cleanup);

it("places the learner beside the prisoners facing the wall", () => {
  render(<CavePrisonerWallScene />);

  expect(
    screen.getByRole("heading", {
      name: "Esta é a única vista que conhecem.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/as pessoas de quem falei estão presas, lado a lado/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/para elas, este é o mundo inteiro/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 3 de 10" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Olhar com elas" }),
  ).toHaveAttribute("href", "/aula/as-sombras/eles-dao-nomes");
});
