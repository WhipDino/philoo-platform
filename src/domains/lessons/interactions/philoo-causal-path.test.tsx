import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

const POSITION_HINTS = [
  "A fogueira produz a luz.",
  "O que a luz encontra pelo caminho?",
  "O que aparece quando a luz é bloqueada?",
  "O que as pessoas fazem quando reconhecem a forma?",
] as const;

afterEach(cleanup);

function renderPath(onComplete = vi.fn(), onIncomplete = vi.fn()) {
  return {
    onComplete,
    onIncomplete,
    ...render(
      <PhilooCausalPath
        items={PATH_ITEMS}
        correctOrder={CORRECT_ORDER}
        demonstratedItemId="light"
        positionHints={POSITION_HINTS}
        onComplete={onComplete}
        onIncomplete={onIncomplete}
      />,
    ),
  };
}

// Production break caught: learner placements can become irreversible, hiding
// the lesson-provided prompt and trapping keyboard focus in the path.
it("restores a returned piece's hint and tray focus without making light removable", async () => {
  renderPath();

  for (const hint of POSITION_HINTS) {
    expect(screen.getByText(hint)).toBeInTheDocument();
  }

  const object = screen.getByRole("button", { name: "Objeto" });
  fireEvent.click(object);
  fireEvent.click(screen.getByRole("button", { name: "Posição 2, vazia" }));

  const placedObject = screen.getByRole("button", {
    name: "Posição 2, Objeto. Devolver peça",
  });
  expect(placedObject).toHaveAccessibleDescription(
    "Algo bloqueia parte da luz.",
  );
  expect(
    screen.queryByText("O que a luz encontra pelo caminho?"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Posição 1, Luz" }),
  ).toBeDisabled();

  fireEvent.click(placedObject);

  expect(
    screen.getByText("O que a luz encontra pelo caminho?"),
  ).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Peça devolvida. Continue montando o caminho.",
  );
  await waitFor(() => expect(object).toHaveFocus());
});

// Production break caught: returning a piece after a completed path leaves the
// lesson marked complete and prevents a corrected path from reporting again.
it("reports incompletion when a completed learner position is returned", () => {
  const { onComplete, onIncomplete } = renderPath();

  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4, vazia" }));

  expect(onComplete).toHaveBeenCalledOnce();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Posição 4, Nome. Devolver peça",
    }),
  );

  expect(onIncomplete).toHaveBeenCalledOnce();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Peça devolvida. Continue montando o caminho.",
  );

  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4, vazia" }));

  expect(onComplete).toHaveBeenCalledTimes(2);
});

// Production break caught: the demonstration can become learner work, or a
// correctly completed keyboard/click path can fail to report completion.
it("keeps the demonstrated light fixed and completes the remaining path", () => {
  const { onComplete } = renderPath();

  expect(screen.getByText("Luz")).toHaveAttribute(
    "data-demonstrated",
    "true",
  );
  expect(screen.getByRole("button", { name: "Posição 1, Luz" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4, vazia" }));

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
  fireEvent.click(screen.getByRole("button", { name: "Posição 2, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Nome" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 4, vazia" }));

  expect(onComplete).not.toHaveBeenCalled();
  expect(screen.getByRole("status")).toHaveTextContent(
    "A sombra precisa de algo entre a luz e a parede.",
  );
  expect(
    screen.getByRole("button", {
      name: "Posição 2, Sombra. Devolver peça",
    }),
  ).toHaveTextContent("Sombra");
  expect(
    screen.getByRole("button", {
      name: "Posição 3, Objeto. Devolver peça",
    }),
  ).toHaveTextContent("Objeto");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Posição 2, Sombra. Devolver peça",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Posição 3, Objeto. Devolver peça",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Objeto" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 2, vazia" }));
  fireEvent.click(screen.getByRole("button", { name: "Sombra" }));
  fireEvent.click(screen.getByRole("button", { name: "Posição 3, vazia" }));

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
  const positionTwo = screen.getByRole("button", {
    name: "Posição 2, vazia",
  });

  expect(object).toHaveAttribute("draggable", "true");
  fireEvent.dragStart(object, { dataTransfer });
  fireEvent.dragOver(positionTwo, { dataTransfer });
  fireEvent.drop(positionTwo, { dataTransfer });

  expect(positionTwo).toHaveTextContent("Objeto");
  expect(object).toHaveAttribute("aria-pressed", "false");
});

// Production break caught: a second reusable path can duplicate description
// IDs and make assistive technology resolve the first path's explanation.
it("scopes position descriptions to each causal path instance", () => {
  const secondItems = PATH_ITEMS.map((item) =>
    item.id === "light"
      ? { ...item, explanation: "A lanterna ilumina." }
      : item,
  );
  const { container } = render(
    <>
      <PhilooCausalPath
        items={PATH_ITEMS}
        correctOrder={CORRECT_ORDER}
        demonstratedItemId="light"
        positionHints={POSITION_HINTS}
        onComplete={vi.fn()}
      />
      <PhilooCausalPath
        items={secondItems}
        correctOrder={CORRECT_ORDER}
        demonstratedItemId="light"
        positionHints={POSITION_HINTS}
        onComplete={vi.fn()}
      />
    </>,
  );
  const paths = container.querySelectorAll("[data-philoo-causal-path]");
  const firstLight = within(paths[0] as HTMLElement).getByRole("button", {
    name: "Posição 1, Luz",
  });
  const secondLight = within(paths[1] as HTMLElement).getByRole("button", {
    name: "Posição 1, Luz",
  });
  const firstDescriptionId = firstLight.getAttribute("aria-describedby");
  const secondDescriptionId = secondLight.getAttribute("aria-describedby");

  expect(firstDescriptionId).toBeTruthy();
  expect(secondDescriptionId).toBeTruthy();
  expect(firstDescriptionId).not.toBe(secondDescriptionId);
  expect(document.getElementById(firstDescriptionId!)).toHaveTextContent(
    "A fogueira produz a luz.",
  );
  expect(document.getElementById(secondDescriptionId!)).toHaveTextContent(
    "A fogueira produz a luz.",
  );
});

// Production break caught: visual placement can be hidden from screen readers
// when a fixed aria-label masks the item and the tray state is data-only.
it("announces empty, selected, and placed state through button descriptions", () => {
  renderPath();
  const object = screen.getByRole("button", { name: "Objeto" });
  const emptyPosition = screen.getByRole("button", {
    name: "Posição 2, vazia",
  });

  expect(emptyPosition).toHaveAccessibleDescription(
    "O que a luz encontra pelo caminho?",
  );
  expect(object).toHaveAccessibleDescription("Peça disponível.");

  fireEvent.click(object);
  expect(object).toHaveAccessibleDescription("Peça selecionada.");
  fireEvent.click(emptyPosition);

  expect(
    screen.getByRole("button", {
      name: "Posição 2, Objeto. Devolver peça",
    }),
  ).toHaveAccessibleDescription("Algo bloqueia parte da luz.");
  expect(object).toHaveAccessibleDescription("Colocada na posição 2.");
});
