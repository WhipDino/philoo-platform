import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PhilooDialogueCard } from "./philoo-dialogue-card";
import { PhilooStoryShell } from "./philoo-story-shell";
import { getPlatoPose } from "./plato-pose-catalog";
import { PlatoGuide } from "./plato-guide";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

it("resolves a semantic Platão pose with contextual alternative text", () => {
  expect(getPlatoPose("first-wall-reveal")).toEqual({
    src: "/images/story/plato-first-wall-reveal-v1.png",
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
    expect.stringContaining("plato-first-wall-reveal-v1.png"),
  );
  expect(screen.getByRole("img")).toHaveAttribute("data-stage-beat", "2");
  expect(screen.getByLabelText("Fala 2 de 3")).toBeInTheDocument();
});
