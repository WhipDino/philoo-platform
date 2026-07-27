"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AttemptSnapshot,
  AttemptStore,
  ResponseEnvelope,
  VisibilityClass,
} from "../contracts";
import { LocalAttemptStore } from "../local-attempt-store";
import {
  LessonPlayer,
  type LessonSceneRenderProps,
} from "../lesson-player";
import {
  AnomalyScene,
  type AnomalyClueId,
} from "./anomaly-scene";
import {
  EvidenceInvestigationScene,
  type CaveModelFit,
} from "./evidence-investigation-scene";
import {
  DefendModelScene,
  isDefendedModelComplete,
  sanitizeDefendModelValue,
} from "./defend-model-scene";
import {
  asSombrasManifest,
  type CaveScene,
} from "./manifest";
import {
  PredictionMasteryScene,
  sanitizeWallForecasts,
} from "./prediction-mastery-scene";
import {
  PrisonerViewScene,
  type ObservationClassification,
  type ObservationStatementId,
} from "./prisoner-view-scene";
import { PrologueScene } from "./prologue-scene";
import {
  REVISION_CLUE_OPTIONS,
  RevisionScene,
  isRevisionEvidenceComplete,
  sanitizeRevisionSceneValue,
} from "./revision-scene";
import {
  ShadowLaboratory,
  sanitizeShadowLaboratoryState,
} from "./shadow-laboratory";
import { SHADOW_CAUSAL_LINKS } from "./shadow-model";
import {
  CAVE_RESPONSE_KEYS,
  PROLOGUE_HYPOTHESIS_RESPONSE_KEY,
} from "./state";
import {
  isTransferComplete,
  sanitizeTransferClassification,
} from "../interactions/transfer-classification";
import { TransferScene } from "./transfer-scene";
import styles from "./as-sombras.module.css";

const REVISION_PRIVATE_RESPONSE_KEY = "revisionPrivateNote";

class VolatileStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

export class ResilientStorage implements Storage {
  private primary: Storage | null;
  private readonly fallback = new VolatileStorage();

  constructor(primary: Storage | null) {
    this.primary = primary;
  }

  get length() {
    return this.run((storage) => storage.length);
  }

  clear() {
    this.run((storage) => storage.clear());
  }

  getItem(key: string) {
    return this.run((storage) => storage.getItem(key));
  }

  key(index: number) {
    return this.run((storage) => storage.key(index));
  }

  removeItem(key: string) {
    this.run((storage) => storage.removeItem(key));
  }

  setItem(key: string, value: string) {
    this.run((storage) => storage.setItem(key, value));
  }

  private run<T>(operation: (storage: Storage) => T): T {
    if (this.primary) {
      try {
        return operation(this.primary);
      } catch {
        this.primary = null;
      }
    }

    return operation(this.fallback);
  }
}

export function AsSombrasPlayer() {
  const [store, setStore] = useState<LocalAttemptStore | null>(null);

  useEffect(() => {
    let active = true;
    let browserStorage: Storage | null;
    try {
      browserStorage = window.localStorage;
    } catch {
      browserStorage = null;
    }

    const storage = new ResilientStorage(browserStorage);
    const browserStore = new LocalAttemptStore({ storage });
    queueMicrotask(() => {
      if (active) {
        setStore(browserStore);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!store) {
    return (
      <div
        className={styles.bootstrap}
        role="status"
        aria-label="Abrindo sua investigação…"
      >
        Abrindo sua investigação…
      </div>
    );
  }

  return <AsSombrasLesson store={store} />;
}

class GuardedAsSombrasAttemptStore implements AttemptStore {
  constructor(private readonly store: AttemptStore) {}

  async restore(
    lessonId: string,
    lessonVersion: string,
  ): Promise<AttemptSnapshot | null> {
    const restored = await this.store.restore(lessonId, lessonVersion);
    if (
      !restored ||
      restored.status !== "completed" ||
      hasCoreReasoningEvidence(restored.responses)
    ) {
      return restored;
    }

    return {
      ...restored,
      status: "in_progress",
      currentSceneId: "transfer_case",
      visitedSceneIds: restored.visitedSceneIds.includes("transfer_case")
        ? restored.visitedSceneIds.slice(
            0,
            restored.visitedSceneIds.lastIndexOf("transfer_case") + 1,
          )
        : [...restored.visitedSceneIds, "transfer_case"],
    };
  }

  async commit(input: {
    readonly eventId: string;
    readonly next: AttemptSnapshot;
  }): Promise<void> {
    await this.store.commit(input);
  }
}

export function AsSombrasLesson({ store }: { store: AttemptStore }) {
  const [hypothesisDraft, setHypothesisDraft] = useState<string | null>(null);
  const guardedStore = useMemo(
    () => new GuardedAsSombrasAttemptStore(store),
    [store],
  );

  return (
    <LessonPlayer
      manifest={asSombrasManifest}
      store={guardedStore}
      onExitHref="/inicio"
      renderScene={(props) =>
        renderCaveScene(props, hypothesisDraft, setHypothesisDraft)
      }
    />
  );
}

function renderCaveScene(
  props: LessonSceneRenderProps<CaveScene>,
  hypothesisDraft: string | null,
  setHypothesisDraft: (value: string) => void,
) {
  const { scene, sceneState, responses, commit, isSaving } = props;

  switch (scene.kind) {
    case "prologue": {
      const storedResponse = responses[PROLOGUE_HYPOTHESIS_RESPONSE_KEY];
      const storedHypothesis =
        storedResponse?.visibility === "private_reflection" &&
        typeof storedResponse.value === "string"
          ? storedResponse.value
          : "";
      const hypothesis = hypothesisDraft ?? storedHypothesis;

      return (
        <PrologueScene
          hypothesis={hypothesis}
          isBusy={isSaving}
          onHypothesisChange={setHypothesisDraft}
          onRegister={(value) => {
            setHypothesisDraft(value);
            return commit({
              eventName: "hypothesis_registered",
              nextSceneState: {
                ...sceneState,
                hypothesisRegistered: true,
              },
              responses: {
                [PROLOGUE_HYPOTHESIS_RESPONSE_KEY]: {
                  visibility: "private_reflection",
                  value,
                },
              },
            });
          }}
          onContinue={() => {
            return commit({
              eventName: "enter_the_wall",
              nextSceneState: { ...sceneState, enteredCave: true },
              transition: "enter_the_wall",
            });
          }}
        />
      );
    }
    case "prisoner_view": {
      const classifications = readObservationClassifications(
        sceneState.classifications,
      );
      return (
        <PrisonerViewScene
          classifications={classifications}
          isBusy={isSaving}
          onClassify={(statementId, classification) => {
            const nextClassifications = {
              ...classifications,
              [statementId]: classification,
            };
            return commit({
              eventName: "observation_classified",
              nextSceneState: {
                ...sceneState,
                classifications: nextClassifications,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.observationClassification]: {
                  visibility: "teacher_visible_task",
                  value: nextClassifications,
                },
              },
            });
          }}
          onContinue={() =>
            commit({
              eventName: "observation_classification_completed",
              nextSceneState: {
                ...sceneState,
                classifications,
              },
              transition: "begin_prediction_training",
            })
          }
        />
      );
    }
    case "prediction_mastery": {
      const forecasts = sanitizeWallForecasts(sceneState.forecasts);
      return (
        <PredictionMasteryScene
          forecasts={forecasts}
          isBusy={isSaving}
          onForecast={(forecast) => {
            const nextForecasts = sanitizeWallForecasts([
              ...forecasts,
              forecast,
            ]);
            return commit({
              eventName: "wall_forecast",
              nextSceneState: {
                ...sceneState,
                forecasts: nextForecasts,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.wallForecasts]: {
                  visibility: "teacher_visible_task",
                  value: nextForecasts,
                },
              },
            });
          }}
          onComplete={(mastery) =>
            commit({
              eventName: "wall_pattern_mastery",
              nextSceneState: {
                ...sceneState,
                forecasts,
                mastery,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.wallPatternMastery]: {
                  visibility: "derived_rubric",
                  value: mastery,
                },
              },
              transition: "confront_impossible_shadow",
            })
          }
        />
      );
    }
    case "impossible_shadow": {
      const anomalyNoticed = sceneState.anomalyNoticed === true;
      const firstClueId = readAnomalyClueId(sceneState.firstClue);
      return (
        <AnomalyScene
          anomalyNoticed={anomalyNoticed}
          firstClueId={firstClueId}
          isBusy={isSaving}
          onAnomalyNoticed={() =>
            commit({
              eventName: "anomaly_noticed",
              nextSceneState: {
                ...sceneState,
                anomalyNoticed: true,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.anomalyNotice]: {
                  visibility: "system_telemetry",
                  value: { noticed: true },
                },
              },
            })
          }
          onFirstClue={(clueId) =>
            commit({
              eventName: "first_clue_selected",
              nextSceneState: {
                ...sceneState,
                anomalyNoticed: true,
                firstClue: clueId,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.firstClue]: {
                  visibility: "teacher_visible_task",
                  value: clueId,
                },
              },
            })
          }
          onContinue={(clueId) => {
            const validClueId = readAnomalyClueId(clueId);
            if (!validClueId) {
              return false;
            }
            return commit({
              eventName: "anomaly_investigation_started",
              nextSceneState: {
                ...sceneState,
                anomalyNoticed: true,
                firstClue: validClueId,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.firstClue]: {
                  visibility: "teacher_visible_task",
                  value: validClueId,
                },
              },
              transition: "inspect_evidence",
            });
          }}
        />
      );
    }
    case "evidence_investigation": {
      const selectedClue = readAnomalyClueId(
        responses[CAVE_RESPONSE_KEYS.firstClue]?.value,
      );
      if (!selectedClue) {
        return (
          <MissingFirstClueScene
            isBusy={isSaving}
            onRecover={() =>
              commit({
                eventName: "first_clue_recovery_started",
                nextSceneState: {
                  ...sceneState,
                  recoveryRequested: true,
                },
                transition: "recover_first_clue",
              })
            }
          />
        );
      }
      const inspectedClueIds = readAnomalyClueIds(
        sceneState.inspectedClueIds,
      );
      const comparisons = readModelFitComparisons(
        sceneState.comparisons,
      );
      return (
        <EvidenceInvestigationScene
          firstClueId={selectedClue}
          inspectedClueIds={inspectedClueIds}
          comparisons={comparisons}
          isBusy={isSaving}
          onInspect={(clueId) => {
            const nextInspectedClueIds = inspectedClueIds.includes(clueId)
              ? inspectedClueIds
              : [...inspectedClueIds, clueId];
            return commit({
              eventName: "clue_inspected",
              nextSceneState: {
                ...sceneState,
                inspectedClueIds: nextInspectedClueIds,
                comparisons,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.inspectedClues]: {
                  visibility: "teacher_visible_task",
                  value: nextInspectedClueIds,
                },
              },
            });
          }}
          onCompare={(clueId, modelFit) => {
            const nextComparisons = {
              ...comparisons,
              [clueId]: modelFit,
            };
            return commit({
              eventName: "model_fit_compared",
              nextSceneState: {
                ...sceneState,
                inspectedClueIds,
                comparisons: nextComparisons,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.modelFitComparisons]: {
                  visibility: "teacher_visible_task",
                  value: nextComparisons,
                },
              },
            });
          }}
          onContinue={() =>
            commit({
              eventName: "evidence_comparison_completed",
              nextSceneState: {
                ...sceneState,
                inspectedClueIds,
                comparisons,
              },
              transition: "enter_thought_space",
            })
          }
        />
      );
    }
    case "shadow_laboratory": {
      const laboratoryState =
        sanitizeShadowLaboratoryState(sceneState);
      return (
        <ShadowLaboratory
          state={laboratoryState}
          isBusy={isSaving}
          onStateChange={(nextState) =>
            commit({
              eventName: "laboratory_configuration_changed",
              nextSceneState: nextState,
            })
          }
          onModelRun={({ evidence, nextState }) =>
            commit({
              eventName: "model_run",
              nextSceneState: nextState,
              responses: evidence
                ? {
                    [CAVE_RESPONSE_KEYS.causalModel]: {
                      visibility: "teacher_visible_task",
                      value: evidence,
                    },
                  }
                : undefined,
            })
          }
          onCounterfactual={({ evidence, nextState }) =>
            commit({
              eventName: "counterfactual_predicted",
              nextSceneState: nextState,
              responses: {
                [CAVE_RESPONSE_KEYS.counterfactualPrediction]: {
                  visibility: "teacher_visible_task",
                  value: evidence,
                },
              },
            })
          }
          onContinue={() =>
            commit({
              eventName: "causal_model_completed",
              nextSceneState: laboratoryState,
              transition: "defend_model",
            })
          }
        />
      );
    }
    case "defend_model": {
      const inspectedClueIds = readAnomalyClueIds(
        responses[CAVE_RESPONSE_KEYS.inspectedClues]?.value,
      );
      const value = sanitizeDefendModelValue(
        sceneState,
        inspectedClueIds,
      );
      return (
        <DefendModelScene
          inspectedClueIds={inspectedClueIds}
          value={value}
          isBusy={isSaving}
          onClaimBuilt={({ claim, nextEvidence }) =>
            commit({
              eventName: "claim_built",
              nextSceneState: {
                ...value,
                claim,
                nextEvidence,
                reviewed: false,
              },
            })
          }
          onEvidenceLinked={({ clue, bridge }) =>
            commit({
              eventName: "evidence_linked",
              nextSceneState: {
                ...value,
                clue,
                bridge,
                reviewed: false,
              },
            })
          }
          onRivalAcknowledged={(acknowledgment) =>
            commit({
              eventName: "rival_acknowledged",
              nextSceneState: {
                ...value,
                acknowledgment,
                reviewed: false,
              },
            })
          }
          onConfidenceRecorded={(confidence) =>
            commit({
              eventName: "confidence_recorded",
              nextSceneState: {
                ...value,
                confidence,
                reviewed: false,
              },
            })
          }
          onReview={(review) =>
            commit({
              eventName: "argument_reviewed",
              nextSceneState: { ...review },
            })
          }
          onContinue={() => {
            if (!isDefendedModelComplete(value, inspectedClueIds)) {
              return false;
            }
            return commit({
              eventName: "model_defense_completed",
              nextSceneState: { ...value },
              responses: {
                [CAVE_RESPONSE_KEYS.defendedModel]: {
                  visibility: "teacher_visible_task",
                  value: { ...value },
                },
              },
              transition: "revisit_first_view",
            });
          }}
        />
      );
    }
    case "revision_map": {
      const hypothesisResponse =
        responses[PROLOGUE_HYPOTHESIS_RESPONSE_KEY];
      const initialHypothesis =
        hypothesisResponse?.visibility === "private_reflection" &&
        typeof hypothesisResponse.value === "string" &&
        hypothesisResponse.value.trim()
          ? hypothesisResponse.value
          : null;
      const privateResponse =
        responses[REVISION_PRIVATE_RESPONSE_KEY];
      const privateNote =
        privateResponse?.visibility === "private_reflection" &&
        typeof privateResponse.value === "string"
          ? privateResponse.value.slice(0, 600)
          : "";
      const inspectedClueIds = readAnomalyClueIds(
        readRequiredResponse(
          responses,
          CAVE_RESPONSE_KEYS.inspectedClues,
          "teacher_visible_task",
        ),
      );
      const clueOptions = REVISION_CLUE_OPTIONS.filter((option) =>
        inspectedClueIds.includes(option.value),
      );
      const value = sanitizeRevisionSceneValue(sceneState, clueOptions);
      return (
        <RevisionScene
          initialHypothesis={initialHypothesis}
          clueOptions={clueOptions}
          value={value}
          privateNote={privateNote}
          isBusy={isSaving}
          onHypothesisRevisited={(strategy) =>
            commit({
              eventName: "hypothesis_revisited",
              nextSceneState: {
                strategy,
                recorded: false,
              },
            })
          }
          onRevisionRecorded={(revision, nextPrivateNote) => {
            const safePrivateNote = nextPrivateNote.slice(0, 600);
            return commit({
              eventName: "revision_recorded",
              nextSceneState: {
                ...revision,
                recorded: true,
              },
              responses: {
                [CAVE_RESPONSE_KEYS.revision]: {
                  visibility: "teacher_visible_task",
                  value: {
                    ...revision,
                    recorded: true,
                  },
                },
                [REVISION_PRIVATE_RESPONSE_KEY]: {
                  visibility: "private_reflection",
                  value: safePrivateNote,
                },
              },
            });
          }}
          onContinue={() => {
            if (!isRevisionEvidenceComplete(value, clueOptions)) {
              return false;
            }
            return commit({
              eventName: "revision_completed",
              nextSceneState: { ...value },
              transition: "test_transfer",
            });
          }}
        />
      );
    }
    case "transfer_case": {
      const value = sanitizeTransferClassification(sceneState);
      const canComplete = hasCoreReasoningEvidence(responses);
      return (
        <TransferScene
          value={value}
          canComplete={canComplete}
          isBusy={isSaving}
          onConfidenceRecorded={(confidence) =>
            commit({
              eventName: "confidence_recorded",
              nextSceneState: {
                ...value,
                confidence,
              },
            })
          }
          onContextRevealed={() => {
            if (!value.confidence) {
              return false;
            }
            return commit({
              eventName: "transfer_context_revealed",
              nextSceneState: {
                ...value,
                contextRevealed: true,
              },
            });
          }}
          onClassified={(classification) => {
            if (!value.confidence || !value.contextRevealed) {
              return false;
            }
            const recordedValue = {
              ...value,
              ...classification,
              classified: true,
            };
            return commit({
              eventName: "transfer_classified",
              nextSceneState: recordedValue,
              responses: {
                [CAVE_RESPONSE_KEYS.transferClassification]: {
                  visibility: "teacher_visible_task",
                  value: recordedValue,
                },
              },
            });
          }}
          onComplete={() => {
            if (!hasCoreReasoningEvidence(responses)) {
              return false;
            }
            return commit({
              eventName: "complete_session",
              nextSceneState: { ...value },
              transition: "complete_session",
            });
          }}
        />
      );
    }
    default:
      return assertNever(scene.kind);
  }
}

function MissingFirstClueScene({
  isBusy,
  onRecover,
}: {
  readonly isBusy: boolean;
  readonly onRecover: () => void | boolean | Promise<void | boolean>;
}) {
  return (
    <article
      className={`${styles.openingScene} ${styles.evidenceScene}`}
      aria-labelledby="missing-first-clue-title"
    >
      <header className={styles.evidenceHeader}>
        <p className={styles.eyebrow}>Ato 3 · mesa de evidências</p>
        <h1 id="missing-first-clue-title" tabIndex={-1}>
          Siga a incompatibilidade
        </h1>
        <p>
          A investigação precisa partir da pista escolhida no
          acontecimento anterior.
        </p>
      </header>
      <section className={styles.prerequisiteNotice} role="alert">
        <p className={styles.eyebrow}>Escolha necessária</p>
        <h2>Falta uma primeira pista válida.</h2>
        <p>
          Retorne ao acontecimento, selecione a incompatibilidade que quer
          investigar e volte à mesa de evidências. Nenhuma pista foi
          escolhida por você automaticamente.
        </p>
        <button
          className={styles.primaryAction}
          type="button"
          onClick={onRecover}
          disabled={isBusy}
        >
          Voltar ao pássaro impossível
        </button>
      </section>
    </article>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unsupported Cave scene kind: ${String(value)}`);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readObservationClassifications(
  value: unknown,
): Partial<Record<ObservationStatementId, ObservationClassification>> {
  if (!isRecord(value)) {
    return {};
  }

  const result: Partial<
    Record<ObservationStatementId, ObservationClassification>
  > = {};
  for (const statementId of [
    "winged_outline",
    "bird_claim",
  ] as const) {
    const classification = value[statementId];
    if (classification === "percebi" || classification === "conclui") {
      result[statementId] = classification;
    }
  }
  return result;
}

const anomalyClueIds = [
  "forma",
  "som",
  "tempo",
  "repeticao",
] as const;

function readAnomalyClueId(value: unknown): AnomalyClueId | undefined {
  return typeof value === "string" &&
    anomalyClueIds.includes(value as AnomalyClueId)
    ? (value as AnomalyClueId)
    : undefined;
}

function readAnomalyClueIds(value: unknown): readonly AnomalyClueId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: AnomalyClueId[] = [];
  for (const item of value) {
    const clueId = readAnomalyClueId(item);
    if (clueId && !result.includes(clueId)) {
      result.push(clueId);
    }
  }
  return result;
}

function readModelFitComparisons(
  value: unknown,
): Partial<Record<AnomalyClueId, CaveModelFit>> {
  if (!isRecord(value)) {
    return {};
  }

  const result: Partial<Record<AnomalyClueId, CaveModelFit>> = {};
  for (const clueId of anomalyClueIds) {
    const modelFit = value[clueId];
    if (
      modelFit === "parede" ||
      modelFit === "fonte" ||
      modelFit === "ambos" ||
      modelFit === "incerto"
    ) {
      result[clueId] = modelFit;
    }
  }
  return result;
}

function hasCoreReasoningEvidence(
  responses: Readonly<Record<string, ResponseEnvelope>>,
): boolean {
  const observation = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.observationClassification,
    "teacher_visible_task",
  );
  const forecastValue = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.wallForecasts,
    "teacher_visible_task",
  );
  const mastery = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.wallPatternMastery,
    "derived_rubric",
  );
  const firstClueValue = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.firstClue,
    "teacher_visible_task",
  );
  const inspectedCluesValue = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.inspectedClues,
    "teacher_visible_task",
  );
  const causalModel = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.causalModel,
    "teacher_visible_task",
  );
  const counterfactual = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.counterfactualPrediction,
    "teacher_visible_task",
  );
  const defendedModel = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.defendedModel,
    "teacher_visible_task",
  );
  const revision = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.revision,
    "teacher_visible_task",
  );
  const transfer = readRequiredResponse(
    responses,
    CAVE_RESPONSE_KEYS.transferClassification,
    "teacher_visible_task",
  );
  const forecasts = sanitizeWallForecasts(forecastValue);
  const firstClue = readAnomalyClueId(firstClueValue);
  const inspectedClueIds = readAnomalyClueIds(
    inspectedCluesValue,
  );
  const revisionClueOptions = REVISION_CLUE_OPTIONS.filter((option) =>
    inspectedClueIds.includes(option.value),
  );
  const decisiveRevisionClue = readAnomalyClueId(
    isRecord(revision) ? revision.decisiveClue : undefined,
  );

  return (
    isValidObservationEvidence(observation) &&
    isCanonicalWallForecasts(forecastValue, forecasts) &&
    isValidWallMasteryEvidence(mastery, forecasts) &&
    firstClue !== undefined &&
    isCanonicalInspectedClues(
      inspectedCluesValue,
      inspectedClueIds,
    ) &&
    inspectedClueIds.includes(firstClue) &&
    isValidCausalModelEvidence(causalModel) &&
    isValidCounterfactualEvidence(counterfactual) &&
    isCanonicalDefendedModelEvidence(defendedModel) &&
    isDefendedModelComplete(defendedModel, inspectedClueIds) &&
    isCanonicalRevisionEvidence(revision) &&
    decisiveRevisionClue !== undefined &&
    inspectedClueIds.includes(decisiveRevisionClue) &&
    isRevisionEvidenceComplete(revision, revisionClueOptions) &&
    isCanonicalTransferEvidence(transfer) &&
    isTransferComplete(sanitizeTransferClassification(transfer))
  );
}

function readRequiredResponse(
  responses: Readonly<Record<string, ResponseEnvelope>>,
  key: string,
  visibility: VisibilityClass,
): unknown {
  const response = responses[key];
  return response?.visibility === visibility
    ? response.value
    : undefined;
}

function hasOnlyKeys(
  value: Readonly<Record<string, unknown>>,
  keys: readonly string[],
): boolean {
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === keys.length &&
    keys.every((key) => actualKeys.includes(key))
  );
}

function isValidObservationEvidence(value: unknown): boolean {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["winged_outline", "bird_claim"])
  ) {
    return false;
  }
  return (
    (value.winged_outline === "percebi" ||
      value.winged_outline === "conclui") &&
    (value.bird_claim === "percebi" ||
      value.bird_claim === "conclui")
  );
}

function isCanonicalWallForecasts(
  value: unknown,
  forecasts: ReturnType<typeof sanitizeWallForecasts>,
): boolean {
  if (
    !Array.isArray(value) ||
    value.length !== forecasts.length ||
    (forecasts.length !== 4 && forecasts.length !== 5)
  ) {
    return false;
  }

  return forecasts.every((forecast, index) => {
    const persisted = value[index];
    return (
      isRecord(persisted) &&
      hasOnlyKeys(persisted, ["id", "choice", "matchedPattern"]) &&
      persisted.id === forecast.id &&
      persisted.choice === forecast.choice &&
      persisted.matchedPattern === forecast.matchedPattern
    );
  });
}

function isValidWallMasteryEvidence(
  value: unknown,
  forecasts: ReturnType<typeof sanitizeWallForecasts>,
): boolean {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "coreMatches",
      "coreAttempted",
      "supportAttempted",
      "supportMatched",
    ])
  ) {
    return false;
  }

  const coreMatches = forecasts
    .slice(0, 4)
    .filter((forecast) => forecast.matchedPattern).length;
  const support = forecasts.find(
    (forecast) => forecast.id === "supported",
  );
  const supportRequired = coreMatches < 3;

  return (
    forecasts.slice(0, 4).length === 4 &&
    value.coreAttempted === 4 &&
    value.coreMatches === coreMatches &&
    value.supportAttempted === supportRequired &&
    (supportRequired
      ? Boolean(support) &&
        value.supportMatched === support?.matchedPattern
      : support === undefined && value.supportMatched === null)
  );
}

function isCanonicalInspectedClues(
  value: unknown,
  inspectedClueIds: readonly AnomalyClueId[],
): boolean {
  return (
    Array.isArray(value) &&
    value.length === inspectedClueIds.length &&
    inspectedClueIds.length >= 2 &&
    value.every((clueId, index) => clueId === inspectedClueIds[index])
  );
}

function isValidCausalModelEvidence(value: unknown): boolean {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "projectionSource",
      "soundSource",
      "causalLinks",
    ])
  ) {
    return false;
  }
  const causalLinks = value.causalLinks;
  if (!Array.isArray(causalLinks)) {
    return false;
  }
  return (
    value.projectionSource === "bird_artifact" &&
    value.soundSource === "human_carrier" &&
    causalLinks.length === SHADOW_CAUSAL_LINKS.length &&
    SHADOW_CAUSAL_LINKS.every(
      (link, index) => causalLinks[index] === link,
    )
  );
}

function isValidCounterfactualEvidence(value: unknown): boolean {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      "changedVariable",
      "prediction",
      "observedConsequence",
      "beforeScale",
      "afterScale",
      "matched",
    ])
  ) {
    return false;
  }
  return (
    value.changedVariable === "artifact_distance_from_light" &&
    (value.prediction === "projection_increases" ||
      value.prediction === "projection_decreases" ||
      value.prediction === "projection_unchanged") &&
    value.observedConsequence === "projection_increases" &&
    typeof value.beforeScale === "number" &&
    Number.isFinite(value.beforeScale) &&
    typeof value.afterScale === "number" &&
    Number.isFinite(value.afterScale) &&
    value.afterScale > value.beforeScale &&
    typeof value.matched === "boolean" &&
    value.matched ===
      (value.prediction === value.observedConsequence)
  );
}

function isCanonicalDefendedModelEvidence(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }
  const keys = [
    "claim",
    "clue",
    "bridge",
    "acknowledgment",
    "confidence",
    "order",
    "reviewed",
    "coherent",
    ...(value.claim === "insufficient" ? ["nextEvidence"] : []),
  ];
  const order = value.order;
  return (
    hasOnlyKeys(value, keys) &&
    Array.isArray(order) &&
    order.length === 5 &&
    new Set(order).size === 5 &&
    [
      "claim",
      "clue",
      "bridge",
      "acknowledgment",
      "confidence",
    ].every((move) => order.includes(move)) &&
    value.reviewed === true &&
    value.coherent === true
  );
}

function isCanonicalRevisionEvidence(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      "strategy",
      "decisiveClue",
      "recorded",
    ]) &&
    value.recorded === true
  );
}

function isCanonicalTransferEvidence(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      "confidence",
      "contextRevealed",
      "representation",
      "sourceEvent",
      "caption",
      "sufficiency",
      "nextEvidence",
      "classified",
    ]) &&
    value.contextRevealed === true &&
    value.classified === true
  );
}
