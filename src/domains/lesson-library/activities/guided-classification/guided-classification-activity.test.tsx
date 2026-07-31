import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createGuidedClassificationState,
  sanitizeGuidedClassificationState,
  type GuidedClassificationState,
} from "./guided-classification-contract";
import { GuidedClassificationActivity } from "./guided-classification-activity";
import { GuidedClassificationExercise } from "./guided-classification-exercise";
import { SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE } from "./guided-classification-examples";

type SocraticMoveId =
  (typeof SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE.categories)[number]["id"];

function SocraticHarness({ onComplete = vi.fn() }) {
  const [state, setState] = useState<
    GuidedClassificationState<SocraticMoveId>
  >(() => createGuidedClassificationState());

  return (
    <GuidedClassificationActivity
      config={SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE}
      value={state}
      onChange={setState}
      onComplete={onComplete}
    />
  );
}

afterEach(cleanup);

describe("GuidedClassificationActivity", () => {
  it("renders unrelated content without Cave- or Plato-specific language", () => {
    const { container } = render(<SocraticHarness />);

    expect(
      screen.getByRole("heading", {
        name: /uma ideia fica mais forte quando sabemos/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Afirmação")).toBeInTheDocument();
    expect(screen.getByText("Razão")).toBeInTheDocument();
    expect(screen.getByText("Pergunta")).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/parede|prisioneiros|sombras/i);
  });

  it("supports revision and completes only after every classification is correct", () => {
    const onComplete = vi.fn();
    render(<SocraticHarness onComplete={onComplete} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Analisar o diálogo" }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Agir sem pensar não basta para chamar alguém de corajoso.",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Razão — Apoia outra ideia.",
      }),
    );
    expect(
      screen.getByText(
        "Esta frase apresenta uma posição para ser examinada.",
      ),
    ).toBeInTheDocument();

    const placements = [
      [
        "Agir sem pensar não basta para chamar alguém de corajoso.",
        "Afirmação — Defende uma posição.",
      ],
      [
        "Um impulso pode ignorar o perigo em vez de enfrentá-lo.",
        "Razão — Apoia outra ideia.",
      ],
      [
        "O que diferencia coragem de imprudência?",
        "Pergunta — Abre a investigação.",
      ],
    ] as const;

    for (const [card, destination] of placements) {
      fireEvent.click(screen.getByRole("button", { name: card }));
      fireEvent.click(screen.getByRole("button", { name: destination }));
    }

    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Conferir análise" }));

    expect(
      screen.getByText("Você reconstruiu o movimento do diálogo."),
    ).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("sanitizes restored state against the active cards and categories", () => {
    expect(
      sanitizeGuidedClassificationState(
        SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE,
        {
          schemaVersion: "0",
          stage: "challenge",
          selectedCardId: "missing",
          placements: {
            "courage-claim": "claim",
            "courage-reason": "missing",
            unknown: "reason",
          },
          hasChecked: true,
          lastMove: {
            cardId: "courage-claim",
            destinationId: "claim",
          },
        },
      ),
    ).toEqual({
      schemaVersion: "1",
      stage: "challenge",
      selectedCardId: null,
      placements: {
        "courage-claim": "claim",
      },
      hasChecked: false,
      lastMove: {
        cardId: "courage-claim",
        destinationId: "claim",
      },
    });
  });
});

describe("GuidedClassificationExercise", () => {
  it("provides a one-call API that owns state and reports state changes", () => {
    const onStateChange = vi.fn();

    render(
      <GuidedClassificationExercise
        config={SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE}
        onStateChange={onStateChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Analisar o diálogo" }),
    );

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaVersion: "1",
        stage: "challenge",
      }),
    );
  });

  it("restores only valid saved state through the same one-call API", () => {
    render(
      <GuidedClassificationExercise
        config={SOCRATIC_DIALOGUE_CLASSIFICATION_EXAMPLE}
        initialState={{
          stage: "challenge",
          placements: {
            "courage-claim": "claim",
            missing: "reason",
          },
        }}
      />,
    );

    expect(
      screen.getByText("1 de 3 frases organizadas"),
    ).toBeInTheDocument();
  });
});
