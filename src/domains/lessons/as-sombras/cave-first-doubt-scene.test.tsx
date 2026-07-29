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
  const turnHeading = screen.getByRole("heading", {
    name: /pela primeira vez, ele tenta se virar/i,
  });
  expect(turnHeading).toBeInTheDocument();
  expect(turnHeading).toHaveFocus();
  expect(
    screen.getByRole("button", { name: "Quero ver além da parede" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", {
      name: /um prisioneiro começa a olhar para trás/i,
    }),
  ).toHaveAttribute(
    "src",
    expect.stringContaining("cave-first-turn-cliffhanger-v1.png"),
  );
  expect(screen.queryByText(/sol|mundo exterior/i)).not.toBeInTheDocument();
});

it("keeps the approved prisoner-viewpoint question visible", () => {
  render(<CaveFirstDoubtScene />);

  expect(
    screen.getByText(
      "Se tudo o que você conhecesse estivesse nesta parede, o que faria você desconfiar dela?",
    ),
  ).toBeVisible();
});

it("moves every reflection directly to the prisoner's first turn", () => {
  const choices = [
    "Procuraria outra pista",
    "Perguntaria a outra pessoa",
    "Continuaria acreditando na parede",
  ] as const;

  choices.forEach((label) => {
    const view = render(<CaveFirstDoubtScene />);
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(
      screen.getByRole("heading", {
        name: /pela primeira vez, ele tenta se virar/i,
      }),
    ).toHaveFocus();
    expect(
      screen.queryByRole("heading", { name: "Platão pensa com você" }),
    ).not.toBeInTheDocument();
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
    screen.getByRole("heading", {
      name: /pela primeira vez, ele tenta se virar/i,
    }),
  ).toHaveFocus();
  fireEvent.click(
    screen.getByRole("button", { name: "Quero ver além da parede" }),
  );

  const completionHeading = screen.getByRole("heading", {
    name: "Você concluiu: Dentro da caverna",
  });
  expect(completionHeading).toBeInTheDocument();
  expect(completionHeading).toHaveFocus();
  expect(
    screen.getByText("A próxima parte começa quando o olhar se vira."),
  ).toBeInTheDocument();
  expect(screen.getByText("A parede mostrava aparências.")).toBeInTheDocument();
  expect(
    screen.getByText("Dóxa é uma crença formada pelo que parece verdadeiro."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Uma dúvida pode iniciar outro modo de olhar."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Na próxima: o que acontece quando ele olha para trás?"),
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
