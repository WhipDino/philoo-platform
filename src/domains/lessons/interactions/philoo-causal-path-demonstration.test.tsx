import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PhilooCausalPathDemonstration } from "./philoo-causal-path-demonstration";

afterEach(cleanup);

// Production break caught: the looping visual can lose its concise accessible
// explanation or the exact object and destination labels.
it("describes the object move with the reviewed labels", () => {
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

  const stage = container.querySelector(
    "[data-causal-demonstration-stage]",
  );
  expect(stage).toBeInTheDocument();
});

// Production break caught: reintroducing direct-manipulation affordances would
// turn the ambient causal explanation back into a manual drag/replay demo.
it("loops automatically without cursor or replay controls", () => {
  const { container } = render(<PhilooCausalPathDemonstration />);

  expect(
    container.querySelector("[data-causal-automatic-loop]"),
  ).toBeInTheDocument();
  expect(
    container.querySelector("[data-causal-cursor-press]"),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Ver novamente" }),
  ).not.toBeInTheDocument();
});

// Production break caught: the trail can appear fully formed instead of
// progressively revealing the route behind the larger travelling object.
it("exposes separate moving pill and progressive trail hooks", () => {
  const { container } = render(<PhilooCausalPathDemonstration />);

  expect(
    container.querySelector("[data-causal-progressive-trail]"),
  ).toBeInTheDocument();
  expect(
    container.querySelector("[data-causal-moving-pill]"),
  ).toBeInTheDocument();
});
