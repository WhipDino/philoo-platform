import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooDialogueCard } from "./philoo-dialogue-card";
import { PhilooStoryShell } from "./philoo-story-shell";
import { getPlatoPose } from "./plato-pose-catalog";
import { PlatoGuide } from "./plato-guide";

afterEach(cleanup);

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
