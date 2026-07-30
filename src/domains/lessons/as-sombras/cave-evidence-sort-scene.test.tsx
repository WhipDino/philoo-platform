import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveEvidenceSortScene } from "./cave-evidence-sort-scene";

afterEach(cleanup);

function beginIndependentChallenge() {
  expect(
    screen.getByText(/uma pista, três jeitos de pensar/i),
  ).toBeInTheDocument();
  expect(screen.getByText("Há três pegadas no chão.")).toBeInTheDocument();
  expect(screen.getByText("Alguém passou por aqui.")).toBeInTheDocument();
  expect(screen.getByText("Quem deixou as pegadas?")).toBeInTheDocument();
  expect(
    screen.getByText(/use quando algo apareceu diante dos olhos/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/use quando uma ideia parece verdadeira/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/use quando ainda faltam pistas/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Uma forma atravessou a parede."),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Entendi os três" }));
}

it("teaches the distinction before activating the four-card application", () => {
  const { container } = render(<CaveEvidenceSortScene />);

  expect(container.querySelector("[data-philoo-story-shell]")).toHaveAttribute(
    "data-surface-treatment",
    "folio",
  );
  expect(
    screen.getByRole("complementary", {
      name: "Sua jornada em As Sombras",
    }),
  ).toBeInTheDocument();
  beginIndependentChallenge();

  expect(
    container.querySelector("[data-activity-guidance]"),
  ).not.toBeInTheDocument();
  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "0 de 4 pistas organizadas",
  );
  expect(
    container.querySelector("[data-philoo-discovery-table]"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Pistas da parede" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Uma sombra apareceu na parede." }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "O que existia atrás da parede?",
    }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "A voz vinha da própria sombra." }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Como jogar" }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "A sombra era o objeto verdadeiro.",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Eles viram — Apareceu diante deles.",
    }),
  );
  expect(
    screen.getByText(
      "Isso era uma crença criada a partir do que aparecia na parede.",
    ),
  ).toBeInTheDocument();

  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "1 de 4 pistas organizadas",
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "A sombra era o objeto verdadeiro.",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Eles acreditaram — Parecia verdade para eles.",
    }),
  );
  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "1 de 4 pistas organizadas",
  );
});

it("keeps every placement revisable and links forward only after a correct completion", () => {
  const { container } = render(<CaveEvidenceSortScene />);
  beginIndependentChallenge();

  const placements = [
    ["Uma sombra apareceu na parede.", "Eles viram — Apareceu diante deles."],
    [
      "A sombra era o objeto verdadeiro.",
      "Eles acreditaram — Parecia verdade para eles.",
    ],
    [
      "A parede mostrava o mundo inteiro.",
      "Eles acreditaram — Parecia verdade para eles.",
    ],
    [
      "O que existia atrás da parede?",
      "Eles não sabiam — Ainda faltavam pistas.",
    ],
  ] as const;

  placements.forEach(([card, destination]) => {
    fireEvent.click(screen.getByRole("button", { name: card }));
    fireEvent.click(screen.getByRole("button", { name: destination }));
  });

  fireEvent.click(screen.getByRole("button", { name: "Conferir descobertas" }));

  expect(
    screen.getByText(/você separou o que apareceu, o que eles acreditaram/i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Seguir a dúvida" })).toHaveAttribute(
    "href",
    "/aula/as-sombras/a-primeira-duvida",
  );
  expect(
    container.querySelector("[data-activity-guidance]"),
  ).not.toBeInTheDocument();
});
