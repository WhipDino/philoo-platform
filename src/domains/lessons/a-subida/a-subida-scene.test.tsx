import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ASubidaScene } from "./a-subida-scene";

afterEach(cleanup);

describe("A Subida", () => {
  it("places Plato beside, never inside, the prisoner story artwork", () => {
    const { rerender } = render(<ASubidaScene sceneId="o-fogo" />);

    const prisonerArtwork = screen.getByRole("img", {
      name: /o prisioneiro de túnica azul descobre o fogo/i,
    });
    expect(prisonerArtwork).toHaveAttribute(
      "src",
      expect.stringContaining("cave-mechanism-discovery-v1.png"),
    );
    expect(prisonerArtwork.closest("figure")).not.toContainElement(
      document.querySelector('[data-plato-pose="causal-path"]'),
    );
    expect(
      screen.getByRole("img", {
        name: /platão acompanha com as mãos o caminho da luz/i,
      }),
    ).toBeVisible();

    rerender(<ASubidaScene sceneId="periagoge" />);
    expect(
      screen.getByRole("img", { name: /platão apresenta a ideia/i }),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("plato-periagoge-guide-v1.png"),
    );
  });

  it.each([
    "primeiro-olhar",
    "o-primeiro-movimento",
    "o-fogo",
    "duas-explicacoes",
    "a-subida-doi",
    "ate-onde-posso-afirmar",
    "periagoge",
    "aprender-a-ver",
    "revisar-o-mundo",
    "a-decisao",
  ] as const)("keeps Plato narrating the %s moment", (sceneId) => {
    const { container } = render(<ASubidaScene sceneId={sceneId} />);

    expect(container.querySelector("[data-plato-pose]")).toBeInTheDocument();
    expect(screen.getAllByText(/^platão/i).length).toBeGreaterThan(0);
  });

  it("opens with a concise recap before the prisoner's first movement", () => {
    const { container, rerender } = render(
      <ASubidaScene sceneId="primeiro-olhar" />,
    );

    expect(
      container.querySelector("[data-philoo-narrative-composition]"),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-plato-pose="reveal-behind"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /um prisioneiro começou a desconfiar das sombras/i,
      }),
    ).toBeVisible();
    expect(screen.queryByText(/pergunta da jornada/i)).not.toBeInTheDocument();

    rerender(<ASubidaScene sceneId="o-primeiro-movimento" />);
    expect(
      container.querySelector('[data-plato-pose="first-question"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /o corpo vira antes de a certeza mudar/i,
      }),
    ).toBeVisible();
  });

  it("lets the learner distinguish competing models and revise after feedback", () => {
    render(<ASubidaScene sceneId="duas-explicacoes" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /esperar a mesma sombra aparecer outra vez/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Testar minha escolha" }),
    );
    expect(
      screen.getByText(/essa pista ainda deixa os dois modelos de pé/i),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: /mover o objeto e observar se a sombra muda junto/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Testar minha escolha" }),
    );
    expect(
      screen.getByText(/esse teste pode fazer um modelo perder força/i),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /continuar a subida/i }),
    ).toHaveAttribute("href", "/aula/a-subida/a-subida-doi");
  });

  it("requires claims to stay within the current evidence horizon", () => {
    render(<ASubidaScene sceneId="ate-onde-posso-afirmar" />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /já conheço a causa de todas as formas/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Conferir alcance" }),
    );
    expect(
      screen.getByText(/vai além do que as pistas permitem/i),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: /há formas que interrompem a luz/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Conferir alcance" }),
    );
    expect(screen.getByText("Cabe nas pistas.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Próxima etapa" }),
    ).toBeEnabled();
  });

  it("ends by bridging knowledge to responsibility and O Retorno", () => {
    render(<ASubidaScene sceneId="a-decisao" />);

    expect(
      screen.getByRole("heading", { name: "Ele olha de volta" }),
    ).toBeVisible();
    expect(
      screen.getByText(/conhecer melhor traz responsabilidade, não superioridade/i),
    ).toBeVisible();
    expect(screen.getByText(/o retorno · como conversar/i)).toBeVisible();
  });
});
