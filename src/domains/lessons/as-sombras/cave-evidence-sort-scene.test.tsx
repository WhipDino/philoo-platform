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
    expect.stringContaining("plato-review-evidence-v2.png"),
  );
  const shape = screen.getByRole("button", { name: "Uma forma cruzou a parede." });
  fireEvent.click(shape);
  fireEvent.click(screen.getByRole("button", { name: /observaram/i }));
  expect(screen.getByText(/você organizou 1 de 6/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Uma forma cruzou a parede." }));
  fireEvent.click(screen.getByRole("button", { name: /concluíram/i }));

  ["A sombra mudou de tamanho.", "Um cavalo passou atrás delas.", "A voz pertencia à sombra.", "Havia uma fogueira atrás delas.", "Nada existia além da parede."].forEach((text) => {
    fireEvent.click(screen.getByRole("button", { name: text }));
    fireEvent.click(screen.getByRole("button", { name: /observaram/i }));
  });
  fireEvent.click(screen.getByRole("button", { name: /conferir caminho/i }));
  expect(screen.getByText(/frases precisam de outro olhar/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    expect.stringContaining("plato-gentle-retry-v2.png"),
  );
});
