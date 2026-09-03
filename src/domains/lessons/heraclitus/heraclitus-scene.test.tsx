import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HERACLITUS_CLASSIFICATION_CONFIG } from "./heraclitus-classification-config";
import {
  HERACLITUS_FOLIO_BEATS,
  HERACLITUS_SCENE_META,
} from "./heraclitus-content";
import {
  HERACLITUS_JOURNEY_STAGES,
  type HeraclitusSceneId,
} from "./heraclitus-journey";
import { HeraclitusScene } from "./heraclitus-scene";

afterEach(cleanup);

const ALL_SCENE_IDS = HERACLITUS_JOURNEY_STAGES.flatMap(
  (stage) => stage.sceneIds,
) as readonly HeraclitusSceneId[];

function continueStory(name: RegExp = /^continuar/i) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function dismissBriefing(startLabel: RegExp) {
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: startLabel }));
}

function finishClassification() {
  fireEvent.click(
    screen.getByRole("button", { name: /separar as frases do rio/i }),
  );

  const placements = [
    ["A pedra do cais parece parada.", /^aparência\b/i],
    ["De longe o templo parece fixo.", /^aparência\b/i],
    ["Ainda chamamos de rio Caystro.", /^ainda o mesmo\b/i],
    ["É o mesmo leito de pedra.", /^ainda o mesmo\b/i],
    ["Estas águas nunca passaram aqui antes.", /^o que flui\b/i],
    ["Quem entra duas vezes encontra água nova.", /^o que flui\b/i],
  ] as const;

  for (const [card, basket] of placements) {
    fireEvent.click(screen.getByRole("button", { name: card }));
    fireEvent.click(screen.getByRole("button", { name: basket }));
  }

  fireEvent.click(screen.getByRole("button", { name: /^conferir$/i }));
}

function studentCopy() {
  return `${JSON.stringify(HERACLITUS_FOLIO_BEATS)}${JSON.stringify(HERACLITUS_CLASSIFICATION_CONFIG)}${JSON.stringify(HERACLITUS_SCENE_META)}`;
}

describe("Heráclito de Éfeso — every scene renders its own title", () => {
  it.each(ALL_SCENE_IDS)("renders the %s scene without crashing", (sceneId) => {
    render(<HeraclitusScene sceneId={sceneId} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: HERACLITUS_SCENE_META[sceneId].title,
      }),
    ).toBeVisible();
  });

  it("tells the story in six stages, with Heráclito as the guide", () => {
    expect(HERACLITUS_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
      "ola",
      "efeso",
      "o-rio",
      "panta-rhei",
      "praticar",
      "fecho",
    ]);
  });

  it("keeps student copy without em dashes and without Plato narrating", () => {
    const copy = studentCopy();
    expect(copy).not.toMatch(/\u2014/);
    expect(copy).not.toMatch(/Platão te acompanha|Eu sou Platão/);
    expect(HERACLITUS_CLASSIFICATION_CONFIG).not.toHaveProperty("guide");
  });
});

describe("Heráclito — praticar (EX-05 then EX-06)", () => {
  it("hides Continuar on classification until the three baskets are right", () => {
    render(<HeraclitusScene sceneId="praticar" />);

    continueStory(/separar as frases/i);
    dismissBriefing(/^separar as frases$/i);

    expect(
      screen.queryByRole("button", { name: /^continuar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^continuar/i }),
    ).not.toBeInTheDocument();

    finishClassification();
    expect(screen.getByText(/você separou os três/i)).toBeVisible();
    continueStory();

    expect(
      screen.getByRole("heading", { level: 2, name: /dois jeitos de ouvir/i }),
    ).toBeVisible();
  });

  it("unlocks retry on a miss and hides Continuar until the right river model is picked", () => {
    render(<HeraclitusScene sceneId="praticar" />);

    continueStory(/separar as frases/i);
    dismissBriefing(/^separar as frases$/i);
    finishClassification();
    continueStory();
    continueStory(/escolher um jeito/i);
    dismissBriefing(/escolher um jeito/i);

    const folioPage = () =>
      document.querySelector(
        "[data-philoo-folio-stage] [data-has-footer]",
      ) as HTMLElement;

    expect(folioPage()).toHaveAttribute("data-has-footer", "false");

    fireEvent.click(
      screen.getByRole("radio", {
        name: /é literalmente a mesma água parada no lugar/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(screen.getByText(/ainda não é isso/i)).toBeVisible();
    expect(folioPage()).toHaveAttribute("data-has-footer", "false");

    fireEvent.click(
      screen.getByRole("radio", {
        name: /o mesmo nome e leito, mas águas sempre novas/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByText(/você acertou/i)).toBeVisible();
    expect(folioPage()).toHaveAttribute("data-has-footer", "true");
    expect(
      within(
        document.querySelector("[data-philoo-folio-stage]") as HTMLElement,
      ).getByRole("link", { name: /e o que fica/i }),
    ).toHaveAttribute("href", "/aula/heraclitus/fecho");
  });
});

describe("Heráclito — fecho (hook, reward)", () => {
  it("closes with an open question and sends the student to /inicio", () => {
    render(<HeraclitusScene sceneId="fecho" />);

    expect(
      screen.getByRole("heading", { level: 2, name: /e o que fica/i }),
    ).toBeVisible();

    continueStory();
    expect(screen.getByText(/panta rhei fica comigo como nome/i)).toBeVisible();
    continueStory();

    expect(screen.getByText(/\+100 pontos de descoberta/i)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /você conquistou heráclito de éfeso/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /voltar ao meu caminho/i }),
    ).toHaveAttribute("href", "/inicio");
  });
});
