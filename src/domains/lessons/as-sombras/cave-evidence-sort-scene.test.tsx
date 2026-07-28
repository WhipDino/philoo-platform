import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveEvidenceSortScene } from "./cave-evidence-sort-scene";

afterEach(cleanup);

it("lets the learner select, place, revise, and receive formative feedback", () => {
  const { container } = render(<CaveEvidenceSortScene />);
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-width",
    "narrative",
  );
  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-treatment",
    "folio",
  );
  expect(container.querySelector("[data-philoo-folio-stage]")).toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-soft-frame]"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("Primeiro desafio")).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(
    screen.queryByRole("progressbar", { name: "Cena 5 de 10" }),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector("[data-philoo-outer-ribbons]"),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-guided-classification-v1.png"),
  );
  expect(
    screen.getByText(
      "Escolha uma pista e arraste para o bolso que fizer mais sentido.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Se preferir, toque na pista e depois no bolso."),
  ).toBeInTheDocument();
  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "0 de 6 pistas organizadas",
  );
  expect(
    container.querySelector("[data-philoo-discovery-table]"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Pistas da parede" }),
  ).toBeInTheDocument();
  expect(screen.getByText("0 de 6 pistas organizadas")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Conferir descobertas" }),
  ).not.toBeInTheDocument();
  const shape = screen.getByRole("button", { name: "Uma forma cruzou a parede." });
  fireEvent.click(shape);
  fireEvent.click(
    screen.getByRole("button", { name: "Vi — A parede mostrou isso." }),
  );
  expect(screen.getByText("1 de 6 pistas organizadas")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Uma forma cruzou a parede." }));
  fireEvent.click(
    screen.getByRole("button", {
      name: "Concluí — Completei o que faltava com uma ideia.",
    }),
  );

  ["A sombra mudou de tamanho.", "Um cavalo passou atrás delas.", "A voz pertencia à sombra.", "Havia uma fogueira atrás delas.", "Nada existia além da parede."].forEach((text) => {
    fireEvent.click(screen.getByRole("button", { name: text }));
    fireEvent.click(
      screen.getByRole("button", { name: "Vi — A parede mostrou isso." }),
    );
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Conferir descobertas" }),
  );
  expect(screen.getByText(/pistas precisam de outro olhar/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-gentle-retry-v2.png"),
  );
});

it("celebrates after every clue is classified correctly", () => {
  render(<CaveEvidenceSortScene />);

  const placements = [
    ["Uma forma cruzou a parede.", "Vi — A parede mostrou isso."],
    ["A sombra mudou de tamanho.", "Vi — A parede mostrou isso."],
    [
      "Um cavalo passou atrás delas.",
      "Concluí — Completei o que faltava com uma ideia.",
    ],
    [
      "A voz pertencia à sombra.",
      "Concluí — Completei o que faltava com uma ideia.",
    ],
    [
      "Havia uma fogueira atrás delas.",
      "Ainda não sei — A parede não permite confirmar.",
    ],
    [
      "Nada existia além da parede.",
      "Ainda não sei — A parede não permite confirmar.",
    ],
  ] as const;

  placements.forEach(([card, destination]) => {
    fireEvent.click(screen.getByRole("button", { name: card }));
    fireEvent.click(screen.getByRole("button", { name: destination }));
  });

  expect(
    screen.getByRole("button", { name: "Conferir descobertas" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Conferir descobertas" }),
  );

  expect(
    screen.getByText(
      /você separou o que a parede mostrou do que elas imaginaram/i,
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-celebrate-discovery-v2.png"),
  );
});
