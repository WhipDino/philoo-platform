import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ASubidaScene } from "./a-subida-scene";
import { A_SUBIDA_SCENE_META } from "./a-subida-content";
import { A_SUBIDA_JOURNEY_STAGES, type ASubidaSceneId } from "./a-subida-journey";

afterEach(cleanup);

const ALL_SCENE_IDS = A_SUBIDA_JOURNEY_STAGES.flatMap(
  (stage) => stage.sceneIds,
) as readonly ASubidaSceneId[];

function continueStory() {
  fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
}

describe("A Subida — every beat renders its own narrator title", () => {
  it.each(ALL_SCENE_IDS)("renders the %s scene without crashing", (sceneId) => {
    render(<ASubidaScene sceneId={sceneId} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: A_SUBIDA_SCENE_META[sceneId].title,
      }),
    ).toBeVisible();
  });

  it("tells the story in six stages, with the word after he has seen outside", () => {
    expect(A_SUBIDA_JOURNEY_STAGES.map((stage) => stage.id)).toEqual([
      "depois-da-virada",
      "fogo-e-estatuas",
      "a-subida-dolorosa",
      "sombras-la-fora",
      "periagoge",
      "a-decisao",
    ]);
  });
});

describe("A Subida — opening", () => {
  it("recaps the new shadow once, then shows him turning", () => {
    const { container } = render(<ASubidaScene sceneId="depois-da-virada" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /na lição passada, apareceu uma sombra nova/i,
      }),
    ).toBeVisible();
    expect(container.querySelector("[data-story-panel]")).not.toBeInTheDocument();

    continueStory();

    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /olha para trás/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("cave-first-turn-cliffhanger-v1.png"),
    );
    expect(screen.getByText(/dois objetos/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /ver o que tinha atrás/i }),
    ).toHaveAttribute("href", "/aula/a-subida/fogo-e-estatuas");
  });
});

describe("A Subida — fire", () => {
  it("explains the fire once, without a second scene repeating the cause", () => {
    const { container } = render(<ASubidaScene sceneId="fogo-e-estatuas" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /atrás da parede havia um fogo/i,
      }),
    ).toBeVisible();
    expect(
      screen.queryByText(/a luz, o objeto, a parede/i),
    ).not.toBeInTheDocument();
    expect(container.querySelector("[data-story-panel]")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /e a outra luz/i }),
    ).toHaveAttribute("href", "/aula/a-subida/a-subida-dolorosa");
  });
});

describe("A Subida — climb", () => {
  it("follows the other light before the steep climb, without the cave pulling him", () => {
    render(<ASubidaScene sceneId="a-subida-dolorosa" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /depois do fogo, ele viu outro clarão/i,
      }),
    ).toBeVisible();
    expect(screen.getByText(/não era a fogueira/i)).toBeVisible();
    expect(screen.queryByText(/puxa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/alguém o arrasta/i)).not.toBeInTheDocument();

    continueStory();
    expect(
      screen.getByRole("img", { name: /feixe de luz/i }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /ele decidiu seguir aquela luz/i,
      }),
    ).toBeVisible();
    expect(screen.getByText(/ainda não sabia que ela vinha de fora/i)).toBeVisible();
    expect(screen.getByText(/a passagem era íngreme/i)).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("link", { name: /sair da caverna/i }),
    ).toHaveAttribute("href", "/aula/a-subida/sombras-la-fora");
  });
});

describe("A Subida — outside", () => {
  it("puts the painful light only after he leaves, then the real tree, skipping the cave-pool image", () => {
    const { container } = render(<ASubidaScene sceneId="sombras-la-fora" />);

    expect(
      screen.getByRole("heading", { level: 2, name: /ele saiu da caverna/i }),
    ).toBeVisible();
    expect(screen.getByText(/cobriu os olhos/i)).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("img", { name: /sai da boca da caverna/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("beat-08-o-sol-v1.png"),
    );

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /depois ele viu uma árvore de verdade/i,
      }),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("img", { name: /sol bate na árvore/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("beat-07-arvore-de-dia-v2.png"),
    );
    expect(
      screen.getByText(/a verdade é o objeto, não a sombra/i),
    ).toBeVisible();
    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /beira da água/i }),
    ).not.toBeInTheDocument();

    continueStory();
    fireEvent.click(screen.getByRole("button", { name: /vamos ligar/i }));
    expect(
      screen.getByText(/ligue o que ele viu/i),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /uma palavra para isso/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /uma palavra para isso/i }),
    ).not.toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: /ligar a luz do sol/i }));
    fireEvent.pointerUp(screen.getByRole("button", { name: /conectar em o que ilumina/i }));
    fireEvent.pointerDown(screen.getByRole("button", { name: /ligar a árvore/i }));
    fireEvent.pointerUp(
      screen.getByRole("button", { name: /conectar em a coisa de verdade/i }),
    );
    fireEvent.pointerDown(screen.getByRole("button", { name: /ligar a forma no chão/i }));
    fireEvent.pointerUp(screen.getByRole("button", { name: /conectar em só o recorte/i }));
    fireEvent.click(screen.getByRole("button", { name: /conferir ligações/i }));

    expect(screen.getByText(/tudo ligado/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /uma palavra para isso/i }),
    ).toHaveAttribute("href", "/aula/a-subida/periagoge");

    fireEvent.click(screen.getByRole("button", { name: /como jogar/i }));
    expect(screen.getByRole("dialog", { name: /ligue os nós/i })).toBeVisible();
  });
});

describe("A Subida — periagōgē concept insert", () => {
  it("names the gesture after the story showed it, with the concept tone", () => {
    const { container } = render(<ASubidaScene sceneId="periagoge" />);

    expect(container.querySelector("[data-folio-moment]")).toHaveAttribute(
      "data-folio-moment",
      "concept",
    );
    expect(container.querySelector("[data-philoo-folio-voice]")).toHaveAttribute(
      "data-tone",
      "concept",
    );
    expect(
      screen.getByText(/virar o olhar é sair do lugar antigo/i),
    ).toBeVisible();
    expect(screen.queryByText(/olho novo/i)).not.toBeInTheDocument();

    continueStory();
    expect(
      screen.getByRole("heading", { level: 2, name: /foi o que ele fez/i }),
    ).toBeVisible();
    expect(
      screen.getByText(/parou de olhar só a parede/i),
    ).toBeVisible();

    continueStory();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /isso ainda acontece com a gente/i,
      }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /ver um recorte/i }));
    expect(container.querySelector("[data-story-panel]")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /traseira do aparelho/i }),
    ).toBeVisible();
    expect(container.querySelector("[data-a-subida-crop]")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /e os outros/i }),
    ).toHaveAttribute("href", "/aula/a-subida/a-decisao");
  });
});

describe("A Subida — he thinks of going back", () => {
  it("wants to tell the others and is afraid they will laugh", () => {
    render(<ASubidaScene sceneId="a-decisao" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /ele pensou nos que ficaram/i,
      }),
    ).toBeVisible();

    continueStory();

    expect(
      screen.getByRole("heading", { level: 2, name: /mas ele tem medo/i }),
    ).toBeVisible();
    expect(screen.getByText(/e se rirem dele/i)).toBeVisible();
    expect(screen.queryByText(/essa pergunta fica aberta/i)).not.toBeInTheDocument();

    continueStory();
    fireEvent.click(screen.getByRole("button", { name: /vamos escolher/i }));
    expect(
      screen.getByText(/se ele voltar para contar o que viu/i),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /^continuar/i }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("radio", { name: /que o fogo apague/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /confirmar previsão/i }));
    expect(screen.getByText(/ainda não é isso/i)).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /tentar outra previsão/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /que riam dele e não acreditem/i }),
    ).toBeEnabled();
    fireEvent.click(
      screen.getByRole("radio", { name: /que riam dele e não acreditem/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /confirmar previsão/i }));
    expect(screen.getByText(/você acertou/i)).toBeVisible();
    expect(screen.queryByText(/teme o ridículo/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /tentar outra previsão/i }),
    ).not.toBeInTheDocument();

    continueStory();
    expect(screen.getByText(/a dúvida fica aqui/i)).toBeVisible();
    expect(screen.queryByText(/vai voltar/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /olha pensativo para a entrada/i }),
    ).toBeVisible();
    expect(screen.queryByText(/ele desce/i)).not.toBeInTheDocument();

    continueStory();
    expect(screen.getByText(/\+100 pontos de descoberta/i)).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: /olhar de fora/i }),
    ).toBeVisible();
    expect(screen.getByText(/você terminou a subida/i)).toBeVisible();
    expect(
      screen.getByRole("link", { name: /voltar ao meu caminho/i }),
    ).toHaveAttribute("href", "/inicio");
  });
});
