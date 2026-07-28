import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  PhilooCausalPath,
  type CausalPathItem,
} from "./philoo-causal-path";

const PATH_ITEMS = [
  {
    id: "light",
    label: "Luz",
    explanation: "A fogueira ilumina.",
    icon: <span aria-hidden="true">L</span>,
  },
  {
    id: "object",
    label: "Objeto",
    explanation: "Algo bloqueia parte da luz.",
    icon: <span aria-hidden="true">O</span>,
  },
  {
    id: "shadow",
    label: "Sombra",
    explanation: "A forma aparece na parede.",
    icon: <span aria-hidden="true">S</span>,
  },
  {
    id: "name",
    label: "Nome",
    explanation: "Os prisioneiros interpretam a forma.",
    icon: <span aria-hidden="true">N</span>,
  },
] as const satisfies readonly CausalPathItem[];

const CORRECT_ORDER = ["light", "object", "shadow", "name"] as const;

afterEach(cleanup);

function renderPath(onComplete = vi.fn()) {
  return {
    onComplete,
    ...render(
      <PhilooCausalPath
        items={PATH_ITEMS}
        correctOrder={CORRECT_ORDER}
        demonstratedItemId="light"
        onComplete={onComplete}
      />,
    ),
  };
}

// Production break caught: the demonstration can become learner work, or a
// correctly completed keyboard/click path can fail to report completion.
it("keeps the demonstrated light fixed and completes the remaining path", () => {
  const { onComplete } = renderPath();

  expect(screen.getByText("Luz")).toHaveAttribute(
    "data-demonstrated",
    "true",
  );
  expect(screen.getByRole("button", { name: "Posição 1" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2" }));
  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4" }));

  expect(onComplete).toHaveBeenCalledOnce();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Da luz ao nome: o caminho está completo.",
  );
});

// Production break caught: an incorrect full path can be cleared, punished, or
// described only as "wrong" instead of naming the first broken causal link.
it("keeps an incorrect complete path and explains its first causal break", () => {
  const { onComplete } = renderPath();

  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2" }));
  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4" }));

  expect(onComplete).not.toHaveBeenCalled();
  expect(screen.getByRole("status")).toHaveTextContent(
    "A sombra precisa de algo entre a luz e a parede.",
  );
  expect(screen.getByRole("button", { name: "Posição 2" })).toHaveTextContent(
    "Sombra",
  );
  expect(screen.getByRole("button", { name: "Posição 3" })).toHaveTextContent(
    "Objeto",
  );

  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3" }));

  expect(onComplete).toHaveBeenCalledOnce();
});

// Production break caught: adding drag can replace the semantic buttons or
// maintain a separate state that disagrees with click placement.
it("uses native drag as an enhancement over the same button placement state", () => {
  renderPath();
  const transferred = new Map<string, string>();
  const dataTransfer = {
    effectAllowed: "move",
    dropEffect: "move",
    setData: (type: string, value: string) => transferred.set(type, value),
    getData: (type: string) => transferred.get(type) ?? "",
  };

  const object = screen.getByRole("button", { name: "Objeto" });
  const positionTwo = screen.getByRole("button", { name: "Posição 2" });

  expect(object).toHaveAttribute("draggable", "true");
  fireEvent.dragStart(object, { dataTransfer });
  fireEvent.dragOver(positionTwo, { dataTransfer });
  fireEvent.drop(positionTwo, { dataTransfer });

  expect(positionTwo).toHaveTextContent("Objeto");
  expect(object).toHaveAttribute("aria-pressed", "false");
});
