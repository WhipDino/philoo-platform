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
  render(<CaveInvitationScene />);

  expect(
    screen.getByRole("heading", {
      name: "Venha comigo até uma caverna.",
    }),
  ).toBeInTheDocument();
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
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
