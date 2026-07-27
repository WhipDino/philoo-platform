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
  const { container } = render(<CaveShadowNamesScene />);

  expect(
    screen.getByRole("heading", { name: "O mundo na parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/tudo o que conseguem ver/i)).toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Cena 4 de 10" }),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-philoo-story-shell]")).toBeInTheDocument();
  expect(container.querySelector('img[src*="cave-shadow-game"]')).not.toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-observe-with-them-v1.png"),
  );

  const continueButton = screen.getByRole("button", { name: "Continuar" });
  continueButton.focus();
  fireEvent.click(continueButton);
  expect(screen.getByText(/eu reconheci primeiro/i)).toBeInTheDocument();
  expect(screen.getByText("Prisioneiro")).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-listening-prisoner-v1.png"),
  );
  expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/parece ser o mais sábio/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-shadow-expert-v1.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/nunca viram o que as produz/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-appearance-source-v1.png"),
  );
  const finalAction = screen.getByRole("link", {
    name: "Observar as sombras",
  });
  expect(finalAction).toHaveAttribute(
    "href",
    "/aula/as-sombras/o-que-chegou-ate-eles",
  );
  expect(finalAction).toHaveFocus();
});
