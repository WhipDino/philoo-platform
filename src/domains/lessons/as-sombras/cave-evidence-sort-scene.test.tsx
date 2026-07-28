import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveEvidenceSortScene } from "./cave-evidence-sort-scene";

afterEach(cleanup);

function beginIndependentChallenge() {
  expect(
    screen.getByRole("dialog", { name: /organize as pistas/i }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Começar o desafio" }));

  expect(
    screen.getByText(/Platão mostra o primeiro exemplo/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Uma forma atravessou a parede."),
  ).toBeInTheDocument();
  expect(screen.getAllByText("Vi").length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button", { name: "Entendi o exemplo" }));
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
    screen.getByRole("button", { name: "Uma forma atravessou a parede." }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Do ponto de vista dos prisioneiros, existia um mundo fora da caverna.",
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "A forma era produzida por um objeto.",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Vi — A parede mostrou isso." }),
  );
  expect(
    screen.getByText(
      "Essa explicação completa algo que os prisioneiros não viram.",
    ),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));
  expect(
    screen.getByRole("dialog", { name: /organize as pistas/i }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Voltar ao desafio" }));
  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "1 de 4 pistas organizadas",
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "A forma era produzida por um objeto.",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Concluí — Completei o que faltava com uma ideia.",
    }),
  );
  expect(container.querySelector("[data-progress-fraction]")).toHaveAttribute(
    "aria-label",
    "1 de 4 pistas organizadas",
  );
});

it("keeps every placement revisable and links forward only after a correct completion", () => {
  render(<CaveEvidenceSortScene />);
  beginIndependentChallenge();

  const placements = [
    ["Uma forma atravessou a parede.", "Vi — A parede mostrou isso."],
    [
      "A forma era produzida por um objeto.",
      "Concluí — Completei o que faltava com uma ideia.",
    ],
    [
      "A voz vinha da própria sombra.",
      "Concluí — Completei o que faltava com uma ideia.",
    ],
    [
      "Do ponto de vista dos prisioneiros, existia um mundo fora da caverna.",
      "Ainda não sei — A parede não permite confirmar.",
    ],
  ] as const;

  placements.forEach(([card, destination]) => {
    fireEvent.click(screen.getByRole("button", { name: card }));
    fireEvent.click(screen.getByRole("button", { name: destination }));
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Conferir descobertas" }),
  );

  expect(
    screen.getByText(/você separou o que eles viram do que apenas imaginaram/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Seguir a dúvida" }),
  ).toHaveAttribute("href", "/aula/as-sombras/a-primeira-duvida");
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-celebrate-discovery-v2.png"),
  );
});
