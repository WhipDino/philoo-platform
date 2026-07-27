"use client";

import { useId, useState, type ReactNode } from "react";

export interface PredictionChoice<TChoice extends string> {
  readonly value: TChoice;
  readonly label: string;
}
export interface PredictionConsequenceProps<TChoice extends string> {
  readonly prompt: string;
  readonly choices: readonly PredictionChoice<TChoice>[];
  readonly isMatch: (choice: TChoice) => boolean;
  readonly consequence: ReactNode;
  readonly matchedFeedback: ReactNode;
  readonly unmatchedFeedback: ReactNode;
  readonly onCommit: (
    choice: TChoice,
    matched: boolean,
  ) => void | boolean | Promise<void | boolean>;
  readonly disabled?: boolean;
}

function isPromiseLike<T>(
  value: T | Promise<T>,
): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

export function PredictionConsequence<TChoice extends string>({
  prompt,
  choices,
  isMatch,
  consequence,
  matchedFeedback,
  unmatchedFeedback,
  onCommit,
  disabled = false,
}: PredictionConsequenceProps<TChoice>) {
  const groupName = useId();
  const [selectedChoice, setSelectedChoice] = useState<TChoice | null>(null);
  const [committedChoice, setCommittedChoice] = useState<TChoice | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isLocked = committedChoice !== null;
  const matched =
    committedChoice === null ? false : isMatch(committedChoice);

  function reveal(choice: TChoice, didMatch: boolean) {
    const result = onCommit(choice, didMatch);
    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            setCommittedChoice(choice);
          }
        })
        .finally(() => setIsPending(false));
      return;
    }

    if (result !== false) {
      setCommittedChoice(choice);
    }
  }

  return (
    <section data-prediction-consequence>
      <fieldset disabled={disabled || isPending || isLocked}>
        <legend>{prompt}</legend>
        <div data-prediction-choices>
          {choices.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={groupName}
                value={choice.value}
                checked={selectedChoice === choice.value}
                onChange={() => setSelectedChoice(choice.value)}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {!isLocked ? (
        <button
          type="button"
          onClick={() => {
            if (selectedChoice !== null) {
              reveal(selectedChoice, isMatch(selectedChoice));
            }
          }}
          disabled={disabled || isPending || selectedChoice === null}
        >
          Confirmar previsão
        </button>
      ) : (
        <div data-prediction-reveal aria-live="polite">
          <p data-consequence>{consequence}</p>
          <p data-feedback>{matched ? matchedFeedback : unmatchedFeedback}</p>
          <button
            type="button"
            onClick={() => {
              setCommittedChoice(null);
              setSelectedChoice(null);
            }}
            disabled={disabled}
          >
            Tentar outra previsão
          </button>
        </div>
      )}
    </section>
  );
}
