import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ASubidaScene } from "./a-subida-scene";
import { A_SUBIDA_SCENE_META } from "./a-subida-content";
import { A_SUBIDA_JOURNEY_STAGES, type ASubidaSceneId } from "./a-subida-journey";

afterEach(cleanup);

const ALL_SCENE_IDS = A_SUBIDA_JOURNEY_STAGES.flatMap(
  (stage) => stage.sceneIds,
) as readonly ASubidaSceneId[];

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
});

describe("A Subida — narrative image-card beats", () => {
  it("opens with the prisoner turning toward the fire, guided by Plato", () => {
    const { container } = render(<ASubidaScene sceneId="depois-da-virada" />);

    expect(
      container.querySelector('[data-plato-pose="invite-turn"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /vira o corpo para trás/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("beat-01-depois-da-virada-v1.png"),
    );
    expect(
      screen.getByRole("link", { name: /olhar atrás da parede/i }),
    ).toHaveAttribute("href", "/aula/a-subida/fogo-e-estatuas");
  });

  it("keeps the ascent focused on Plato, the story image, and one explanation", () => {
    const { container } = render(
      <ASubidaScene sceneId="a-subida-dolorosa" />,
    );

    expect(
      container.querySelector('[data-plato-pose="light-pain-guide"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a subida é a parte mais difícil da alegoria/i),
    ).toBeVisible();
  });

  it("sequences objects, stars and moon after the water reflections", () => {
    const { container } = render(
      <ASubidaScene sceneId="objetos-estrelas-e-lua" />,
    );

    expect(
      container.querySelector('[data-plato-pose="gradual-seeing-guide"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("O que mudou desde as sombras lá fora?"),
    ).toBeVisible();
  });
});

describe("A Subida — periagōgē concept card", () => {
  it("presents the Greek word once, with Plato's explanation beside it", () => {
    render(<ASubidaScene sceneId="periagoge" />);

    expect(screen.getAllByText("περιαγωγή")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Aprender é mudar a direção do olhar.",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: /estende as mãos abertas/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("beat-04-plato-ofuscado-v1.png"),
    );
  });
});

describe("A Subida — beat 2, fogo-e-estatuas (EX-05 classification)", () => {
  it("shows the worked example with Plato before the challenge, then hides Plato in the table", () => {
    const { container } = render(<ASubidaScene sceneId="fogo-e-estatuas" />);

    expect(
      container.querySelector('[data-plato-pose="teaching-pointer"]'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Começar a subida" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Classificar o mecanismo da caverna",
      }),
    );

    expect(
      container.querySelector('[data-plato-pose="teaching-pointer"]'),
    ).not.toBeInTheDocument();
  });

  it("gates the next step until every card is classified correctly", () => {
    render(<ASubidaScene sceneId="fogo-e-estatuas" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Classificar o mecanismo da caverna",
      }),
    );

    const placements: readonly [string, string][] = [
      [
        "O fogo alto atrás da parede",
        "Causa — O que produz o que se vê.",
      ],
      [
        "As pessoas que carregam objetos",
        "Causa — O que produz o que se vê.",
      ],
      [
        "Os objetos reais sendo transportados",
        "Causa — O que produz o que se vê.",
      ],
      [
        "As sombras projetadas na parede da caverna",
        "Efeito — O que resulta da causa.",
      ],
      [
        "As figuras que o prisioneiro chamava de realidade",
        "Aparência — O que parecia ser antes de saber da causa.",
      ],
    ];

    placements.forEach(([card, destination]) => {
      fireEvent.click(screen.getByRole("button", { name: card }));
      fireEvent.click(screen.getByRole("button", { name: destination }));
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Verificar classificação" }),
    );

    expect(
      screen.getByText(/o mecanismo ficou visível/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Começar a subida" }),
    ).toHaveAttribute("href", "/aula/a-subida/a-subida-dolorosa");
  });
});

describe("A Subida — beat 5, sombras-la-fora (prediction and consequence)", () => {
  it("keeps the claim within the current evidence horizon before unlocking the next step", () => {
    render(<ASubidaScene sceneId="sombras-la-fora" />);

    expect(
      screen.queryByRole("link", { name: /seguir para os reflexos/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: "É a sombra de uma árvore" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar previsão" }),
    );
    expect(
      screen.getByText(/essa afirmação vai além do que a evidência/i),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: /seguir para os reflexos/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Tentar outra previsão" }),
    );
    fireEvent.click(
      screen.getByRole("radio", {
        name: "Não dá para saber de que objeto ela vem",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar previsão" }),
    );

    expect(
      screen.getByText(/cada horizonte de evidência permite uma afirmação/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /seguir para os reflexos/i }),
    ).toHaveAttribute("href", "/aula/a-subida/reflexos-na-agua");
  });
});

describe("A Subida — beat 6, reflexos-na-agua (causal path)", () => {
  it("orders object, light and reflection into a completed causal path", () => {
    render(<ASubidaScene sceneId="reflexos-na-agua" />);

    expect(
      screen.queryByRole("link", { name: /deixar a noite cair/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /luz que incide sobre o objeto/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Posição 2, vazia" }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /reflexo na superfície da água/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Posição 3, vazia" }),
    );

    expect(
      screen.getByText("Do objeto ao reflexo: o caminho está completo."),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /deixar a noite cair/i }),
    ).toHaveAttribute("href", "/aula/a-subida/objetos-estrelas-e-lua");
  });
});

describe("A Subida — beat 8, o-sol (model revision workbench)", () => {
  it("turns model revision into a branded workbench and unlocks the decision beat", () => {
    render(<ASubidaScene sceneId="o-sol" />);

    expect(screen.getByText("Oficina de ideias")).toBeVisible();
    expect(
      screen.getByTestId("initial-hypothesis"),
    ).toHaveTextContent(/as sombras na parede eram a realidade inteira/i);
    expect(
      screen.queryByRole("link", { name: /decidir o que fazer agora/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Revisar" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar estratégia" }),
    );
    fireEvent.click(
      screen.getByRole("radio", {
        name: "A sombra era um efeito real, não a realidade inteira.",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar comparação" }),
    );

    expect(
      screen.getByText(/revisar o modelo não é apagar o que você viu antes/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /decidir o que fazer agora/i }),
    ).toHaveAttribute("href", "/aula/a-subida/a-decisao");
  });
});

describe("A Subida — beat 9, a-decisao (bridge to O Retorno)", () => {
  it("ends by bridging knowledge to responsibility and O Retorno", () => {
    const { container } = render(<ASubidaScene sceneId="a-decisao" />);

    expect(
      container.querySelector('[data-plato-pose="return-compassion-guide"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ele poderia ficar. Mas se lembra dos outros.",
      }),
    ).toBeVisible();
    expect(
      screen.getAllByText(/como conversar com quem ainda vê outro mundo/i),
    ).not.toHaveLength(0);
    expect(
      screen.getByRole("link", { name: /voltar ao meu caminho/i }),
    ).toHaveAttribute("href", "/inicio");
  });
});
