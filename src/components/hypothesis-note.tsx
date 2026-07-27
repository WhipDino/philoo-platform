"use client";

import { useState, type FormEvent } from "react";

const registeredFeedback =
  "Hipótese registrada. Você pode revisá-la quando outra pista mudar sua leitura.";

export interface HypothesisNoteProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onRegister?: (
    value: string,
  ) => void | boolean | Promise<void | boolean>;
}

export function HypothesisNote({
  value,
  defaultValue = "",
  disabled = false,
  onValueChange,
  onRegister,
}: HypothesisNoteProps = {}) {
  const [internalDraft, setInternalDraft] = useState(defaultValue);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const draft = value ?? internalDraft;
  const isDisabled = disabled || isRegistering;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || isDisabled) {
      return;
    }

    const showRegistered = () => {
      setHasRegistered(true);
      setShowFeedback(true);
    };
    const result = onRegister?.(draft);

    if (isPromiseLike(result)) {
      setIsRegistering(true);
      void result
        .then((succeeded) => {
          if (succeeded !== false) {
            showRegistered();
          }
        })
        .catch(() => {})
        .finally(() => setIsRegistering(false));
      return;
    }

    if (result !== false) {
      showRegistered();
    }
  }

  return (
    <form
      className="hypothesis-note"
      onSubmit={handleSubmit}
      aria-busy={isDisabled}
    >
      <label htmlFor="hypothesis-draft">Sua hipótese provisória</label>
      <textarea
        id="hypothesis-draft"
        name="hypothesis"
        rows={5}
        value={draft}
        disabled={isDisabled}
        onChange={(event) => {
          if (value === undefined) {
            setInternalDraft(event.target.value);
          }
          onValueChange?.(event.target.value);
          setShowFeedback(false);
        }}
        placeholder="Talvez as sombras..."
      />
      <div className="hypothesis-actions">
        <button type="submit" disabled={!draft.trim() || isDisabled}>
          {hasRegistered ? "Revisar hipótese" : "Registrar hipótese"}
          <span aria-hidden="true">→</span>
        </button>
        <span>
          Sua hipótese fica privada e volta com você nesta investigação.
        </span>
      </div>
      {showFeedback ? (
        <p className="hypothesis-feedback" role="status">
          {registeredFeedback}
        </p>
      ) : null}
    </form>
  );
}

function isPromiseLike<T>(
  value: T | Promise<T> | undefined,
): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}
