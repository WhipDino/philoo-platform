"use client";

import {
  useId,
  useRef,
  useState,
} from "react";
import {
  ConfidenceControl,
  type ConfidenceLevel,
} from "./confidence-control";
import {
  assembleCerSentence,
  cerMoveNames,
  cerMoveOrder,
  isCerResponseBuilt,
  isCerResponseCoherent,
  sanitizeCerResponse,
  type CerMove,
  type CerResponseConfig,
  type CerResponseValue,
  type CerReview,
} from "./cer-response-state";

export {
  assembleCerSentence,
  isCerResponseBuilt,
  isCerResponseCoherent,
  sanitizeCerResponse,
} from "./cer-response-state";
export type {
  CerBridgeChoice,
  CerChoice,
  CerClaimChoice,
  CerMove,
  CerResponseConfig,
  CerResponseValue,
  CerReview,
} from "./cer-response-state";

export interface CerResponseProps {
  readonly config: CerResponseConfig;
  readonly initialValue?: CerResponseValue | unknown;
  readonly onClaimBuilt: (value: {
    readonly claim: string;
    readonly nextEvidence: string | null;
  }) => void | boolean | Promise<void | boolean>;
  readonly onEvidenceLinked: (value: {
    readonly clue: string;
    readonly bridge: string;
  }) => void | boolean | Promise<void | boolean>;
  readonly onRivalAcknowledged: (
    value: string,
  ) => void | boolean | Promise<void | boolean>;
  readonly onConfidenceRecorded: (
    value: ConfidenceLevel,
  ) => void | boolean | Promise<void | boolean>;
  readonly onReview: (
    value: CerReview,
  ) => void | boolean | Promise<void | boolean>;
  readonly onValidityChange?: (isValid: boolean) => void;
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

export function CerResponse({
  config,
  initialValue,
  onClaimBuilt,
  onEvidenceLinked,
  onRivalAcknowledged,
  onConfidenceRecorded,
  onReview,
  onValidityChange,
  disabled = false,
}: CerResponseProps) {
  const claimGroup = useId();
  const evidenceGroup = useId();
  const bridgeGroup = useId();
  const acknowledgmentGroup = useId();
  const nextEvidenceGroup = useId();
  const pendingRef = useRef(false);
  const [value, setValue] = useState<CerResponseValue>(() =>
    sanitizeCerResponse(initialValue, config),
  );
  const [draftClaim, setDraftClaim] = useState<string | null>(
    value.claim ?? null,
  );
  const [draftNextEvidence, setDraftNextEvidence] = useState<string | null>(
    value.nextEvidence ?? null,
  );
  const [draftClue, setDraftClue] = useState<string | null>(
    value.clue ?? null,
  );
  const [draftBridge, setDraftBridge] = useState<string | null>(
    value.bridge ?? null,
  );
  const [draftAcknowledgment, setDraftAcknowledgment] =
    useState<string | null>(value.acknowledgment ?? null);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingDrafts, setPendingDrafts] = useState({
    claim: false,
    evidence: false,
    acknowledgment: false,
    confidence: false,
  });
  const [isPending, setIsPending] = useState(false);
  const selectedClaim = config.claims.find(
    (choice) => choice.value === draftClaim,
  );
  const isDisabled = disabled || isPending;
  const built = isCerResponseBuilt(value, config);
  const hasUncommittedDraft = Object.values(pendingDrafts).some(Boolean);

  function markDirty(
    section?: keyof typeof pendingDrafts,
  ) {
    setIsDirty(true);
    onValidityChange?.(false);
    if (section) {
      setPendingDrafts((current) => ({
        ...current,
        [section]: true,
      }));
    }
  }

  function markRecorded(section: keyof typeof pendingDrafts) {
    setPendingDrafts((current) => ({
      ...current,
      [section]: false,
    }));
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

  function invalidateReview(
    patch: Partial<CerResponseValue>,
  ): CerResponseValue {
    const next = { ...value, ...patch };
    delete (next as { reviewed?: boolean }).reviewed;
    delete (next as { coherent?: boolean }).coherent;
    return next;
  }

  function reorder(move: CerMove, difference: -1 | 1) {
    const order = [...(value.order ?? cerMoveOrder)];
    const index = order.indexOf(move);
    const target = index + difference;
    if (index < 0 || target < 0 || target >= order.length) {
      return;
    }
    [order[index], order[target]] = [order[target], order[index]];
    setValue(invalidateReview({ order }));
    markDirty();
  }

  const reviewFeedback =
    !isDirty && value.reviewed === true
      ? value.coherent
        ? "Sua pista e sua conclusão estão ligadas por uma relação explícita."
        : `Sua pista descreve ${
            value.clue === "forma"
              ? "a forma"
              : value.clue === "som"
                ? "o som"
                : "um aspecto"
          }, mas sua conclusão pede outra relação. Que ligação conecta as duas?`
      : null;

  return (
    <section data-cer-response aria-label="Construção da resposta">
      <div data-cer-fields>
        <fieldset disabled={isDisabled}>
          <legend>1. Qual afirmação você consegue defender?</legend>
          {config.claims.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={claimGroup}
                value={choice.value}
                checked={draftClaim === choice.value}
                onChange={() => {
                  setDraftClaim(choice.value);
                  markDirty("claim");
                  if (!choice.requiresNextEvidence) {
                    setDraftNextEvidence(null);
                  }
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
          {selectedClaim?.requiresNextEvidence ? (
            <div data-next-evidence>
              <p>Que evidência permitiria decidir melhor?</p>
              {config.nextEvidence.map((choice) => (
                <label key={choice.value}>
                  <input
                    type="radio"
                    name={nextEvidenceGroup}
                    value={choice.value}
                    checked={draftNextEvidence === choice.value}
                    onChange={() => {
                      setDraftNextEvidence(choice.value);
                      markDirty("claim");
                    }}
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (!draftClaim) {
                return;
              }
              const nextEvidence =
                selectedClaim?.requiresNextEvidence
                  ? draftNextEvidence
                  : null;
              runAccepted(
                () =>
                  onClaimBuilt({
                    claim: draftClaim,
                    nextEvidence,
                  }),
                () => {
                  setValue(
                    invalidateReview({
                      claim: draftClaim,
                      nextEvidence,
                    }),
                  );
                  markRecorded("claim");
                },
              );
            }}
            disabled={
              isDisabled ||
              !draftClaim ||
              Boolean(
                selectedClaim?.requiresNextEvidence &&
                  !draftNextEvidence,
              )
            }
          >
            Registrar afirmação
          </button>
        </fieldset>

        <fieldset disabled={isDisabled}>
          <legend>2. Qual pista você inspecionou?</legend>
          {config.clues.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={evidenceGroup}
                value={choice.value}
                checked={draftClue === choice.value}
                onChange={() => {
                  setDraftClue(choice.value);
                  markDirty("evidence");
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
          <p>Que relação leva dessa pista à conclusão?</p>
          {config.bridges.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={bridgeGroup}
                value={choice.value}
                checked={draftBridge === choice.value}
                onChange={() => {
                  setDraftBridge(choice.value);
                  markDirty("evidence");
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => {
              if (!draftClue || !draftBridge) {
                return;
              }
              runAccepted(
                () =>
                  onEvidenceLinked({
                    clue: draftClue,
                    bridge: draftBridge,
                  }),
                () => {
                  setValue(
                    invalidateReview({
                      clue: draftClue,
                      bridge: draftBridge,
                    }),
                  );
                  markRecorded("evidence");
                },
              );
            }}
            disabled={isDisabled || !draftClue || !draftBridge}
          >
            Ligar pista e conclusão
          </button>
        </fieldset>

        <fieldset disabled={isDisabled}>
          <legend>3. O que o modelo antigo ainda explica bem?</legend>
          {config.acknowledgments.map((choice) => (
            <label key={choice.value}>
              <input
                type="radio"
                name={acknowledgmentGroup}
                value={choice.value}
                checked={draftAcknowledgment === choice.value}
                onChange={() => {
                  setDraftAcknowledgment(choice.value);
                  markDirty("acknowledgment");
                }}
              />
              <span>{choice.label}</span>
            </label>
          ))}
          <button
            type="button"
            onClick={() => {
              if (!draftAcknowledgment) {
                return;
              }
              runAccepted(
                () => onRivalAcknowledged(draftAcknowledgment),
                () => {
                  setValue(
                    invalidateReview({
                      acknowledgment: draftAcknowledgment,
                    }),
                  );
                  markRecorded("acknowledgment");
                },
              );
            }}
            disabled={isDisabled || !draftAcknowledgment}
          >
            Registrar reconhecimento
          </button>
        </fieldset>

        <ConfidenceControl
          prompt="4. Quanta confiança você tem nesta resposta?"
          value={value.confidence}
          disabled={isDisabled}
          onDirty={() => markDirty("confidence")}
          onRecord={(confidence) => {
            const result = onConfidenceRecorded(confidence);
            const accept = () => {
              setValue(
                invalidateReview({ confidence }),
              );
              markRecorded("confidence");
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
      </div>

      <section data-cer-assembly aria-labelledby="cer-assembly-title">
        <p id="cer-assembly-title">Resposta em construção</p>
        <p
          role="status"
          aria-label="Resposta construída"
          aria-live="polite"
        >
          {assembleCerSentence(value, config)}
        </p>
        <ol aria-label="Ordem dos movimentos da resposta">
          {(value.order ?? cerMoveOrder).map((moveId, index, order) => (
            <li key={moveId}>
              <span>{cerMoveNames[moveId]}</span>
              <button
                type="button"
                onClick={() => reorder(moveId, -1)}
                disabled={isDisabled || index === 0}
                aria-label={`Mover ${cerMoveNames[moveId]} para cima`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => reorder(moveId, 1)}
                disabled={isDisabled || index === order.length - 1}
                aria-label={`Mover ${cerMoveNames[moveId]} para baixo`}
              >
                ↓
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          disabled={isDisabled || !built || hasUncommittedDraft}
          onClick={() => {
            if (!isCerResponseBuilt(value, config)) {
              return;
            }
            const review: CerReview = {
              ...value,
              claim: value.claim,
              clue: value.clue,
              bridge: value.bridge,
              acknowledgment: value.acknowledgment,
              confidence: value.confidence,
              order: value.order ?? cerMoveOrder,
              reviewed: true,
              coherent: isCerResponseCoherent(value, config),
            };
            runAccepted(
              () => onReview(review),
              () => {
                setValue(review);
                setIsDirty(false);
                onValidityChange?.(review.coherent);
              },
            );
          }}
        >
          Pedir revisão da resposta
        </button>
        {reviewFeedback ? (
          <p data-cer-feedback role="status">
            {reviewFeedback}
          </p>
        ) : null}
      </section>
    </section>
  );
}
