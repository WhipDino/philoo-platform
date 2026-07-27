"use client";

import { useState, type FormEvent } from "react";

const registeredFeedback =
  "Hipótese registrada. Você pode revisá-la quando outra pista mudar sua leitura.";

export function HypothesisNote() {
  const [draft, setDraft] = useState("");
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setHasRegistered(true);
    setShowFeedback(true);
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
          setDraft(event.target.value);
          setShowFeedback(false);
        }}
        placeholder="Talvez as sombras..."
      />
      <div className="hypothesis-actions">
        <button type="submit" disabled={!draft.trim()}>
          {hasRegistered ? "Revisar hipótese" : "Registrar hipótese"}
          <span aria-hidden="true">→</span>
        </button>
        <span>Esta anotação fica apenas nesta tela por enquanto.</span>
      </div>
      {showFeedback ? (
        <p className="hypothesis-feedback" role="status">
          {registeredFeedback}
        </p>
      ) : null}
    </form>
  );
}
