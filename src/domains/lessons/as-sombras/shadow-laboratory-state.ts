import type { JsonObject } from "../contracts";
import {
  runShadowModel,
  SHADOW_CAUSAL_LINKS,
  type CarrierVoice,
  type ShadowModelOutput,
} from "./shadow-model";

export type LaboratoryMode = "spatial" | "stepper";
export type LaboratoryPieceId =
  | "fire"
  | "human_carrier"
  | "bird_artifact"
  | "wall"
  | "prisoner";
export type LaboratorySlotId =
  | "fire"
  | "carrier"
  | "artifact"
  | "wall"
  | "prisoner";
export type CounterfactualPrediction =
  | "projection_increases"
  | "projection_decreases"
  | "projection_unchanged";
export type ModelRunResult =
  | "projection_created"
  | "artifact_outside_light_path"
  | "invalid_position_order"
  | "non_finite_projection";
export type StepperQuestionId =
  | "light_source"
  | "light_blocker"
  | "projection_destination"
  | "sound_source"
  | "size_variable";
export type StepperAnswer =
  | "fire"
  | "wall"
  | "bird_artifact"
  | "human_carrier"
  | "projection_wall"
  | "artifact_light_distance"
  | "carrier_speed";

export type SlotState = JsonObject &
  Readonly<Record<LaboratorySlotId, LaboratoryPieceId | null>>;
export type StepperAnswerState = JsonObject &
  Readonly<Partial<Record<StepperQuestionId, StepperAnswer>>>;

export type ModelRunEvidence = JsonObject & {
  readonly projectionSource: "bird_artifact";
  readonly soundSource: "human_carrier";
  readonly causalLinks: typeof SHADOW_CAUSAL_LINKS;
};

export type CounterfactualEvidence = JsonObject & {
  readonly changedVariable: "artifact_distance_from_light";
  readonly prediction: CounterfactualPrediction;
  readonly observedConsequence: "projection_increases";
  readonly beforeScale: number;
  readonly afterScale: number;
  readonly matched: boolean;
};

export type PersistedShadowModelInput = JsonObject & {
  readonly lightPosition: number;
  readonly artifactPosition: number;
  readonly wallPosition: number;
  readonly artifactHeight: number;
  readonly carrierVoice: CarrierVoice;
  readonly artifactInLightPath: boolean;
  readonly artifactSilhouette: "bird";
  readonly artifactId: "bird_artifact";
};

export type LaboratoryRunRecord = JsonObject & {
  readonly mode: LaboratoryMode;
  readonly slots: SlotState;
  readonly stepperAnswers: StepperAnswerState;
  readonly artifactPosition: number;
  readonly carrierPosition: number;
};

export type CounterfactualRecord = JsonObject & {
  readonly mode: LaboratoryMode;
  readonly prediction: CounterfactualPrediction;
  readonly beforeInput: PersistedShadowModelInput;
  readonly afterInput: PersistedShadowModelInput;
};

export interface ArrangementEvaluation {
  readonly output: ShadowModelOutput;
  readonly projectionResolved: boolean;
  readonly soundResolved: boolean;
  readonly observerResolved: boolean;
  readonly sizeVariableResolved: boolean;
  readonly isComplete: boolean;
  readonly evidence: ModelRunEvidence | null;
}

export interface ShadowLaboratoryFields {
  readonly mode: LaboratoryMode;
  readonly selectedPiece: LaboratoryPieceId | null;
  readonly slots: SlotState;
  readonly stepperAnswers: StepperAnswerState;
  readonly artifactPosition: number;
  readonly carrierPosition: number;
  readonly runCount: number;
  readonly unproductiveRuns: number;
  readonly lastRunRecord: LaboratoryRunRecord | null;
  readonly lastRunResult: ModelRunResult | null;
  readonly lastModelEvidence: ModelRunEvidence | null;
  readonly counterfactualPrediction: CounterfactualPrediction | null;
  readonly counterfactualRecord: CounterfactualRecord | null;
  readonly counterfactualEvidence: CounterfactualEvidence | null;
  readonly hintVisible: boolean;
  readonly comparisonVisible: boolean;
}

export type ShadowLaboratoryState = JsonObject &
  ShadowLaboratoryFields;

export interface ModelRunPayload {
  readonly evidence: ModelRunEvidence | null;
  readonly output: ShadowModelOutput;
  readonly nextState: ShadowLaboratoryState;
}

export interface CounterfactualPayload {
  readonly evidence: CounterfactualEvidence;
  readonly nextState: ShadowLaboratoryState;
}

export const PIECE_DEFINITIONS: readonly {
  id: LaboratoryPieceId;
  name: string;
  shortName: string;
}[] = [
  { id: "fire", name: "fogo", shortName: "Fogo" },
  {
    id: "human_carrier",
    name: "carregador humano",
    shortName: "Carregador",
  },
  {
    id: "bird_artifact",
    name: "artefato com pássaro",
    shortName: "Artefato-pássaro",
  },
  { id: "wall", name: "parede", shortName: "Parede" },
  { id: "prisoner", name: "prisioneiro", shortName: "Prisioneiro" },
];

export const SLOT_DEFINITIONS: readonly {
  id: LaboratorySlotId;
  name: string;
  position: string;
}[] = [
  { id: "fire", name: "fogo", position: "fonte" },
  { id: "carrier", name: "carregador", position: "passagem" },
  { id: "artifact", name: "artefato", position: "caminho da luz" },
  { id: "wall", name: "parede", position: "projeção" },
  { id: "prisoner", name: "prisioneiro", position: "observação" },
];

const correctSlots: Readonly<
  Record<LaboratorySlotId, LaboratoryPieceId>
> = {
  fire: "fire",
  carrier: "human_carrier",
  artifact: "bird_artifact",
  wall: "wall",
  prisoner: "prisoner",
};

export const STEPPER_QUESTIONS: readonly {
  id: StepperQuestionId;
  legend: string;
  answers: readonly { value: StepperAnswer; label: string }[];
}[] = [
  {
    id: "light_source",
    legend: "1. O que produz luz?",
    answers: [
      { value: "fire", label: "O fogo produz a luz" },
      { value: "wall", label: "A parede produz a luz" },
    ],
  },
  {
    id: "light_blocker",
    legend: "2. O que bloqueia a luz?",
    answers: [
      {
        value: "bird_artifact",
        label: "O artefato com pássaro bloqueia a luz",
      },
      { value: "human_carrier", label: "A voz bloqueia a luz" },
    ],
  },
  {
    id: "projection_destination",
    legend: "3. Onde a projeção aparece?",
    answers: [
      { value: "projection_wall", label: "A projeção aparece na parede" },
      { value: "human_carrier", label: "A projeção aparece na voz" },
    ],
  },
  {
    id: "sound_source",
    legend: "4. Quem produz a voz e os passos?",
    answers: [
      {
        value: "human_carrier",
        label: "O carregador humano produz a voz e os passos",
      },
      {
        value: "bird_artifact",
        label: "O artefato com pássaro produz a voz e os passos",
      },
    ],
  },
  {
    id: "size_variable",
    legend: "5. Qual variável muda o tamanho da projeção?",
    answers: [
      {
        value: "artifact_light_distance",
        label: "A distância entre artefato e luz muda o tamanho",
      },
      {
        value: "carrier_speed",
        label: "A velocidade da voz muda o tamanho",
      },
    ],
  },
];

const correctStepperAnswers: Readonly<
  Record<StepperQuestionId, StepperAnswer>
> = {
  light_source: "fire",
  light_blocker: "bird_artifact",
  projection_destination: "projection_wall",
  sound_source: "human_carrier",
  size_variable: "artifact_light_distance",
};

export const MODEL_EVIDENCE: ModelRunEvidence = {
  projectionSource: "bird_artifact",
  soundSource: "human_carrier",
  causalLinks: SHADOW_CAUSAL_LINKS,
};

export function createInitialShadowLaboratoryState(): ShadowLaboratoryState {
  return {
    mode: "spatial",
    selectedPiece: null,
    slots: {
      fire: null,
      carrier: null,
      artifact: null,
      wall: null,
      prisoner: null,
    },
    stepperAnswers: {},
    artifactPosition: 4,
    carrierPosition: 5,
    runCount: 0,
    unproductiveRuns: 0,
    lastRunRecord: null,
    lastRunResult: null,
    lastModelEvidence: null,
    counterfactualPrediction: null,
    counterfactualRecord: null,
    counterfactualEvidence: null,
    hintVisible: false,
    comparisonVisible: false,
  };
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPiece(value: unknown): value is LaboratoryPieceId {
  return (
    typeof value === "string" &&
    PIECE_DEFINITIONS.some((piece) => piece.id === value)
  );
}

function isStepperAnswer(value: unknown): value is StepperAnswer {
  return (
    typeof value === "string" &&
    STEPPER_QUESTIONS.some((question) =>
      question.answers.some((answer) => answer.value === value),
    )
  );
}

function isPrediction(value: unknown): value is CounterfactualPrediction {
  return (
    value === "projection_increases" ||
    value === "projection_decreases" ||
    value === "projection_unchanged"
  );
}

function finitePosition(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
    ? value
    : fallback;
}

function safeCount(value: unknown) {
  return typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
    ? Math.min(value, 10_000)
    : 0;
}

function sanitizeSlots(value: unknown): SlotState {
  const savedSlots = isRecord(value) ? value : {};
  return Object.fromEntries(
    SLOT_DEFINITIONS.map((slot) => [
      slot.id,
      isPiece(savedSlots[slot.id]) ? savedSlots[slot.id] : null,
    ]),
  ) as SlotState;
}

function sanitizeStepperAnswers(value: unknown): StepperAnswerState {
  const savedAnswers = isRecord(value) ? value : {};
  const nextAnswers: Partial<Record<StepperQuestionId, StepperAnswer>> = {};
  for (const question of STEPPER_QUESTIONS) {
    const answer = savedAnswers[question.id];
    if (
      isStepperAnswer(answer) &&
      question.answers.some((candidate) => candidate.value === answer)
    ) {
      nextAnswers[question.id] = answer;
    }
  }
  return nextAnswers as StepperAnswerState;
}

function sanitizeRunRecord(value: unknown): LaboratoryRunRecord | null {
  if (
    !isRecord(value) ||
    (value.mode !== "spatial" && value.mode !== "stepper") ||
    typeof value.artifactPosition !== "number" ||
    !Number.isFinite(value.artifactPosition) ||
    value.artifactPosition < 1 ||
    value.artifactPosition > 8 ||
    typeof value.carrierPosition !== "number" ||
    !Number.isFinite(value.carrierPosition) ||
    value.carrierPosition < 1 ||
    value.carrierPosition > 8
  ) {
    return null;
  }

  return {
    mode: value.mode,
    slots: sanitizeSlots(value.slots),
    stepperAnswers: sanitizeStepperAnswers(value.stepperAnswers),
    artifactPosition: value.artifactPosition,
    carrierPosition: value.carrierPosition,
  };
}

function runRecordMatchesState(
  record: LaboratoryRunRecord,
  state: ShadowLaboratoryState,
) {
  return (
    record.mode === state.mode &&
    record.artifactPosition === state.artifactPosition &&
    record.carrierPosition === state.carrierPosition &&
    SLOT_DEFINITIONS.every(
      ({ id }) => record.slots[id] === state.slots[id],
    ) &&
    STEPPER_QUESTIONS.every(
      ({ id }) =>
        record.stepperAnswers[id] === state.stepperAnswers[id],
    )
  );
}

function sanitizeModelInput(
  value: unknown,
): PersistedShadowModelInput | null {
  if (
    !isRecord(value) ||
    typeof value.lightPosition !== "number" ||
    !Number.isFinite(value.lightPosition) ||
    typeof value.artifactPosition !== "number" ||
    !Number.isFinite(value.artifactPosition) ||
    typeof value.wallPosition !== "number" ||
    !Number.isFinite(value.wallPosition) ||
    typeof value.artifactHeight !== "number" ||
    !Number.isFinite(value.artifactHeight) ||
    (value.carrierVoice !== "human" && value.carrierVoice !== "silent") ||
    typeof value.artifactInLightPath !== "boolean" ||
    value.artifactSilhouette !== "bird" ||
    value.artifactId !== "bird_artifact"
  ) {
    return null;
  }

  return {
    lightPosition: value.lightPosition,
    artifactPosition: value.artifactPosition,
    wallPosition: value.wallPosition,
    artifactHeight: value.artifactHeight,
    carrierVoice: value.carrierVoice,
    artifactInLightPath: value.artifactInLightPath,
    artifactSilhouette: "bird",
    artifactId: "bird_artifact",
  };
}

function sanitizeCounterfactualRecord(
  value: unknown,
): CounterfactualRecord | null {
  if (
    !isRecord(value) ||
    (value.mode !== "spatial" && value.mode !== "stepper") ||
    !isPrediction(value.prediction)
  ) {
    return null;
  }

  const beforeInput = sanitizeModelInput(value.beforeInput);
  const afterInput = sanitizeModelInput(value.afterInput);
  if (!beforeInput || !afterInput) {
    return null;
  }

  return {
    mode: value.mode,
    prediction: value.prediction,
    beforeInput,
    afterInput,
  };
}

function sameModelInput(
  left: PersistedShadowModelInput,
  right: PersistedShadowModelInput,
) {
  return (
    left.lightPosition === right.lightPosition &&
    left.artifactPosition === right.artifactPosition &&
    left.wallPosition === right.wallPosition &&
    left.artifactHeight === right.artifactHeight &&
    left.carrierVoice === right.carrierVoice &&
    left.artifactInLightPath === right.artifactInLightPath &&
    left.artifactSilhouette === right.artifactSilhouette &&
    left.artifactId === right.artifactId
  );
}

export function sanitizeShadowLaboratoryState(
  value: unknown,
): ShadowLaboratoryState {
  const initial = createInitialShadowLaboratoryState();
  if (!isRecord(value)) {
    return initial;
  }

  const runCount = safeCount(value.runCount);
  const unproductiveRuns = Math.min(
    safeCount(value.unproductiveRuns),
    runCount,
  );
  const nextState: ShadowLaboratoryState = {
    mode: value.mode === "stepper" ? "stepper" : "spatial",
    selectedPiece: isPiece(value.selectedPiece)
      ? value.selectedPiece
      : null,
    slots: sanitizeSlots(value.slots),
    stepperAnswers: sanitizeStepperAnswers(value.stepperAnswers),
    artifactPosition: finitePosition(value.artifactPosition, 4, 1, 8),
    carrierPosition: finitePosition(value.carrierPosition, 5, 1, 8),
    runCount,
    unproductiveRuns,
    lastRunRecord: null,
    lastRunResult: null,
    lastModelEvidence: null,
    counterfactualPrediction: isPrediction(
      value.counterfactualPrediction,
    )
      ? value.counterfactualPrediction
      : null,
    counterfactualRecord: null,
    counterfactualEvidence: null,
    hintVisible:
      value.hintVisible === true && unproductiveRuns >= 1,
    comparisonVisible: false,
  };

  const runRecord = sanitizeRunRecord(value.lastRunRecord);
  if (
    runCount < 1 ||
    !runRecord ||
    !runRecordMatchesState(runRecord, nextState)
  ) {
    return nextState;
  }

  const evaluation = runCurrentArrangement(nextState);
  const restoredRunState: ShadowLaboratoryState = {
    ...nextState,
    lastRunRecord: runRecord,
    lastRunResult: evaluation.output.result,
    lastModelEvidence: evaluation.evidence,
  };

  const counterfactualRecord = sanitizeCounterfactualRecord(
    value.counterfactualRecord,
  );
  if (
    !evaluation.isComplete ||
    !counterfactualRecord ||
    !restoredRunState.counterfactualPrediction ||
    counterfactualRecord.mode !== restoredRunState.mode ||
    counterfactualRecord.prediction !==
      restoredRunState.counterfactualPrediction
  ) {
    return restoredRunState;
  }

  const expectedBefore = createCurrentModelInput(restoredRunState);
  const expectedAfter = createCurrentModelInput(
    restoredRunState,
    Math.max(0.5, restoredRunState.artifactPosition - 1),
  );
  if (
    !sameModelInput(counterfactualRecord.beforeInput, expectedBefore) ||
    !sameModelInput(counterfactualRecord.afterInput, expectedAfter)
  ) {
    return restoredRunState;
  }

  const before = runShadowModel(counterfactualRecord.beforeInput);
  const after = runShadowModel(counterfactualRecord.afterInput);
  if (
    before.projectionScale === null ||
    after.projectionScale === null ||
    after.projectionScale <= before.projectionScale
  ) {
    return restoredRunState;
  }

  return {
    ...restoredRunState,
    counterfactualRecord,
    counterfactualEvidence: {
      changedVariable: "artifact_distance_from_light",
      prediction: counterfactualRecord.prediction,
      observedConsequence: "projection_increases",
      beforeScale: before.projectionScale,
      afterScale: after.projectionScale,
      matched:
        counterfactualRecord.prediction === "projection_increases",
    },
    comparisonVisible: value.comparisonVisible === true,
  };
}

export function pieceName(pieceId: LaboratoryPieceId | null) {
  if (!pieceId) {
    return "vazio";
  }
  return (
    PIECE_DEFINITIONS.find((piece) => piece.id === pieceId)?.shortName ??
    "peça"
  );
}

export function createLaboratoryRunRecord(
  state: ShadowLaboratoryState,
): LaboratoryRunRecord {
  return {
    mode: state.mode,
    slots: { ...state.slots },
    stepperAnswers: { ...state.stepperAnswers },
    artifactPosition: state.artifactPosition,
    carrierPosition: state.carrierPosition,
  };
}

function causalResolution(state: ShadowLaboratoryState) {
  if (state.mode === "spatial") {
    return {
      projectionResolved:
        state.slots.fire === correctSlots.fire &&
        state.slots.artifact === correctSlots.artifact &&
        state.slots.wall === correctSlots.wall,
      soundResolved:
        state.slots.carrier === correctSlots.carrier,
      observerResolved:
        state.slots.prisoner === correctSlots.prisoner,
      sizeVariableResolved: true,
    };
  }

  return {
    projectionResolved:
      state.stepperAnswers.light_source ===
        correctStepperAnswers.light_source &&
      state.stepperAnswers.light_blocker ===
        correctStepperAnswers.light_blocker &&
      state.stepperAnswers.projection_destination ===
        correctStepperAnswers.projection_destination,
    soundResolved:
      state.stepperAnswers.sound_source ===
      correctStepperAnswers.sound_source,
    observerResolved: true,
    sizeVariableResolved:
      state.stepperAnswers.size_variable ===
      correctStepperAnswers.size_variable,
  };
}

export function createCurrentModelInput(
  state: ShadowLaboratoryState,
  artifactPosition = state.artifactPosition,
): PersistedShadowModelInput {
  const resolution = causalResolution(state);
  return {
    lightPosition: 0,
    artifactPosition,
    wallPosition: 10,
    artifactHeight: 2,
    carrierVoice: resolution.soundResolved ? "human" : "silent",
    artifactSilhouette: "bird",
    artifactId: "bird_artifact",
    artifactInLightPath: resolution.projectionResolved,
  };
}

export function runCurrentArrangement(
  state: ShadowLaboratoryState,
): ArrangementEvaluation {
  const resolution = causalResolution(state);
  const output = runShadowModel(createCurrentModelInput(state));
  const isComplete =
    resolution.projectionResolved &&
    resolution.soundResolved &&
    resolution.observerResolved &&
    resolution.sizeVariableResolved &&
    output.status === "productive";

  return {
    output,
    ...resolution,
    isComplete,
    evidence: isComplete ? MODEL_EVIDENCE : null,
  };
}
