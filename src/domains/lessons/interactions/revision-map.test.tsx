import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  RevisionMap,
  type RevisionStrategy,
} from "./revision-map";

const clues = [
  { value: "som", label: "A voz humana junto da projeção" },
  { value: "tempo", label: "Os passos fora do tempo da forma" },
] as const;

const feedback: Record<RevisionStrategy, string> = {
  revise: "Você mudou o modelo porque uma pista exigiu isso.",
  maintain:
    "Manter uma ideia depois de testá-la não é o mesmo que ignorar evidência.",
  uncertain: "Uma dúvida precisa pode indicar o próximo teste.",
};

afterEach(cleanup);

function renderRevision(
  overrides: Partial<React.ComponentProps<typeof RevisionMap>> = {},
) {
  const callbacks = {
    onHypothesisRevisited: vi.fn(),
    onRevisionRecorded: vi.fn(),
  };
  render(
    <RevisionMap
      initialHypothesis="  Talvez a parede mostre seres reais.  "
      clueOptions={clues}
      initialValue={{}}
      reviewer={(strategy) => (
        <p data-testid="strategy-feedback">{feedback[strategy]}</p>
      )}
      {...callbacks}
      {...overrides}
    />,
  );
  return callbacks;
}

it("restores the exact initial hypothesis and respects maintain, revise, and uncertain equally", () => {
  renderRevision();

  expect(
    screen.getByTestId("initial-hypothesis"),
  ).toHaveTextContent("  Talvez a parede mostre seres reais.  ", {
    normalizeWhitespace: false,
  });
  expect(screen.getByRole("radio", { name: "Manter" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Revisar" })).toBeInTheDocument();
  expect(
    screen.getByRole("radio", { name: "Ainda não sei" }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/melhor|superior/i)).not.toBeInTheDocument();
});

it.each([
  ["maintain", "Manter", feedback.maintain],
  ["revise", "Revisar", feedback.revise],
  ["uncertain", "Ainda não sei", feedback.uncertain],
] as const)(
  "requires a decisive clue and gives exact strategy feedback for %s",
  (strategy, accessibleName, expectedFeedback) => {
    const callbacks = renderRevision();

    fireEvent.click(
      screen.getByRole("radio", { name: accessibleName }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar estratégia" }),
    );
    expect(callbacks.onHypothesisRevisited).toHaveBeenCalledWith(strategy);

    const record = screen.getByRole("button", {
      name: "Registrar comparação",
    });
    expect(record).toBeDisabled();

    fireEvent.click(
      screen.getByRole("radio", {
        name: "A voz humana junto da projeção",
      }),
    );
    expect(record).toBeEnabled();
    fireEvent.click(record);

    expect(callbacks.onRevisionRecorded).toHaveBeenCalledWith(
      {
        strategy,
        decisiveClue: "som",
      },
      "",
    );
    expect(screen.getByTestId("strategy-feedback")).toHaveTextContent(
      expectedFeedback,
    );
    expect(screen.getAllByText("Antes")).not.toHaveLength(0);
    expect(screen.getByText("Agora")).toBeInTheDocument();
  },
);

it("keeps the optional revision text separate as a private reflection", () => {
  const callbacks = renderRevision();

  fireEvent.click(screen.getByRole("radio", { name: "Revisar" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar estratégia" }),
  );
  fireEvent.click(
    screen.getByRole("radio", {
      name: "Os passos fora do tempo da forma",
    }),
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Sua leitura de agora (opcional)" }),
    { target: { value: "Agora penso em uma fonte fora da parede." } },
  );
  expect(
    screen.getByText(
      "Este texto continua privado. A estratégia e a pista podem compor a evidência da atividade.",
    ),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Registrar comparação" }),
  );

  expect(callbacks.onRevisionRecorded).toHaveBeenCalledWith(
    {
      strategy: "revise",
      decisiveClue: "tempo",
    },
    "Agora penso em uma fonte fora da parede.",
  );
});

it("offers a neutral current-reading path when there is no saved hypothesis", () => {
  renderRevision({ initialHypothesis: null });

  expect(
    screen.getByText("Você ainda pode registrar sua leitura de agora"),
  ).toBeInTheDocument();
  expect(screen.queryByTestId("initial-hypothesis")).not.toBeInTheDocument();
});
