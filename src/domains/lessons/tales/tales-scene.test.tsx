import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TALES_CLASSIFICATION_CONFIG } from "./tales-classification-config";
import { TALES_FOLIO_BEATS, TALES_SCENE_META } from "./tales-content";
import { TALES_JOURNEY_STAGES, type TalesSceneId } from "./tales-journey";
import { TalesScene } from "./tales-scene";

afterEach(cleanup);

const ALL_SCENE_IDS = TALES_JOURNEY_STAGES.flatMap(
  (stage) => stage.sceneIds,
) as readonly TalesSceneId[];

function continueStory(name: RegExp = /^continuar/i) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function dismissBriefing(startLabel: RegExp) {
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: startLabel }));
}

function finishClassification() {
  fireEvent.click(
    screen.getByRole("button", { name: /separar as frases do porto/i }),
  );

  const placements = [
    ["A ânfora está seca por fora.", /^cara\b/i],
    ["No cais as coisas mudam de cara.", /^cara\b/i],
    ["De que tudo isso é, no fundo?", /^pergunta\b/i],
    ["Existe um começo e um fundo comum?", /^pergunta\b/i],
    ["O princípio é a água.", /^resposta\b/i],
    ["A terra se apoia sobre água.", /^resposta\b/i],
  ] as const;

  for (const [card, basket] of placements) {
    fireEvent.click(screen.getByRole("button", { name: card }));
    fireEvent.click(screen.getByRole("button", { name: basket }));
  }

  fireEvent.click(screen.getByRole("button", { name: /^conferir$/i }));
}

function studentCopy() {
  return `${JSON.stringify(TALES_FOLIO_BEATS)}${JSON.stringify(TALES_CLASSIFICATION_CONFIG)}${JSON.stringify(TALES_SCENE_META)}`;
}

describe("Tales de Mileto — every scene renders its own title", () => {
  it.each(ALL_SCENE_IDS)("renders the %s scene without crashing", (sceneId) => {
    render(<TalesScene sceneId={sceneId} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: TALES_SCENE_META[sceneId].title,
      }),
    ).toBeVisible();
  });

  it("tells the story in six stages, with Tales as the guide", () => {
    expect(TALES_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
      "ola",
      "mileto",
      "o-principio",
      "arche",
      "tres-cestos",
      "o-um-e-os-muitos",
    ]);
  });

  it("keeps student copy without em dashes and without Plato narrating", () => {
    const copy = studentCopy();
    expect(copy).not.toMatch(/\u2014/);
    expect(copy).not.toMatch(/Platão te acompanha|Eu sou Platão/);
    expect(TALES_CLASSIFICATION_CONFIG).not.toHaveProperty("guide");
  });
});

describe("Tales — apresentação", () => {
  it("introduces Tales in the first person and opens the harbor", () => {
    render(<TalesScene sceneId="ola" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /olá, eu sou tales/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByText(/a primeira imagem não era o mundo inteiro/i),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /eu vim de mileto/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /ver o porto/i }),
    ).toHaveAttribute("href", "/aula/tales/mileto");
  });
});

describe("Tales — mileto", () => {
  it("shows the harbor panel, then the many faces of the quay", () => {
    const { container } = render(<TalesScene sceneId="mileto" />);

    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /porto de mileto/i })).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /parecem muitas/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /ouvir a pergunta/i }),
    ).toHaveAttribute("href", "/aula/tales/o-principio");
  });
});

describe("Tales — o princípio", () => {
  it("asks the common ground, names water, and shows earth on water", () => {
    const { container } = render(<TalesScene sceneId="o-principio" />);

    expect(
      screen.getByRole("heading", { level: 2, name: /um fundo comum/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /eu digo que é a água/i }),
    ).toBeVisible();

    continueStory();
    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(screen.getByText(/a terra se apoia sobre água/i)).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("link", { name: /ouvir o nome disso/i }),
    ).toHaveAttribute("href", "/aula/tales/arche");
  });
});

describe("Tales — arché concept insert", () => {
  it("names arché after the belief, with the concept tone and the lunch table", () => {
    const { container } = render(<TalesScene sceneId="arche" />);

    expect(container.querySelector("[data-folio-moment]")).toHaveAttribute(
      "data-folio-moment",
      "concept",
    );
    expect(screen.getByText(/ἀρχή/i)).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: /^arché$/i }),
    ).toBeVisible();
    expect(screen.getByText(/não é o nome da água/i)).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /no porto, um só princípio/i,
      }),
    ).toBeVisible();

    continueStory();
    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /separar as frases/i }),
    ).toHaveAttribute("href", "/aula/tales/tres-cestos");
  });
});

describe("Tales — três cestos (EX-05 then EX-06)", () => {
  it("hides Continuar on classification until the three baskets are right", () => {
    render(<TalesScene sceneId="tres-cestos" />);

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
      screen.getByRole("heading", { level: 2, name: /não é um copo/i }),
    ).toBeVisible();
  });

  it("unlocks retry on a miss and hides Continuar until the right water model is picked", () => {
    render(<TalesScene sceneId="tres-cestos" />);

    continueStory(/separar as frases/i);
    dismissBriefing(/^separar as frases$/i);
    finishClassification();
    continueStory();
    continueStory(/escolher um jeito/i);
    dismissBriefing(/escolher um jeito/i);

    expect(
      screen.queryByRole("link", { name: /ligar as caras/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: /tudo está molhado agora/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(screen.getByText(/ainda não é isso/i)).toBeVisible();
    expect(
      screen.queryByRole("link", { name: /ligar as caras/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", {
        name: /a água é origem e fundo, mesmo do que parece seco/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByText(/você acertou/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /ligar as caras/i }),
    ).toHaveAttribute("href", "/aula/tales/o-um-e-os-muitos");
  });
});

describe("Tales — o um e os muitos (EX-09, hook, reward)", () => {
  it("hides Continuar until the pairs match, then sends the student to /inicio", () => {
    render(<TalesScene sceneId="o-um-e-os-muitos" />);

    continueStory(/ligar os pares/i);
    dismissBriefing(/ligar os pares/i);

    expect(
      screen.queryByRole("button", { name: /^continuar/i }),
    ).not.toBeInTheDocument();

    const pairs = [
      ["Muitas caras no cais", "Variedade na superfície"],
      ["Um começo e um fundo", "A pergunta da arché"],
      ["Eu digo que é a água", "A resposta, não a pergunta"],
      ["Pão, fruta, suco", "A mesma forma agora"],
    ] as const;

    for (const [source, target] of pairs) {
      fireEvent.pointerDown(
        screen.getByRole("button", { name: `Ligar ${source}` }),
      );
      fireEvent.pointerUp(
        screen.getByRole("button", { name: `Conectar em ${target}` }),
      );
    }

    fireEvent.click(screen.getByRole("button", { name: /^conferir$/i }));
    expect(screen.getByText(/o gesto é o mesmo/i)).toBeVisible();
    continueStory();

    expect(
      screen.getByRole("heading", { level: 2, name: /se o fundo é um/i }),
    ).toBeVisible();
    continueStory();
    expect(screen.getByText(/você já pode levar a pergunta/i)).toBeVisible();
    continueStory();

    expect(screen.getByText(/\+100 pontos de descoberta/i)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /você conquistou tales de mileto/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /voltar ao meu caminho/i }),
    ).toHaveAttribute("href", "/inicio");
  });
});
