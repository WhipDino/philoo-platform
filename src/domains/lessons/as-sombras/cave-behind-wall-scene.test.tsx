import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveBehindWallScene } from "./cave-behind-wall-scene";

afterEach(cleanup);

it("reveals fire, carried objects, and the resulting shadows in order", () => {
  const { container } = render(<CaveBehindWallScene />);
  expect(
    screen.getByRole("dialog", { name: "Descubra o que existe atrás" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Começar a revelar" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const revealLayers = container.querySelectorAll("[data-reveal-layer]");

  expect(screen.getByText(/eles não conseguem ver isto/i)).toBeInTheDocument();
  expect(revealLayers).toHaveLength(3);
  expect(
    Array.from(revealLayers, (layer) => layer.getAttribute("data-visible")),
  ).toEqual(["false", "false", "false"]);
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ver instruções" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/uma fogueira permanece acesa/i),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /montar o caminho/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Revelar a luz" }));
  expect(
    Array.from(revealLayers, (layer) => layer.getAttribute("data-visible")),
  ).toEqual(["true", "false", "false"]);
  expect(
    screen.getByText(/uma fogueira permanece acesa/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/pessoas carregam objetos/i),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Revelar os objetos" }));
  expect(
    Array.from(revealLayers, (layer) => layer.getAttribute("data-visible")),
  ).toEqual(["true", "true", "false"]);
  expect(screen.getByText(/pessoas carregam objetos/i)).toBeInTheDocument();
  expect(
    screen.queryByText(/a parede recebe as sombras/i),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Revelar o efeito" }));
  expect(
    Array.from(revealLayers, (layer) => layer.getAttribute("data-visible")),
  ).toEqual(["true", "true", "true"]);
  expect(screen.getByText(/a parede recebe as sombras/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /montar o caminho/i })).toHaveAttribute(
    "href",
    "/aula/as-sombras/caminho-da-sombra",
  );
});

it("keeps the explanation and reveal controls in one coherent column", () => {
  const { container } = render(<CaveBehindWallScene />);
  fireEvent.click(screen.getByRole("button", { name: "Começar a revelar" }));
  const column = container.querySelector("[data-reveal-column]");
  const controls = screen.getByRole("group", {
    name: "Controles da revelação",
  });

  expect(column).toBeInTheDocument();
  expect(column).toHaveTextContent(/eles não conseguem ver isto/i);
  expect(column).toContainElement(controls);
  expect(Array.from(column?.children ?? [])).toHaveLength(2);
});

it("reopens the reveal briefing without losing revealed layers", () => {
  const { container } = render(<CaveBehindWallScene />);
  fireEvent.click(screen.getByRole("button", { name: "Começar a revelar" }));
  fireEvent.click(screen.getByRole("button", { name: "Revelar a luz" }));
  fireEvent.click(screen.getByRole("button", { name: "Ver instruções" }));

  expect(
    screen.getByRole("dialog", { name: "Descubra o que existe atrás" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Voltar à descoberta" }));

  expect(
    container.querySelector('[data-reveal-layer="fire"]'),
  ).toHaveAttribute("data-visible", "true");
  expect(container.querySelector("[data-plato-pose]")).not.toBeInTheDocument();
});
