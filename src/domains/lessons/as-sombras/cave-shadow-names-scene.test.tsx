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

  const sceneHeading = screen.getByRole("heading", {
    name: "O mundo na parede",
  });
  expect(sceneHeading).toBeInTheDocument();
  expect(screen.getByText("Cena 4 · O mundo na parede")).toBeInTheDocument();
  expect(screen.getByText(/tudo o que conseguem ver/i)).toBeInTheDocument();
  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("O mundo na parede", {
      selector: '[aria-current="step"]',
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("progressbar", { name: "Cena 4 de 10" }),
  ).not.toBeInTheDocument();
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
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
  expect(container.querySelector("[data-philoo-folio-voice]")).toBeInTheDocument();
  expect(container.querySelector("[data-scene-motif]")).not.toBeInTheDocument();
  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-guide-side", "start");
  expect(composition).toHaveAttribute("data-has-illustration", "true");
  expect(
    composition?.querySelector("[data-philoo-folio-voice]"),
  ).toBeInTheDocument();
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["illustration", "dialogue", "guide"]);
  expect(
    screen.getByRole("img", {
      name: "Três prisioneiros observam juntos as sombras na parede da caverna",
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-wall-observers-v5.png"),
  );
  expect(screen.getByRole("img", {
    name: /platão se abaixa para observar/i,
  })).toHaveAttribute(
    "src",
    expect.stringContaining("plato-observe-with-them-v1.png"),
  );

  const continueButton = screen.getByRole("button", { name: "Continuar" });
  continueButton.focus();
  fireEvent.click(continueButton);
  expect(screen.getByText(/eu reconheci primeiro/i)).toBeInTheDocument();
  expect(screen.getByText("Prisioneiro")).toBeInTheDocument();
  expect(container.querySelector('[data-tone="prisoner"]')).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: "Um prisioneiro aponta para a sombra de um pássaro na parede",
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-prisoner-bird-shadow-v5.png"),
  );
  expect(screen.getByRole("img", {
    name: /platão se inclina com atenção/i,
  })).toHaveAttribute(
    "src",
    expect.stringContaining("plato-listening-prisoner-v1.png"),
  );
  expect(screen.getByRole("button", { name: "Continuar" })).toHaveFocus();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/parece ser o mais sábio/i)).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: "Os prisioneiros parabenizam quem reconheceu primeiro a sombra do pássaro",
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-prisoner-congratulated-v5.png"),
  );
  expect(screen.getByRole("img", {
    name: /platão reconhece com respeito/i,
  })).toHaveAttribute(
    "src",
    expect.stringContaining("plato-shadow-expert-v1.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(screen.getByText(/nunca viram o que as produz/i)).toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-narrative-composition]"),
  ).toHaveAttribute("data-has-illustration", "false");
  expect(container.querySelector("[data-story-panel]")).not.toBeInTheDocument();
  expect(screen.getByRole("img", {
    name: /platão liga com um gesto/i,
  })).toHaveAttribute(
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
