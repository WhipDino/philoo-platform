import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooCausalPathDemonstration } from "./philoo-causal-path-demonstration";

afterEach(cleanup);

// Production break caught: the briefing can lose its accessible explanation,
// or replay can leave the same completed animation mounted and inert.
it("describes the object move and remounts the animated stage on replay", () => {
  const { container } = render(<PhilooCausalPathDemonstration />);

  expect(screen.getAllByText("Objeto").length).toBeGreaterThan(0);
  expect(
    screen.getByText(/^Posição 2$/, {
      selector: "[data-causal-destination-label]",
    }),
  ).toHaveTextContent("Posição 2");
  expect(
    screen.getByLabelText(
      "Demonstração: o objeto sai da bandeja e chega à posição 2.",
    ),
  ).toBeInTheDocument();

  const stageBeforeReplay = container.querySelector(
    "[data-causal-demonstration-stage]",
  );
  expect(stageBeforeReplay).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Ver novamente" }));

  const stageAfterReplay = container.querySelector(
    "[data-causal-demonstration-stage]",
  );
  expect(stageAfterReplay).toBeInTheDocument();
  expect(stageAfterReplay).not.toBe(stageBeforeReplay);
});

// Production break caught: the cursor can skip the press/lift state or travel
// on a separate straight-line trajectory rather than the illustrated curve.
it("exposes shared curve, press, and drag hooks for the cursor demonstration", () => {
  const { container } = render(<PhilooCausalPathDemonstration />);

  expect(
    container.querySelector("[data-causal-drag-path]"),
  ).toBeInTheDocument();
  expect(
    container.querySelector("[data-causal-cursor-press]"),
  ).toBeInTheDocument();
  expect(
    container.querySelector("[data-causal-drag-proxy]"),
  ).toBeInTheDocument();
});
