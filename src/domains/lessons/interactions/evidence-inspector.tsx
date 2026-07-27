"use client";

import { useMemo, useState } from "react";

export interface EvidenceClue<TClueId extends string> {
  readonly id: TClueId;
  readonly title: string;
  readonly summary: string;
  readonly explanation: string;
  readonly unresolved: string;
  readonly optional?: boolean;
}

export interface ModelFitChoice<TModelFit extends string> {
  readonly value: TModelFit;
  readonly label: string;
}

export interface EvidenceInspectorProps<
  TClueId extends string,
  TModelFit extends string,
> {
  readonly clues: readonly EvidenceClue<TClueId>[];
  readonly firstClueId: TClueId;
  readonly modelFits: readonly ModelFitChoice<TModelFit>[];
  readonly openedClueIds?: readonly TClueId[];
  readonly completedComparisons?: Readonly<
    Partial<Record<TClueId, TModelFit>>
  >;
  readonly minimumCompleted?: number;
  readonly onInspect: (
    clueId: TClueId,
  ) => void | boolean | Promise<void | boolean>;
  readonly onCompare: (
    clueId: TClueId,
    modelFit: TModelFit,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () => void | boolean | Promise<void | boolean>;
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

export function EvidenceInspector<
  TClueId extends string,
  TModelFit extends string,
>({
  clues,
  firstClueId,
  modelFits,
  openedClueIds = [],
  completedComparisons,
  minimumCompleted = 2,
  onInspect,
  onCompare,
  onContinue,
  disabled = false,
}: EvidenceInspectorProps<TClueId, TModelFit>) {
  const [opened, setOpened] = useState<readonly TClueId[]>(openedClueIds);
  const [comparisons, setComparisons] = useState<
    Partial<Record<TClueId, TModelFit>>
  >({ ...completedComparisons });
  const [draftFits, setDraftFits] = useState<
    Partial<Record<TClueId, TModelFit>>
  >({ ...completedComparisons });
  const [dirtyClueIds, setDirtyClueIds] = useState<
    readonly TClueId[]
  >([]);
  const [activeClueId, setActiveClueId] = useState<TClueId | null>(null);
  const [showOptional, setShowOptional] = useState(
    clues.find((clue) => clue.id === firstClueId)?.optional === true ||
      openedClueIds.some(
        (clueId) => clues.find((clue) => clue.id === clueId)?.optional,
      ),
  );
  const [isPending, setIsPending] = useState(false);

  const orderedClues = useMemo(() => {
    const visible = clues.filter((clue) => !clue.optional || showOptional);
    const first = visible.find((clue) => clue.id === firstClueId);
    const rest = visible.filter((clue) => clue.id !== firstClueId);
    return [...(first ? [first] : []), ...rest];
  }, [clues, firstClueId, showOptional]);

  const activeClue =
    clues.find((clue) => clue.id === activeClueId) ?? null;
  const clueIds = new Set(clues.map((clue) => clue.id));
  const modelFitValues = new Set(modelFits.map((fit) => fit.value));
  const uniqueOpened = [...new Set(opened)].filter((clueId) =>
    clueIds.has(clueId),
  );
  function isComparisonCurrent(clueId: TClueId) {
    const comparison = comparisons[clueId];
    return (
      comparison !== undefined &&
      modelFitValues.has(comparison) &&
      draftFits[clueId] === comparison &&
      !dirtyClueIds.includes(clueId)
    );
  }
  const completedCount = uniqueOpened.filter(isComparisonCurrent).length;
  const pendingComparisonCount = uniqueOpened.length - completedCount;
  const canContinue =
    completedCount >= minimumCompleted && pendingComparisonCount === 0;

  function acceptResult(
    result: void | boolean | Promise<void | boolean>,
    update: () => void,
  ) {
    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            update();
          }
        })
        .finally(() => setIsPending(false));
      return;
    }

    if (result !== false) {
      update();
    }
  }

  function inspect(clueId: TClueId) {
    if (opened.includes(clueId)) {
      setActiveClueId(clueId);
      return;
    }

    acceptResult(onInspect(clueId), () => {
      setOpened((current) => [...current, clueId]);
      setActiveClueId(clueId);
    });
  }

  function compare(clueId: TClueId, modelFit: TModelFit) {
    acceptResult(onCompare(clueId, modelFit), () => {
      setComparisons((current) => ({ ...current, [clueId]: modelFit }));
      setDirtyClueIds((current) =>
        current.filter((dirtyClueId) => dirtyClueId !== clueId),
      );
    });
  }

  return (
    <section data-evidence-inspector>
      <div>
        <p data-inspector-kicker>Escolha a ordem da investigação</p>
        <ul aria-label="Pistas disponíveis">
          {orderedClues.map((clue) => {
            const isOpened = opened.includes(clue.id);
            return (
              <li key={clue.id} data-opened={isOpened || undefined}>
                <button
                  type="button"
                  onClick={() => inspect(clue.id)}
                  disabled={disabled || isPending}
                  aria-pressed={activeClueId === clue.id}
                  aria-label={`Examinar ${clue.title}${
                    isOpened ? ", pista aberta" : ""
                  }`}
                >
                  <span>{clue.title}</span>
                  {isOpened ? (
                    <span>
                      <span aria-label="Pista examinada">✓</span>{" "}
                      <span>Pista aberta</span>
                    </span>
                  ) : (
                    <span>Examinar</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {!showOptional ? (
          <button
            type="button"
            onClick={() => setShowOptional(true)}
            disabled={disabled || isPending}
          >
            Expor teste mais forte: repetir a fonte
          </button>
        ) : null}
      </div>

      <div data-active-clue>
        {activeClue ? (
          <>
            <p data-clue-label>Pista em exame</p>
            <h2>{activeClue.title}</h2>
            <p>{activeClue.summary}</p>
            <fieldset disabled={disabled || isPending}>
              <legend>Com qual modelo esta pista combina?</legend>
              {modelFits.map((fit) => (
                <label key={fit.value}>
                  <input
                    type="radio"
                    name={`model-fit-${activeClue.id}`}
                    value={fit.value}
                    checked={draftFits[activeClue.id] === fit.value}
                    onChange={() => {
                      const committedFit = comparisons[activeClue.id];
                      if (
                        committedFit !== undefined &&
                        modelFitValues.has(committedFit)
                      ) {
                        setDirtyClueIds((current) =>
                          current.includes(activeClue.id)
                            ? current
                            : [...current, activeClue.id],
                        );
                      }
                      setDraftFits((current) => ({
                        ...current,
                        [activeClue.id]: fit.value,
                      }));
                    }}
                  />
                  <span>{fit.label}</span>
                </label>
              ))}
            </fieldset>
            <button
              type="button"
              onClick={() => {
                const modelFit = draftFits[activeClue.id];
                if (
                  modelFit !== undefined &&
                  modelFitValues.has(modelFit)
                ) {
                  compare(activeClue.id, modelFit);
                }
              }}
              disabled={
                disabled ||
                isPending ||
                !modelFitValues.has(
                  draftFits[activeClue.id] as TModelFit,
                )
              }
            >
              Comparar modelos
            </button>
            {isComparisonCurrent(activeClue.id) ? (
              <div data-clue-feedback aria-live="polite">
                <p>{activeClue.explanation}</p>
                <p>{activeClue.unresolved}</p>
              </div>
            ) : null}
          </>
        ) : (
          <p>Abra uma pista para comparar o que ela explica.</p>
        )}
      </div>

      <div data-inspector-gate>
        <p aria-live="polite">
          {completedCount} de {minimumCompleted} comparações feitas
        </p>
        {pendingComparisonCount > 0 ? (
          <p>
            {pendingComparisonCount}{" "}
            {pendingComparisonCount === 1
              ? "pista aberta ainda precisa"
              : "pistas abertas ainda precisam"}{" "}
            de comparação.
          </p>
        ) : null}
        <button
          type="button"
          onClick={onContinue}
          disabled={disabled || isPending || !canContinue}
        >
          Pode continuar
        </button>
      </div>
    </section>
  );
}
