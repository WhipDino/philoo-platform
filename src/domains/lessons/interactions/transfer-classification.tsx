"use client";

import {
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ConfidenceControl,
  isConfidenceLevel,
  type ConfidenceLevel,
} from "./confidence-control";

export type TransferCategory =
  | "representation"
  | "source_event"
  | "claim";
export type EvidenceSufficiency = "sufficient" | "insufficient";
export type TransferNextEvidence =
  | "minutes"
  | "recording"
  | "participants";

export interface TransferAnswers {
  readonly representation: TransferCategory;
  readonly sourceEvent: TransferCategory;
  readonly caption: TransferCategory;
  readonly sufficiency: EvidenceSufficiency;
  readonly nextEvidence: TransferNextEvidence;
}

export interface TransferClassificationValue
  extends Partial<TransferAnswers> {
  readonly confidence?: ConfidenceLevel;
  readonly contextRevealed?: boolean;
  readonly classified?: boolean;
}

export interface TransferClassificationProps {
  readonly caption: string;
  readonly renderRepresentation: (expanded: boolean) => ReactNode;
  readonly initialValue?: TransferClassificationValue | unknown;
  readonly canComplete: boolean;
  readonly onConfidenceRecorded: (
    value: ConfidenceLevel,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContextRevealed: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly onClassified: (
    value: TransferAnswers,
  ) => void | boolean | Promise<void | boolean>;
  readonly onComplete: () => void | boolean | Promise<void | boolean>;
  readonly contextReview?: ReactNode;
  readonly disabled?: boolean;
}

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

function isTransferCategory(
  value: unknown,
): value is TransferCategory {
  return (
    value === "representation" ||
    value === "source_event" ||
    value === "claim"
  );
}

function isEvidenceSufficiency(
  value: unknown,
): value is EvidenceSufficiency {
  return value === "sufficient" || value === "insufficient";
}

function isNextEvidence(
  value: unknown,
): value is TransferNextEvidence {
  return (
    value === "minutes" ||
    value === "recording" ||
    value === "participants"
  );
}

export function sanitizeTransferClassification(
  value: unknown,
): TransferClassificationValue {
  if (!isRecord(value)) {
    return {};
  }
  const confidence = isConfidenceLevel(value.confidence)
    ? value.confidence
    : undefined;
  const representation = isTransferCategory(value.representation)
    ? value.representation
    : undefined;
  const sourceEvent = isTransferCategory(value.sourceEvent)
    ? value.sourceEvent
    : undefined;
  const caption = isTransferCategory(value.caption)
    ? value.caption
    : undefined;
  const sufficiency = isEvidenceSufficiency(value.sufficiency)
    ? value.sufficiency
    : undefined;
  const nextEvidence = isNextEvidence(value.nextEvidence)
    ? value.nextEvidence
    : undefined;
  const answersComplete = Boolean(
    representation &&
      sourceEvent &&
      caption &&
      sufficiency &&
      nextEvidence,
  );

  return {
    ...(confidence ? { confidence } : {}),
    ...(value.contextRevealed === true && confidence
      ? { contextRevealed: true }
      : {}),
    ...(representation ? { representation } : {}),
    ...(sourceEvent ? { sourceEvent } : {}),
    ...(caption ? { caption } : {}),
    ...(sufficiency ? { sufficiency } : {}),
    ...(nextEvidence ? { nextEvidence } : {}),
    ...(value.classified === true && answersComplete
      ? { classified: true }
      : {}),
  };
}

export function isTransferComplete(
  value: TransferClassificationValue,
): value is TransferClassificationValue & TransferAnswers {
  return Boolean(
    value.confidence &&
      value.contextRevealed &&
      value.classified &&
      value.representation &&
      value.sourceEvent &&
      value.caption &&
      value.sufficiency &&
      value.nextEvidence,
  );
}

const categoryOptions: readonly {
  value: TransferCategory;
  label: string;
}[] = [
  { value: "representation", label: "representação" },
  { value: "source_event", label: "acontecimento-fonte" },
  { value: "claim", label: "afirmação" },
];

const nextEvidenceOptions: readonly {
  value: TransferNextEvidence;
  label: string;
}[] = [
  { value: "minutes", label: "Consultar a ata da reunião" },
  { value: "recording", label: "Ver a gravação completa" },
  {
    value: "participants",
    label: "Ouvir relatos de participantes",
  },
];

export function TransferClassification({
  caption,
  renderRepresentation,
  initialValue,
  canComplete,
  onConfidenceRecorded,
  onContextRevealed,
  onClassified,
  onComplete,
  contextReview,
  disabled = false,
}: TransferClassificationProps) {
  const representationGroup = useId();
  const sourceGroup = useId();
  const captionGroup = useId();
  const sufficiencyGroup = useId();
  const nextEvidenceGroup = useId();
  const pendingRef = useRef(false);
  const [value, setValue] = useState<TransferClassificationValue>(() =>
    sanitizeTransferClassification(initialValue),
  );
  const [draft, setDraft] = useState<TransferClassificationValue>(value);
  const [isPending, setIsPending] = useState(false);
  const isDisabled = disabled || isPending;
  const answersReady = Boolean(
    draft.representation &&
      draft.sourceEvent &&
      draft.caption &&
      draft.sufficiency &&
      draft.nextEvidence,
  );

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

  function categoryFieldset(
    legend: string,
    subject: string,
    groupName: string,
    field: "representation" | "sourceEvent" | "caption",
  ) {
    return (
      <fieldset disabled={isDisabled}>
        <legend>{legend}</legend>
        {categoryOptions.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={draft[field] === option.value}
              aria-label={`${subject}: ${option.label}`}
              onChange={() =>
                setDraft((current) => ({
                  ...current,
                  [field]: option.value,
                  classified: false,
                }))
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <section data-transfer-classification>
      <figure data-transfer-figure data-expanded={value.contextRevealed}>
        <div>{renderRepresentation(value.contextRevealed === true)}</div>
        <figcaption>
          <span>Afirmação da legenda</span>
          <strong>{caption}</strong>
        </figcaption>
      </figure>

      {!value.contextRevealed ? (
        <section data-transfer-confidence>
          <ConfidenceControl
            prompt="Antes de ampliar: quanta confiança você tem na legenda?"
            value={value.confidence}
            disabled={isDisabled}
            onRecord={(confidence) => {
              const result = onConfidenceRecorded(confidence);
              const accept = () => {
                const next = { ...value, confidence };
                setValue(next);
                setDraft(next);
              };
              if (isPromiseLike(result)) {
                return result.then((accepted) => {
                  if (accepted !== false) {
                    accept();
                  }
                  return accepted;
                });
              }
              if (result !== false) {
                accept();
              }
              return result;
            }}
          />
          <button
            type="button"
            disabled={isDisabled || !value.confidence}
            onClick={() =>
              runAccepted(onContextRevealed, () => {
                const next = {
                  ...value,
                  contextRevealed: true,
                };
                setValue(next);
                setDraft(next);
              })
            }
          >
            Revelar contexto mais amplo
          </button>
        </section>
      ) : (
        <>
          {contextReview}
          <section data-transfer-fields>
            {categoryFieldset(
              "O que é a imagem recortada?",
              "A imagem recortada",
              representationGroup,
              "representation",
            )}
            {categoryFieldset(
              "O que é a reunião completa?",
              "A reunião",
              sourceGroup,
              "sourceEvent",
            )}
            {categoryFieldset(
              "O que é a legenda?",
              "A legenda",
              captionGroup,
              "caption",
            )}
            <fieldset disabled={isDisabled}>
              <legend>
                A evidência atual basta para afirmar que “todos”
                apoiaram?
              </legend>
              <label>
                <input
                  type="radio"
                  name={sufficiencyGroup}
                  value="sufficient"
                  checked={draft.sufficiency === "sufficient"}
                  aria-label="A evidência atual para “todos”: suficiente"
                  onChange={() =>
                    setDraft((current) => ({
                      ...current,
                      sufficiency: "sufficient",
                      classified: false,
                    }))
                  }
                />
                <span>suficiente</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={sufficiencyGroup}
                  value="insufficient"
                  checked={draft.sufficiency === "insufficient"}
                  aria-label="A evidência atual para “todos”: insuficiente"
                  onChange={() =>
                    setDraft((current) => ({
                      ...current,
                      sufficiency: "insufficient",
                      classified: false,
                    }))
                  }
                />
                <span>insuficiente</span>
              </label>
            </fieldset>
            <fieldset disabled={isDisabled}>
              <legend>Qual fonte você buscaria em seguida?</legend>
              {nextEvidenceOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={nextEvidenceGroup}
                    value={option.value}
                    checked={draft.nextEvidence === option.value}
                    onChange={() =>
                      setDraft((current) => ({
                        ...current,
                        nextEvidence: option.value,
                        classified: false,
                      }))
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          </section>

          <button
            type="button"
            disabled={isDisabled || !answersReady}
            onClick={() => {
              if (
                !draft.representation ||
                !draft.sourceEvent ||
                !draft.caption ||
                !draft.sufficiency ||
                !draft.nextEvidence
              ) {
                return;
              }
              const answers: TransferAnswers = {
                representation: draft.representation,
                sourceEvent: draft.sourceEvent,
                caption: draft.caption,
                sufficiency: draft.sufficiency,
                nextEvidence: draft.nextEvidence,
              };
              runAccepted(
                () => onClassified(answers),
                () => {
                  const next = {
                    ...value,
                    ...answers,
                    classified: true,
                  };
                  setValue(next);
                  setDraft(next);
                },
              );
            }}
          >
            Comparar classificações
          </button>

          {value.classified ? (
            <section data-transfer-review aria-live="polite">
              <p>
                Compare sua leitura com as funções que cada elemento
                cumpre:
              </p>
              <ul>
                <li>Imagem recortada → representação</li>
                <li>Reunião → acontecimento-fonte</li>
                <li>Legenda → afirmação</li>
                <li>
                  Evidência atual → insuficiente para “todos”
                </li>
              </ul>
              <p>
                Uma primeira classificação pode mudar quando o contexto
                aparece. O importante é tornar a comparação explícita.
              </p>
              <button
                type="button"
                onClick={onComplete}
                disabled={isDisabled || !canComplete}
              >
                Concluir investigação
              </button>
              {!canComplete ? (
                <p role="status">
                  Ainda falta registrar uma etapa essencial do caminho de
                  evidências.
                </p>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </section>
  );
}
