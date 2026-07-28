import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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

it("lets Platão continue the descent as a short sequence of story beats", async () => {
  const { container } = render(<CavePrisonerWallScene />);
  const storyPath = container.querySelector(
    "[data-philoo-story-path-stage]",
  );
  const path = screen.getByRole("list", { name: "Caminho nesta cena" });

  expect(storyPath).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).not.toHaveAttribute("data-folio-chapter-tab");
  expect(path).toBeInTheDocument();
  expect(
    within(path).getByText("A luz fica para trás").closest('[aria-current="step"]'),
  ).toHaveTextContent("A luz fica para trás");
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-treatment",
    "folio",
  );
  expect(
    container.querySelector('[data-story-path-slot="guide"]'),
  ).toContainElement(screen.getByRole("img"));
  expect(
    container.querySelector('[data-story-path-slot="voice"]'),
  ).toHaveTextContent(/vamos mais fundo/i);
  expect(
    container.querySelector('[data-story-path-slot="action"]'),
  ).toContainElement(screen.getByRole("button", { name: "Continuar" }));
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
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Mais fundo", {
      selector: '[aria-current="step"]',
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("progressbar", { name: "Cena 3 de 10" }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "0");
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-deeper-entrance-fades-v1.png"),
  );

  const continueButton = screen.getByRole("button", { name: "Continuar" });
  continueButton.focus();
  fireEvent.click(continueButton);
  expect(
    within(path).getByText("Quem vive aqui").closest('[aria-current="step"]'),
  ).toHaveTextContent("Quem vive aqui");
  const secondBeatPlato = screen
    .getAllByRole("img")
    .find((image) => image.getAttribute("data-stage-beat") === "1");
  expect(secondBeatPlato).toHaveAttribute("data-stage-beat", "1");
  expect(secondBeatPlato).toHaveAttribute(
    "src",
    expect.stringContaining("plato-prisoners-empathy-v1.png"),
  );
  expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();
  expect(
    await screen.findByText(/estão aqui desde crianças/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(
    within(path)
      .getByText("O mundo na parede")
      .closest('[aria-current="step"]'),
  ).toHaveTextContent("O mundo na parede");
  const thirdBeatPlato = screen
    .getAllByRole("img")
    .find((image) => image.getAttribute("data-stage-beat") === "2");
  expect(thirdBeatPlato).toHaveAttribute("data-stage-beat", "2");
  expect(thirdBeatPlato).toHaveAttribute(
    "src",
    expect.stringContaining("plato-first-wall-reveal-v1.png"),
  );
  expect(
    await screen.findByText(/uma parede iluminada e as sombras/i),
  ).toBeInTheDocument();
  const finalAction = screen.getByRole("link", { name: "Chegar mais perto" });
  expect(finalAction).toHaveAttribute(
    "href",
    "/aula/as-sombras/eles-dao-nomes",
  );
  expect(finalAction).toHaveFocus();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Voltar para História: A luz fica para trás",
    }),
  );

  expect(await screen.findByText(/vamos mais fundo/i)).toBeInTheDocument();
  const returnedPlato = screen
    .getAllByRole("img")
    .find((image) => image.getAttribute("data-stage-beat") === "0");
  expect(returnedPlato).toHaveAttribute("data-stage-beat", "0");

  expect(
    screen.getByRole("button", {
      name: "Voltar para Explicação: Quem vive aqui",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Voltar para Ideia: O mundo na parede",
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Voltar para Ideia: O mundo na parede",
    }),
  );
  expect(
    await screen.findByText(/uma parede iluminada e as sombras/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Chegar mais perto" }),
  ).toBeInTheDocument();
});
