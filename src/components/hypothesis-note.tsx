"use client";

import { useState, type FormEvent } from "react";

const registeredFeedback =
  "Hipótese registrada. Você pode revisá-la quando outra pista mudar sua leitura.";

export interface HypothesisNoteProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onRegister?: (value: string) => void;
}

export function HypothesisNote({
  value,
  defaultValue = "",
  onValueChange,
  onRegister,
}: HypothesisNoteProps = {}) {
  const [internalDraft, setInternalDraft] = useState(defaultValue);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const draft = value ?? internalDraft;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setHasRegistered(true);
    setShowFeedback(true);
    onRegister?.(draft);
  }

  return (
    <form className="hypothesis-note" onSubmit={handleSubmit}>
      <label htmlFor="hypothesis-draft">Sua hipótese provisória</label>
      <textarea
        id="hypothesis-draft"
        name="hypothesis"
        rows={5}
        value={draft}
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
        <button type="submit" disabled={!draft.trim()}>
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
