import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveFirstDoubtScene } from "./cave-first-doubt-scene";

afterEach(cleanup);

it("turns contradiction into a personal question and ends before the ascent", () => {
  const { container } = render(<CaveFirstDoubtScene />);

  expect(
    screen.getByText(/algo não combina com o jogo da parede/i),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-plato-pose="first-doubt"]'),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Procuraria outra pista" }),
  );
  expect(
    screen.getByText(/duvidar não encerra a investigação/i),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  expect(
    screen.getByText(/pela primeira vez, ele tenta se virar/i),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-plato-pose="invite-turn"]'),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Quero ver além da parede" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/sol|mundo exterior/i)).not.toBeInTheDocument();
});

it("responds distinctly and without punishment to every reflection", () => {
  const choices = [
    {
      label: "Procuraria outra pista",
      response: /duvidar não encerra a investigação/i,
    },
    {
      label: "Perguntaria a outra pessoa",
      response: /uma pergunta compartilhada pode abrir outra direção/i,
    },
    {
      label: "Continuaria acreditando na parede",
      response: /confiar no que conhecemos é compreensível/i,
    },
  ] as const;

  choices.forEach(({ label, response }) => {
    const view = render(<CaveFirstDoubtScene />);
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(screen.getByText(response)).toBeInTheDocument();
    expect(screen.queryByText(/errou|incorreto|perdeu/i)).not.toBeInTheDocument();
    view.unmount();
  });
});

it("accepts an optional 180-character possibility and completes locally", () => {
  render(<CaveFirstDoubtScene />);

  const possibility = screen.getByRole("textbox", {
    name: "Escreva outra possibilidade",
  });
  expect(possibility).toHaveAttribute("maxLength", "180");
  fireEvent.change(possibility, {
    target: { value: "Eu observaria de novo, mas de outro lugar." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar ideia" }));

  expect(
    screen.getByText(/sua possibilidade cria um novo caminho para investigar/i),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Quero ver além da parede" }),
  );

  expect(
    screen.getByText("Você concluiu: Dentro da caverna"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("A próxima parte começa quando o olhar se vira."),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /próxima|subir|sair/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
});
