import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

it("lets Platão continue the descent as a short sequence of story beats", () => {
  render(<CavePrisonerWallScene />);

  expect(
    screen.getByRole("heading", { name: "Mais fundo na caverna" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/vamos mais fundo/i)).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 3 de 10" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(
    screen.getByText(/estão aqui desde crianças/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(
    screen.getByText(/uma parede iluminada e as sombras/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Chegar mais perto" }),
  ).toHaveAttribute("href", "/aula/as-sombras/eles-dao-nomes");
});
