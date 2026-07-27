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
  const { container } = render(<CavePrisonerWallScene />);

  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Cena 3 · Mais fundo")).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-width",
    "narrative",
  );
  expect(screen.getByText(/vamos mais fundo/i)).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 3 de 10" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "0");
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-deeper-entrance-fades-v1.png"),
  );

  const continueButton = screen.getByRole("button", { name: "Continuar" });
  continueButton.focus();
  fireEvent.click(continueButton);
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "1");
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-prisoners-empathy-v1.png"),
  );
  expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();
  expect(
    screen.getByText(/estão aqui desde crianças/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-first-wall-reveal-v1.png"),
  );
  expect(
    screen.getByText(/uma parede iluminada e as sombras/i),
  ).toBeInTheDocument();
  const finalAction = screen.getByRole("link", { name: "Chegar mais perto" });
  expect(finalAction).toHaveAttribute(
    "href",
    "/aula/as-sombras/eles-dao-nomes",
  );
  expect(finalAction).toHaveFocus();
});
