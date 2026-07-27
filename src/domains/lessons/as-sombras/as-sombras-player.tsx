"use client";

import { useEffect, useState } from "react";
import type { AttemptStore } from "../contracts";
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
  ShadowLaboratory,
  sanitizeShadowLaboratoryState,
} from "./shadow-laboratory";
import {
  CAVE_RESPONSE_KEYS,
  PROLOGUE_HYPOTHESIS_RESPONSE_KEY,
} from "./state";
import styles from "./as-sombras.module.css";

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

export function AsSombrasLesson({ store }: { store: AttemptStore }) {
  const [hypothesisDraft, setHypothesisDraft] = useState<string | null>(null);

  return (
    <LessonPlayer
      manifest={asSombrasManifest}
      store={store}
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
    case "defend_model":
      return <TemporaryCaveScene scene={scene} />;
    case "revision_map":
      return <TemporaryCaveScene scene={scene} />;
    case "transfer_case":
      return <TemporaryCaveScene scene={scene} />;
    default:
      return assertNever(scene.kind);
  }
}

function TemporaryCaveScene({ scene }: { scene: CaveScene }) {
  return (
    <article className={styles.scene}>
      <div
        className={styles.environment}
        style={{ backgroundImage: `url("${scene.config.environmentAsset}")` }}
        aria-hidden="true"
      />
      <section
        className={styles.tray}
        aria-labelledby={`scene-title-${scene.id}`}
      >
        <div>
          <p className={styles.eyebrow}>Próxima etapa da investigação</p>
          <h1 id={`scene-title-${scene.id}`} tabIndex={-1}>
            {scene.title}
          </h1>
          <p>{scene.config.purpose}</p>
        </div>
        <button type="button" disabled>
          Continuar
        </button>
      </section>
    </article>
  );
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
