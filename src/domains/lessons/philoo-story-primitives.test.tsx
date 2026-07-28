import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooDialogueCard } from "./philoo-dialogue-card";
import { PhilooStoryPathStage } from "./philoo-story-path-stage";
import { PhilooStoryShell } from "./philoo-story-shell";
import { getPlatoPose } from "./plato-pose-catalog";
import { PlatoGuide } from "./plato-guide";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

it("renders one semantic Philoo story path with a normal masthead", () => {
  const { container } = render(
    <PhilooStoryPathStage
      eyebrow="Cena 3 · A descida"
      title="Mais fundo"
      titleId="story-path-title"
      context="Siga Platão até a parede"
      steps={[
        { id: "luz", label: "A luz fica para trás", kind: "story" },
        { id: "pessoas", label: "Quem vive aqui", kind: "lesson" },
        { id: "parede", label: "O mundo na parede", kind: "concept" },
      ]}
      currentStep={1}
      furthestStep={1}
      onStepSelect={vi.fn()}
      transitionKey={1}
      guide={<div>Platão guia</div>}
      speaker="Platão"
      action={<button type="button">Continuar</button>}
    >
      <p>É aqui embaixo.</p>
    </PhilooStoryPathStage>,
  );

  expect(
    screen.getByRole("heading", { name: "Mais fundo", level: 1 }),
  ).not.toHaveAttribute("data-folio-chapter-tab");
  expect(
    screen.getByRole("list", { name: "Caminho nesta cena" }),
  ).toBeInTheDocument();
  expect(screen.getByText("A luz fica para trás").closest("li")).toHaveAttribute(
    "data-story-step-state",
    "visited",
  );
  expect(screen.getByText("Quem vive aqui").closest("[aria-current]")).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(
    container.querySelector('[data-story-path-slot="guide"]'),
  ).toHaveTextContent("Platão guia");
  expect(
    container.querySelector('[data-story-path-slot="voice"]'),
  ).toHaveTextContent("É aqui embaixo.");
  const composition = container.querySelector(
    "[data-philoo-narrative-composition]",
  );
  expect(composition).toHaveAttribute("data-has-illustration", "false");
  expect(composition).toHaveAttribute("data-guide-side", "end");
  expect(
    Array.from(
      composition?.querySelectorAll("[data-narrative-slot]") ?? [],
    ).map((slot) => slot.getAttribute("data-narrative-slot")),
  ).toEqual(["dialogue", "guide"]);
  const moment = container.querySelector(
    '[data-story-path-slot="voice"]',
  )?.closest('[data-story-path-slot="moment"]');

  expect(moment).toHaveAttribute("data-story-transition-key", "1");
  expect(moment).toContainElement(
    container.querySelector('[data-story-path-slot="guide"]'),
  );
  expect(
    container.querySelector('[data-story-path-slot="action"]'),
  ).toContainElement(screen.getByRole("button", { name: "Continuar" }));
});

it("uses semantic icons and exposes only visited Story Path beats as controls", () => {
  const onStepSelect = vi.fn();
  const { container } = render(
    <PhilooStoryPathStage
      eyebrow="Cena 3 · A descida"
      title="Mais fundo"
      titleId="semantic-story-path-title"
      context="Siga Platão até a parede"
      steps={[
        { id: "luz", label: "A luz fica para trás", kind: "story" },
        { id: "pessoas", label: "Quem vive aqui", kind: "lesson" },
        { id: "parede", label: "O mundo na parede", kind: "concept" },
      ]}
      currentStep={1}
      furthestStep={1}
      onStepSelect={onStepSelect}
      transitionKey={1}
      guide={<span>Platão</span>}
      speaker="Platão"
      action={<button type="button">Continuar</button>}
    >
      <span>História</span>
    </PhilooStoryPathStage>,
  );

  expect(
    container.querySelector('[data-story-step-kind="story"] svg'),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-story-step-kind="lesson"] svg'),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-story-step-kind="concept"] svg'),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("list", { name: "Caminho nesta cena" })).queryByText(
      /^2$/,
    ),
  ).not.toBeInTheDocument();
  expect(
    within(screen.getByRole("list", { name: "Caminho nesta cena" })).queryByText(
      /^3$/,
    ),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Voltar para História: A luz fica para trás",
    }),
  );
  expect(onStepSelect).toHaveBeenCalledWith(0);

  expect(
    screen.queryByRole("button", { name: /Explicação: Quem vive aqui/ }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector(
      '[data-story-step-kind="concept"] [aria-disabled="true"]',
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Ideia: O mundo na parede/ }),
  ).not.toBeInTheDocument();
});

it("resolves a semantic Platão pose with contextual alternative text", () => {
  expect(getPlatoPose("first-wall-reveal")).toEqual({
    src: "/images/story/plato-v2/plato-first-wall-reveal-v2.png",
    alt: "Platão apresenta a parede iluminada com a mão aberta",
  });
});

it("renders the reusable Philoo story chrome as an accessible cream stage", () => {
  const { container } = render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="scene-title"
      phase="idle"
    >
      <h1 id="scene-title">Mais fundo</h1>
    </PhilooStoryShell>,
  );

  expect(screen.getByRole("link", { name: "Voltar" })).toHaveAttribute(
    "href",
    "/aula/as-sombras/a-descida",
  );
  expect(
    screen.getByRole("progressbar", { name: "Cena 3 de 10" }),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  expect(container.querySelector("[data-philoo-soft-frame]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

it("lets a story path own the main surface material without changing shell semantics", () => {
  const { container } = render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="folio-shell-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
    >
      <PhilooStoryPathStage
        eyebrow="Cena 3 · A descida"
        title="Mais fundo"
        titleId="folio-shell-title"
        context="Siga Platão até a parede"
        steps={[
          { id: "luz", label: "A luz fica para trás", kind: "story" },
        ]}
        currentStep={0}
        furthestStep={0}
        onStepSelect={vi.fn()}
        transitionKey={0}
        guide={<span>Platão</span>}
        speaker="Platão"
        action={<button type="button">Continuar</button>}
      >
        <span>História</span>
      </PhilooStoryPathStage>
    </PhilooStoryShell>,
  );

  const surface = container.querySelector("[data-philoo-story-shell]");

  expect(surface).toHaveAttribute("data-surface-treatment", "folio");
  expect(surface).toHaveAttribute("aria-labelledby", "folio-shell-title");
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
});

it("replaces numeric chrome with a persistent lesson journey when a scene opts in", () => {
  const { container } = render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="journey-scene-title"
      phase="idle"
      surfaceWidth="narrative"
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "so-a-parede",
        storageKey: "philoo:test:journey",
        stages: [
          {
            id: "convite",
            label: "O convite",
            sceneIds: ["primeira-tela"],
            href: "/aula/as-sombras/primeira-tela",
          },
          {
            id: "mundo-na-parede",
            label: "O mundo na parede",
            sceneIds: ["so-a-parede", "eles-dao-nomes"],
            href: "/aula/as-sombras/so-a-parede",
          },
          {
            id: "descoberta",
            label: "O que descobrimos",
            sceneIds: [],
            href: "/aula/as-sombras/descoberta",
          },
        ],
      }}
    >
      <h1 id="journey-scene-title">Mais fundo</h1>
    </PhilooStoryShell>,
  );

  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("progressbar", { name: "Cena 3 de 10" }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-journey-rail]"),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-philoo-journey-layout]")).toHaveAttribute(
    "data-journey-state",
    "expanded",
  );

  fireEvent.click(screen.getByRole("button", { name: "Recolher jornada" }));

  expect(container.querySelector("[data-philoo-journey-layout]")).toHaveAttribute(
    "data-journey-state",
    "collapsed",
  );
  expect(container.querySelector("[data-philoo-journey-rail]")).toHaveAttribute(
    "data-expanded",
    "false",
  );
  expect(window.sessionStorage.getItem("philoo:test:journey")).toBe(
    "collapsed",
  );
});

it("keeps compact numeric progress when the current scene is missing from its journey map", () => {
  render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={7}
      totalBeats={10}
      labelledBy="unmapped-scene-title"
      phase="idle"
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "cena-ainda-nao-mapeada",
        storageKey: "philoo:test:unmapped-journey",
        stages: [
          {
            id: "convite",
            label: "O convite",
            sceneIds: ["primeira-tela"],
            href: "/aula/as-sombras/primeira-tela",
          },
        ],
      }}
    >
      <h1 id="unmapped-scene-title">Cena sem etapa</h1>
    </PhilooStoryShell>,
  );

  expect(
    screen.getByRole("progressbar", { name: "Cena 7 de 10" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).not.toBeInTheDocument();
});

it("keeps the journey usable when browser storage is unavailable", () => {
  const getItem = vi
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(() => {
      throw new Error("storage unavailable");
    });

  expect(() =>
    render(
      <PhilooStoryShell
        backHref="/aula/as-sombras/a-descida"
        currentBeat={3}
        totalBeats={10}
        labelledBy="storage-scene-title"
        phase="idle"
        journey={{
          lessonTitle: "As Sombras",
          currentSceneId: "so-a-parede",
          storageKey: "philoo:test:unavailable-storage",
          stages: [
            {
              id: "mundo-na-parede",
              label: "O mundo na parede",
              sceneIds: ["so-a-parede"],
              href: "/aula/as-sombras/so-a-parede",
            },
          ],
        }}
      >
        <h1 id="storage-scene-title">Mais fundo</h1>
      </PhilooStoryShell>,
    ),
  ).not.toThrow();

  expect(
    screen.getByRole("button", { name: "Recolher jornada" }),
  ).toBeInTheDocument();
  getItem.mockRestore();
});

it("keeps the active pose and dialogue beat semantically synchronized", () => {
  render(
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="scene-title"
      phase="idle"
    >
      <h1 id="scene-title">Mais fundo</h1>
      <PhilooDialogueCard
        sceneLabel="Cena 3 · Mais fundo"
        speaker="Platão"
        currentBeat={2}
        totalBeats={3}
        action={<button type="button">Continuar</button>}
      >
        Logo adiante veremos a parede.
      </PhilooDialogueCard>
      <PlatoGuide pose="first-wall-reveal" stageBeat={2} priority />
    </PhilooStoryShell>,
  );

  expect(screen.getByRole("status")).toHaveTextContent(
    "Logo adiante veremos a parede.",
  );
  expect(screen.getByText("Platão")).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-first-wall-reveal-v2.png"),
  );
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
  expect(screen.getByLabelText("Fala 2 de 3")).toBeInTheDocument();
});
