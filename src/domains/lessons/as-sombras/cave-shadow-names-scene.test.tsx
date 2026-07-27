import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CaveShadowNamesScene } from "./cave-shadow-names-scene";

vi.mock("../use-story-scene-transition", () => ({
  useStorySceneTransition: () => ({
    phase: "idle",
    beginNavigation: vi.fn(),
    completeExit: vi.fn(),
  }),
}));

afterEach(cleanup);

it("lets the learner witness how the prisoners turn shadows into knowledge", () => {
  render(<CaveShadowNamesScene />);

  expect(
    screen.getByRole("heading", { name: "O mundo na parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/tudo o que conseguem ver/i)).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 4 de 10" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/eu reconheci primeiro/i)).toBeInTheDocument();
  expect(screen.getByText("Prisioneiro")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/parece ser o mais sábio/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/nunca viram o que as produz/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Observar as sombras" }),
  ).toHaveAttribute("href", "/aula/as-sombras/o-que-chegou-ate-eles");
});
