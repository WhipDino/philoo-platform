import {
  cleanup,
  fireEvent,
  render,
  screen,
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

  expect(storyPath).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).not.toHaveAttribute("data-folio-chapter-tab");
  expect(
    screen.queryByRole("list", { name: "Caminho nesta cena" }),
  ).not.toBeInTheDocument();
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
  expect(screen.getByText("Capítulo 3 · Quem vive aqui")).toBeInTheDocument();
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
    screen.getByText("Quem vive aqui", {
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
    expect.stringContaining("plato-deeper-entrance-fades-v2.png"),
  );

  const continueButton = screen.getByRole("button", { name: "Continuar" });
  continueButton.focus();
  fireEvent.click(continueButton);
  const secondBeatPlato = screen
    .getAllByRole("img")
    .find((image) => image.getAttribute("data-stage-beat") === "1");
  expect(secondBeatPlato).toHaveAttribute("data-stage-beat", "1");
  expect(secondBeatPlato).toHaveAttribute(
    "src",
    expect.stringContaining("plato-prisoners-empathy-v2.png"),
  );
  expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();
  expect(
    await screen.findByText(/desde crianças, elas vivem presas nesta posição/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/não conseguem virar o corpo nem a cabeça/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
  expect(await screen.findByText(/vamos mais fundo/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  const thirdBeatPlato = screen
    .getAllByRole("img")
    .find((image) => image.getAttribute("data-stage-beat") === "2");
  expect(thirdBeatPlato).toHaveAttribute("data-stage-beat", "2");
  expect(thirdBeatPlato).toHaveAttribute(
    "src",
    expect.stringContaining("plato-first-wall-reveal-v2.png"),
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
});

it("returns one internal moment at a time before leaving the chapter", () => {
  render(<CavePrisonerWallScene />);

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

  fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
  expect(
    screen.getByText(/desde crianças, elas vivem presas nesta posição/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
  expect(screen.getByText(/vamos mais fundo/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
    "href",
    "/aula/as-sombras/a-descida",
  );
});
