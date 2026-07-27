"use client";

import { CausalResult, CounterfactualPanel } from "./shadow-laboratory-panels";
import { SpatialWorkbench } from "./shadow-laboratory-spatial";
import {
  SLOT_DEFINITIONS,
  createCurrentModelInput,
  createLaboratoryRunRecord,
  runCurrentArrangement,
  type CounterfactualEvidence,
  type CounterfactualPayload,
  type LaboratorySlotId,
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

  const invalidatedRun: Pick<
    ShadowLaboratoryFields,
    | "lastRunRecord"
    | "lastRunResult"
    | "lastModelEvidence"
    | "counterfactualRecord"
    | "counterfactualEvidence"
    | "comparisonVisible"
  > = {
    lastRunRecord: null,
    lastRunResult: null,
    lastModelEvidence: null,
    counterfactualRecord: null,
    counterfactualEvidence: null,
    comparisonVisible: false,
  };

  function changeConfiguration(
    patch: Partial<ShadowLaboratoryFields>,
  ) {
    changeState({
      ...patch,
      ...invalidatedRun,
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

    changeConfiguration({
      slots: nextSlots as SlotState,
      selectedPiece: null,
    });
  }

  function runArrangement() {
    const evaluation = runCurrentArrangement(state);
    const { evidence, output } = evaluation;
    const nextState: ShadowLaboratoryState = {
      ...state,
      runCount: state.runCount + 1,
      unproductiveRuns:
        state.unproductiveRuns + (evaluation.isComplete ? 0 : 1),
      lastRunRecord: createLaboratoryRunRecord(state),
      lastRunResult: output.result,
      lastModelEvidence: evidence,
      counterfactualRecord: null,
      counterfactualEvidence: null,
      comparisonVisible: false,
    };

    void onModelRun({ evidence, output, nextState });
  }

  function testCounterfactual() {
    if (!state.counterfactualPrediction || !state.lastModelEvidence) {
      return;
    }

    const beforeInput = createCurrentModelInput(state);
    const afterInput = createCurrentModelInput(
      state,
      Math.max(0.5, state.artifactPosition - 1),
    );
    const before = runShadowModel(beforeInput);
    const after = runShadowModel(afterInput);

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
      counterfactualRecord: {
        mode: state.mode,
        prediction: state.counterfactualPrediction,
        beforeInput,
        afterInput,
      },
      counterfactualEvidence: evidence,
      comparisonVisible: false,
    };
    void onCounterfactual({ evidence, nextState });
  }

  const canRequestHint =
    state.unproductiveRuns > 0 &&
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
            onClick={() => {
              if (state.mode !== "spatial") {
                changeConfiguration({ mode: "spatial" });
              }
            }}
            disabled={isBusy}
          >
            Usar laboratório espacial
          </button>
          <button
            type="button"
            aria-pressed={state.mode === "stepper"}
            onClick={() => {
              if (state.mode !== "stepper") {
                changeConfiguration({ mode: "stepper" });
              }
            }}
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
              changeConfiguration({
                carrierPosition: Math.max(
                  1,
                  Math.min(8, state.carrierPosition + difference),
                ),
              })
            }
            onMoveArtifact={(difference) =>
              changeConfiguration({
                artifactPosition: Math.max(
                  1,
                  Math.min(8, state.artifactPosition + difference),
                ),
              })
            }
            onRun={runArrangement}
          />
        ) : (
          <StructuredStepper
            state={state}
            isBusy={isBusy}
            onAnswer={(questionId, answer) =>
              changeConfiguration({
                stepperAnswers: {
                  ...state.stepperAnswers,
                  [questionId]: answer,
                } as StepperAnswerState,
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
                counterfactualRecord: null,
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
