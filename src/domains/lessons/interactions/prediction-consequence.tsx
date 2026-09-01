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
  readonly consequence?: ReactNode;
  readonly matchedFeedback: ReactNode;
  readonly unmatchedFeedback: ReactNode;
  readonly confirmLabel?: string;
  readonly retryLabel?: string;
  readonly retryWhen?: "always" | "unmatched";
  readonly unlockOnMiss?: boolean;
  readonly matchedStatus?: string;
  readonly unmatchedStatus?: string;
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
  confirmLabel = "Confirmar previsão",
  retryLabel = "Tentar outra previsão",
  retryWhen = "always",
  unlockOnMiss = false,
  matchedStatus,
  unmatchedStatus,
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
  const missUnlocked = unlockOnMiss && isLocked && !matched;
  const choicesLocked = isLocked && !missUnlocked;
  const showConfirm = !isLocked || missUnlocked;
  const showRetry =
    isLocked &&
    !unlockOnMiss &&
    (retryWhen === "always" || !matched);

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
      <fieldset disabled={disabled || isPending || choicesLocked}>
        <legend>{prompt}</legend>
        <div data-prediction-choices>
          {choices.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={groupName}
                value={choice.value}
                checked={selectedChoice === choice.value}
                onChange={() => {
                  setSelectedChoice(choice.value);
                  if (missUnlocked) {
                    setCommittedChoice(null);
                  }
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showConfirm ? (
        <button
          type="button"
          onClick={() => {
            if (selectedChoice !== null) {
              reveal(selectedChoice, isMatch(selectedChoice));
            }
          }}
          disabled={disabled || isPending || selectedChoice === null}
        >
          {confirmLabel}
        </button>
      ) : null}

      {isLocked ? (
        <div
          data-prediction-reveal
          data-matched={matched ? "true" : "false"}
          aria-live="polite"
        >
          {matched && matchedStatus ? (
            <p data-prediction-status>{matchedStatus}</p>
          ) : null}
          {!matched && unmatchedStatus ? (
            <p data-prediction-status>{unmatchedStatus}</p>
          ) : null}
          {consequence ? <p data-consequence>{consequence}</p> : null}
          <p data-feedback>{matched ? matchedFeedback : unmatchedFeedback}</p>
          {showRetry ? (
            <button
              type="button"
              onClick={() => {
                setCommittedChoice(null);
                setSelectedChoice(null);
              }}
              disabled={disabled}
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
