"use client";

import { useId, useRef, useState } from "react";

export type ConfidenceLevel = "baixa" | "media" | "alta";

const confidenceOptions: readonly {
  value: ConfidenceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "baixa",
    label: "Baixa",
    description: "Ainda faltam pistas importantes.",
  },
  {
    value: "media",
    label: "Média",
    description: "A explicação é plausível, mas ainda pode mudar.",
  },
  {
    value: "alta",
    label: "Alta",
    description: "As pistas atuais sustentam bem esta leitura.",
  },
];

export interface ConfidenceControlProps {
  readonly prompt: string;
  readonly value?: ConfidenceLevel | null;
  readonly onRecord: (
    value: ConfidenceLevel,
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

export function ConfidenceControl({
  prompt,
  value = null,
  onRecord,
  disabled = false,
}: ConfidenceControlProps) {
  const groupName = useId();
  const pendingRef = useRef(false);
  const [draft, setDraft] = useState<ConfidenceLevel | null>(value);
  const [recorded, setRecorded] = useState<ConfidenceLevel | null>(value);
  const [isPending, setIsPending] = useState(false);
  const isDisabled = disabled || isPending;
  const isCurrent = draft !== null && draft === recorded;

  function record() {
    if (!draft || isDisabled || pendingRef.current) {
      return;
    }

    pendingRef.current = true;
    const result = onRecord(draft);
    const accept = () => setRecorded(draft);
    const finish = () => {
      pendingRef.current = false;
      setIsPending(false);
    };

    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            accept();
          }
        })
        .catch(() => {})
        .finally(finish);
      return;
    }

    if (result !== false) {
      accept();
    }
    finish();
  }

  return (
    <section data-confidence-control>
      <fieldset disabled={isDisabled}>
        <legend>{prompt}</legend>
        <div data-confidence-options>
          {confidenceOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name={groupName}
                value={option.value}
                aria-label={option.label}
                checked={draft === option.value}
                onChange={() => setDraft(option.value)}
              />
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={record}
        disabled={isDisabled || draft === null || isCurrent}
      >
        Registrar confiança
      </button>
      <p aria-live="polite">
        {isCurrent && recorded
          ? `Confiança ${confidenceLabel(recorded).toLowerCase()} registrada.`
          : ""}
      </p>
    </section>
  );
}

export function isConfidenceLevel(
  value: unknown,
): value is ConfidenceLevel {
  return value === "baixa" || value === "media" || value === "alta";
}

export function confidenceLabel(value: ConfidenceLevel): string {
  return (
    confidenceOptions.find((option) => option.value === value)?.label ??
    value
  );
}
