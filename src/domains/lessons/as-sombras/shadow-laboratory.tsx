"use client";

import { CausalResult, CounterfactualPanel } from "./shadow-laboratory-panels";
import { SpatialWorkbench } from "./shadow-laboratory-spatial";
import {
  MODEL_EVIDENCE,
  SLOT_DEFINITIONS,
  runCurrentArrangement,
  type CounterfactualEvidence,
  type CounterfactualPayload,
  type LaboratorySlotId,
  type ModelRunEvidence,
  type ModelRunPayload,
  type ShadowLaboratoryFields,
  type ShadowLaboratoryState,
  type SlotState,
  type StepperAnswerState,
} from "./shadow-laboratory-state";
import { StructuredStepper } from "./shadow-laboratory-stepper";
import { runShadowModel } from "./shadow-model";
import styles from "./shadow-laboratory.module.css";

export {
  createInitialShadowLaboratoryState,
  sanitizeShadowLaboratoryState,
} from "./shadow-laboratory-state";
export type {
  CounterfactualEvidence,
  LaboratoryMode,
  ModelRunEvidence,
  ShadowLaboratoryState,
} from "./shadow-laboratory-state";

export interface ShadowLaboratoryProps {
  readonly state: ShadowLaboratoryState;
  readonly onStateChange: (
    nextState: ShadowLaboratoryState,
  ) => void | boolean | Promise<void | boolean>;
  readonly onModelRun: (
    payload: ModelRunPayload,
  ) => void | boolean | Promise<void | boolean>;
  readonly onCounterfactual: (
    payload: CounterfactualPayload,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () => void | boolean | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

export function ShadowLaboratory({
  state,
  onStateChange,
  onModelRun,
  onCounterfactual,
  onContinue,
  isBusy = false,
}: ShadowLaboratoryProps) {
  function changeState(patch: Partial<ShadowLaboratoryFields>) {
    void onStateChange({
      ...state,
      ...patch,
    });
  }

  function placeSelection(slotId: LaboratorySlotId) {
    if (!state.selectedPiece) {
      return;
    }

    const nextSlots = { ...state.slots };
    for (const slot of SLOT_DEFINITIONS) {
      if (nextSlots[slot.id] === state.selectedPiece) {
        nextSlots[slot.id] = null;
      }
    }
    nextSlots[slotId] = state.selectedPiece;

    changeState({
      slots: nextSlots as SlotState,
      selectedPiece: null,
      counterfactualEvidence: null,
      comparisonVisible: false,
    });
  }

  function runArrangement() {
    const output = runCurrentArrangement(state);
    const evidence: ModelRunEvidence | null =
      output.status === "productive" ? MODEL_EVIDENCE : null;
    const nextState: ShadowLaboratoryState = {
      ...state,
      runCount: state.runCount + 1,
      lastRunResult: output.result,
      lastModelEvidence: evidence ?? state.lastModelEvidence,
      counterfactualEvidence:
        evidence === null ? state.counterfactualEvidence : null,
      comparisonVisible: false,
    };

    void onModelRun({ evidence, output, nextState });
  }

  function testCounterfactual() {
    if (!state.counterfactualPrediction || !state.lastModelEvidence) {
      return;
    }

    const before = runShadowModel({
      lightPosition: 0,
      artifactPosition: state.artifactPosition,
      wallPosition: 10,
      artifactHeight: 2,
      carrierVoice: "human",
      artifactId: "bird_artifact",
    });
    const after = runShadowModel({
      lightPosition: 0,
      artifactPosition: Math.max(0.5, state.artifactPosition - 1),
      wallPosition: 10,
      artifactHeight: 2,
      carrierVoice: "human",
      artifactId: "bird_artifact",
    });

    if (
      before.projectionScale === null ||
      after.projectionScale === null
    ) {
      return;
    }

    const evidence: CounterfactualEvidence = {
      changedVariable: "artifact_distance_from_light",
      prediction: state.counterfactualPrediction,
      observedConsequence: "projection_increases",
      beforeScale: before.projectionScale,
      afterScale: after.projectionScale,
      matched:
        state.counterfactualPrediction === "projection_increases",
    };
    const nextState: ShadowLaboratoryState = {
      ...state,
      counterfactualEvidence: evidence,
      comparisonVisible: false,
    };
    void onCounterfactual({ evidence, nextState });
  }

  const canRequestHint =
    state.runCount > 0 &&
    state.lastRunResult !== "projection_created" &&
    !state.hintVisible;

  return (
    <article
      className={styles.laboratoryScene}
      aria-labelledby="shadow-laboratory-title"
    >
      <header className={styles.laboratoryHeader}>
        <div>
          <p className={styles.eyebrow}>Ato 4 · espaço não literal</p>
          <h1 id="shadow-laboratory-title" tabIndex={-1}>
            Espaço de Pensamento
          </h1>
          <p>
            Reconstrua o mecanismo escondido. Depois mude uma variável e
            use o modelo para prever a consequência.
          </p>
        </div>
        <div
          className={styles.modeSwitch}
          role="group"
          aria-label="Modo do laboratório"
        >
          <button
            type="button"
            aria-pressed={state.mode === "spatial"}
            onClick={() => changeState({ mode: "spatial" })}
            disabled={isBusy}
          >
            Usar laboratório espacial
          </button>
          <button
            type="button"
            aria-pressed={state.mode === "stepper"}
            onClick={() => changeState({ mode: "stepper" })}
            disabled={isBusy}
          >
            Usar versão em etapas
          </button>
        </div>
      </header>

      <div className={styles.laboratoryWorkspace}>
        {state.mode === "spatial" ? (
          <SpatialWorkbench
            state={state}
            isBusy={isBusy}
            onSelectPiece={(selectedPiece) =>
              changeState({ selectedPiece })
            }
            onPlace={placeSelection}
            onMoveCarrier={(difference) =>
              changeState({
                carrierPosition: Math.max(
                  1,
                  Math.min(8, state.carrierPosition + difference),
                ),
              })
            }
            onMoveArtifact={(difference) =>
              changeState({
                artifactPosition: Math.max(
                  1,
                  Math.min(8, state.artifactPosition + difference),
                ),
                counterfactualEvidence: null,
                comparisonVisible: false,
              })
            }
            onRun={runArrangement}
          />
        ) : (
          <StructuredStepper
            state={state}
            isBusy={isBusy}
            onAnswer={(questionId, answer) =>
              changeState({
                stepperAnswers: {
                  ...state.stepperAnswers,
                  [questionId]: answer,
                } as StepperAnswerState,
                counterfactualEvidence: null,
                comparisonVisible: false,
              })
            }
            onRun={runArrangement}
          />
        )}

        <CausalResult
          state={state}
          canRequestHint={canRequestHint}
          isBusy={isBusy}
          onRequestHint={() => changeState({ hintVisible: true })}
        />

        {state.lastModelEvidence ? (
          <CounterfactualPanel
            state={state}
            isBusy={isBusy}
            onPrediction={(counterfactualPrediction) =>
              changeState({
                counterfactualPrediction,
                counterfactualEvidence: null,
                comparisonVisible: false,
              })
            }
            onTest={testCounterfactual}
            onCompare={() =>
              changeState({
                comparisonVisible: !state.comparisonVisible,
              })
            }
          />
        ) : null}

        <div className={styles.laboratoryContinue}>
          <p>
            {state.counterfactualEvidence
              ? "Você construiu o mecanismo e verificou uma consequência."
              : "A próxima etapa abre quando o modelo produzir uma projeção e testar uma mudança."}
          </p>
          <button
            className={styles.primaryAction}
            type="button"
            onClick={onContinue}
            disabled={!state.counterfactualEvidence || isBusy}
          >
            Defender o modelo
          </button>
        </div>
      </div>
    </article>
  );
}
