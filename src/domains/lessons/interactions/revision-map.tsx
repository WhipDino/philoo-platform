"use client";

import {
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type RevisionStrategy = "maintain" | "revise" | "uncertain";

export interface RevisionClueOption {
  readonly value: string;
  readonly label: string;
}

export interface RevisionMapValue {
  readonly strategy?: RevisionStrategy;
  readonly decisiveClue?: string;
  readonly recorded?: boolean;
}

export interface RevisionRecord {
  readonly strategy: RevisionStrategy;
  readonly decisiveClue: string;
}

export interface RevisionMapProps {
  readonly initialHypothesis: string | null;
  readonly clueOptions: readonly RevisionClueOption[];
  readonly initialValue?: RevisionMapValue | unknown;
  readonly privateNote?: string;
  readonly onHypothesisRevisited: (
    strategy: RevisionStrategy,
  ) => void | boolean | Promise<void | boolean>;
  readonly onRevisionRecorded: (
    revision: RevisionRecord,
    privateNote: string,
  ) => void | boolean | Promise<void | boolean>;
  readonly onValidityChange?: (isValid: boolean) => void;
  readonly reviewer?: (strategy: RevisionStrategy) => ReactNode;
  readonly disabled?: boolean;
}

const strategyOptions: readonly {
  value: RevisionStrategy;
  label: string;
  description: string;
}[] = [
  {
    value: "maintain",
    label: "Manter",
    description: "As novas pistas ainda combinam com minha leitura.",
  },
  {
    value: "revise",
    label: "Revisar",
    description: "Uma pista exige mudar parte da minha leitura.",
  },
  {
    value: "uncertain",
    label: "Ainda não sei",
    description: "Consigo nomear a dúvida e a pista que a tornou precisa.",
  },
];

function isRecord(
  value: unknown,
): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

export function isRevisionStrategy(
  value: unknown,
): value is RevisionStrategy {
  return (
    value === "maintain" ||
    value === "revise" ||
    value === "uncertain"
  );
}

export function sanitizeRevisionMap(
  value: unknown,
  clueOptions: readonly RevisionClueOption[],
): RevisionMapValue {
  if (!isRecord(value)) {
    return {};
  }
  const strategy = isRevisionStrategy(value.strategy)
    ? value.strategy
    : undefined;
  const decisiveClue =
    typeof value.decisiveClue === "string" &&
    clueOptions.some((clue) => clue.value === value.decisiveClue)
      ? value.decisiveClue
      : undefined;
  return {
    ...(strategy ? { strategy } : {}),
    ...(decisiveClue ? { decisiveClue } : {}),
    ...(value.recorded === true && strategy && decisiveClue
      ? { recorded: true }
      : {}),
  };
}

export function isRevisionComplete(
  value: RevisionMapValue,
): value is RevisionMapValue & RevisionRecord {
  return Boolean(
    value.recorded &&
      value.strategy &&
      value.decisiveClue,
  );
}

export function RevisionMap({
  initialHypothesis,
  clueOptions,
  initialValue,
  privateNote = "",
  onHypothesisRevisited,
  onRevisionRecorded,
  onValidityChange,
  reviewer,
  disabled = false,
}: RevisionMapProps) {
  const strategyGroup = useId();
  const clueGroup = useId();
  const pendingRef = useRef(false);
  const [value, setValue] = useState<RevisionMapValue>(() =>
    sanitizeRevisionMap(initialValue, clueOptions),
  );
  const [draftStrategy, setDraftStrategy] =
    useState<RevisionStrategy | null>(value.strategy ?? null);
  const [draftClue, setDraftClue] = useState<string | null>(
    value.decisiveClue ?? null,
  );
  const [draftNote, setDraftNote] = useState(privateNote);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const isDisabled = disabled || isPending;
  const hasInitialHypothesis =
    typeof initialHypothesis === "string" &&
    initialHypothesis.trim().length > 0;

  function markDirty() {
    setIsDirty(true);
    onValidityChange?.(false);
  }

  function runAccepted(
    action: () => void | boolean | Promise<void | boolean>,
    update: () => void,
  ) {
    if (isDisabled || pendingRef.current) {
      return;
    }
    pendingRef.current = true;
    const result = action();
    const finish = () => {
      pendingRef.current = false;
      setIsPending(false);
    };

    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            update();
          }
        })
        .catch(() => {})
        .finally(finish);
      return;
    }
    if (result !== false) {
      update();
    }
    finish();
  }

  const nowText =
    value.recorded && value.strategy
      ? draftNote.trim() ||
        (value.strategy === "maintain"
          ? initialHypothesis
          : value.strategy === "revise"
            ? "Você marcou uma revisão sem precisar escrever uma nova formulação."
            : "Você registrou uma dúvida precisa sem forçar uma conclusão.")
      : null;

  return (
    <section data-revision-map aria-label="Mapa de revisão">
      <div data-hypothesis-before>
        <p>Antes</p>
        {hasInitialHypothesis ? (
          <blockquote data-testid="initial-hypothesis">
            {initialHypothesis}
          </blockquote>
        ) : (
          <div>
            <h2>Você ainda pode registrar sua leitura de agora</h2>
            <p>
              Não há uma hipótese salva para comparar. Isso não torna sua
              leitura atual menos válida.
            </p>
          </div>
        )}
      </div>

      <fieldset disabled={isDisabled}>
        <legend>Depois das pistas, qual estratégia descreve sua leitura?</legend>
        {strategyOptions.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={strategyGroup}
              value={option.value}
              aria-label={option.label}
              checked={draftStrategy === option.value}
              onChange={() => {
                setDraftStrategy(option.value);
                markDirty();
              }}
            />
            <span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
        <button
          type="button"
          disabled={
            isDisabled ||
            !draftStrategy ||
            draftStrategy === value.strategy
          }
          onClick={() => {
            if (!draftStrategy) {
              return;
            }
            runAccepted(
              () => onHypothesisRevisited(draftStrategy),
              () => {
                setValue({ strategy: draftStrategy });
                setDraftClue(null);
              },
            );
          }}
        >
          Registrar estratégia
        </button>
      </fieldset>

      {value.strategy ? (
        <section data-revision-evidence>
          <fieldset disabled={isDisabled}>
            <legend>Qual pista foi decisiva para essa estratégia?</legend>
            {clueOptions.map((clue) => (
              <label key={clue.value}>
                <input
                  type="radio"
                  name={clueGroup}
                  value={clue.value}
                  aria-label={clue.label}
                  checked={draftClue === clue.value}
                  onChange={() => {
                    setDraftClue(clue.value);
                    markDirty();
                  }}
                />
                <span>{clue.label}</span>
              </label>
            ))}
          </fieldset>

          <label data-private-revision>
            <span>Sua leitura de agora (opcional)</span>
            <textarea
              rows={4}
              value={draftNote}
              disabled={isDisabled}
              onChange={(event) => {
                setDraftNote(event.target.value);
                markDirty();
              }}
            />
          </label>
          <p>
            Este texto continua privado. A estratégia e a pista podem
            compor a evidência da atividade.
          </p>

          <button
            type="button"
            disabled={isDisabled || !draftClue}
            onClick={() => {
              if (!value.strategy || !draftClue) {
                return;
              }
              const revision = {
                strategy: value.strategy,
                decisiveClue: draftClue,
              };
              runAccepted(
                () => onRevisionRecorded(revision, draftNote),
                () => {
                  setValue({
                    ...revision,
                    recorded: true,
                  });
                  setIsDirty(false);
                  onValidityChange?.(true);
                },
              );
            }}
          >
            Registrar comparação
          </button>
        </section>
      ) : null}

      {!isDirty && isRevisionComplete(value) ? (
        <section data-revision-comparison aria-live="polite">
          <div>
            <p>Antes</p>
            <p>
              {hasInitialHypothesis
                ? initialHypothesis
                : "Sem hipótese registrada no prólogo."}
            </p>
          </div>
          <div>
            <p>Agora</p>
            <p>{nowText}</p>
          </div>
          {reviewer?.(value.strategy)}
        </section>
      ) : null}
    </section>
  );
}
