import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CaveBehindWallScene } from "./cave-behind-wall-scene";

afterEach(cleanup);

it("reveals fire, carried objects, and the resulting shadows in order", () => {
  const { container } = render(<CaveBehindWallScene />);
  const revealLayers = container.querySelectorAll("[data-reveal-layer]");

  expect(screen.getByText(/eles não conseguem ver isto/i)).toBeInTheDocument();
  expect(revealLayers).toHaveLength(3);
  expect(
    Array.from(revealLayers, (layer) => layer.getAttribute("data-visible")),
  ).toEqual(["false", "false", "false"]);
  expect(
    container.querySelector('[data-plato-pose="reveal-behind"]'),
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
