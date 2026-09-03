import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ORetornoScene } from "./o-retorno-scene";
import { O_RETORNO_SCENE_META } from "./o-retorno-content";
import {
  O_RETORNO_JOURNEY_STAGES,
  type ORetornoSceneId,
} from "./o-retorno-journey";

afterEach(cleanup);

const ALL_SCENE_IDS = O_RETORNO_JOURNEY_STAGES.flatMap(
  (stage) => stage.sceneIds,
) as readonly ORetornoSceneId[];

function continueStory(name: RegExp = /^continuar/i) {
  fireEvent.click(screen.getByRole("button", { name }));
}

describe("O Retorno — every scene renders its own narrator title", () => {
  it.each(ALL_SCENE_IDS)("renders the %s scene without crashing", (sceneId) => {
    render(<ORetornoScene sceneId={sceneId} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: O_RETORNO_SCENE_META[sceneId].title,
      }),
    ).toBeVisible();
  });

  it("tells the story in six stages, closing the Cave trilogy", () => {
    expect(O_RETORNO_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
      "na-boca",
      "katabainein",
      "a-escuridao",
      "jogos-de-sombra",
      "a-divida",
      "a-descida",
    ]);
  });
});

describe("O Retorno — na boca da caverna", () => {
  it("recaps the last lesson and moves into aletheia", () => {
    const { container } = render(<ORetornoScene sceneId="na-boca" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /na lição passada, ele saiu da caverna/i,
      }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /ele ficou inseguro/i,
      }),
    ).toBeVisible();

    continueStory();
    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /boca da caverna/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /ouvir o nome disso/i }),
    ).toHaveAttribute("href", "/aula/o-retorno/katabainein");
  });
});

describe("O Retorno — aletheia concept insert", () => {
  it("names the covered truth after the story showed the return, with the concept tone", () => {
    const { container } = render(<ORetornoScene sceneId="katabainein" />);

    expect(container.querySelector("[data-folio-moment]")).toHaveAttribute(
      "data-folio-moment",
      "concept",
    );
    expect(screen.getByText(/ἀλήθεια/i)).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: /isso tem um nome: aletheia/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /não é só entrar de novo/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("link", { name: /ver o que a escuridão custa/i }),
    ).toHaveAttribute("href", "/aula/o-retorno/a-escuridao");
  });
});

describe("O Retorno — a escuridão de voltar (EX-10 dual lens)", () => {
  it("hides Continuar until the student compares both lenses and answers correctly", () => {
    render(<ORetornoScene sceneId="a-escuridao" />);

    continueStory();
    continueStory();
    continueStory(/ver com os próprios olhos/i);

    fireEvent.click(screen.getByRole("button", { name: "Começar a ver" }));

    expect(
      screen.queryByRole("link", { name: /^continuar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^continuar/i }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("slider", { name: /comparar as duas lentes/i }),
      { target: { value: "100" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver perguntas" }));
    fireEvent.click(
      screen.getByRole("button", { name: /o olho precisa de tempo/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByText(/isso mesmo/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /^continuar/i }),
    ).toHaveAttribute("href", "/aula/o-retorno/jogos-de-sombra");
  });
});

describe("O Retorno — os jogos de sombra (EX-06 evidence-to-model)", () => {
  it("unlocks retry immediately on a miss and hides Continuar until the right model is picked", () => {
    render(<ORetornoScene sceneId="jogos-de-sombra" />);

    continueStory();
    continueStory();
    continueStory(/avaliar a evidência/i);

    fireEvent.click(
      screen.getAllByRole("button", { name: /avaliar a evidência/i })[0],
    );

    expect(
      screen.queryByRole("link", { name: /seguir a história/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /ele ficou burro/i }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(screen.getByText(/ainda não é isso/i)).toBeVisible();
    expect(
      screen.queryByRole("link", { name: /seguir a história/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", {
        name: /ele perdeu a prática de nomear sombras rápido/i,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByText(/você acertou/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /seguir a história/i }),
    ).toHaveAttribute("href", "/aula/o-retorno/a-divida");
  });
});

describe("O Retorno — o medo e a obrigação (EX-11 decision layers)", () => {
  it("returns only the misplaced layer and hides Continuar until the weight order is right", () => {
    render(<ORetornoScene sceneId="a-divida" />);

    continueStory();
    continueStory(/empilhar os motivos/i);

    fireEvent.click(
      screen.getAllByRole("button", { name: /empilhar os motivos/i })[0],
    );

    expect(
      screen.queryByRole("link", { name: /fechar o mito/i }),
    ).not.toBeInTheDocument();

    function placeIntoNextOpenSlot(cardLabel: RegExp) {
      fireEvent.click(screen.getByRole("button", { name: cardLabel }));
      fireEvent.click(
        screen.getAllByRole("button", { name: /solte aqui/i })[0],
      );
    }

    placeIntoNextOpenSlot(/trazer a verdade para os amigos/i);
    placeIntoNextOpenSlot(/a vontade de reencontrar os amigos/i);
    placeIntoNextOpenSlot(/o custo de ver de novo no escuro/i);
    fireEvent.click(screen.getByRole("button", { name: "Conferir" }));

    expect(screen.getByText(/trazer a verdade pesa mais/i)).toBeVisible();
    expect(
      screen.queryByRole("link", { name: /fechar o mito/i }),
    ).not.toBeInTheDocument();

    placeIntoNextOpenSlot(/a vontade de reencontrar os amigos/i);
    placeIntoNextOpenSlot(/o custo de ver de novo no escuro/i);
    placeIntoNextOpenSlot(/trazer a verdade para os amigos/i);
    fireEvent.click(screen.getByRole("button", { name: "Conferir" }));

    expect(screen.getByText(/o medo não some/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /fechar o mito/i }),
    ).toHaveAttribute("href", "/aula/o-retorno/a-descida");
  });
});

describe("O Retorno — a descida closes the trilogy", () => {
  it("closes the story, names the myth, names philosophy, and sends the student to /inicio", () => {
    render(<ORetornoScene sceneId="a-descida" />);

    expect(
      screen.getByRole("heading", { level: 2, name: /mesmo com medo, ele falou/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /esse foi o mito da caverna/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /eu sou platão/i }),
    ).toBeVisible();
    expect(screen.getByText(/a república/i)).toBeVisible();

    continueStory();
    expect(screen.getByText(/philosophia/i)).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /buscar a verdade é o bem/i,
      }),
    ).toBeVisible();

    continueStory();

    expect(screen.getByText(/\+100 pontos de descoberta/i)).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: /você conquistou o retorno/i }),
    ).toBeVisible();
    expect(screen.getByText(/amor de saber/i)).toBeVisible();
    expect(
      screen.queryByText(/podem ser morto/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /voltar ao meu caminho/i }),
    ).toHaveAttribute("href", "/inicio");
  });
});
