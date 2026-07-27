import type { JsonObject } from "../contracts";
import {
  runShadowModel,
  SHADOW_CAUSAL_LINKS,
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
  | "invalid_position_order";
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

export interface ShadowLaboratoryFields {
  readonly mode: LaboratoryMode;
  readonly selectedPiece: LaboratoryPieceId | null;
  readonly slots: SlotState;
  readonly stepperAnswers: StepperAnswerState;
  readonly artifactPosition: number;
  readonly carrierPosition: number;
  readonly runCount: number;
  readonly lastRunResult: ModelRunResult | null;
  readonly lastModelEvidence: ModelRunEvidence | null;
  readonly counterfactualPrediction: CounterfactualPrediction | null;
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
    lastRunResult: null,
    lastModelEvidence: null,
    counterfactualPrediction: null,
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

function isModelEvidence(value: unknown): value is ModelRunEvidence {
  if (!isRecord(value) || !Array.isArray(value.causalLinks)) {
    return false;
  }
  const causalLinks = value.causalLinks;
  return (
    value.projectionSource === "bird_artifact" &&
    value.soundSource === "human_carrier" &&
    causalLinks.length === SHADOW_CAUSAL_LINKS.length &&
    SHADOW_CAUSAL_LINKS.every(
      (link, index) => causalLinks[index] === link,
    )
  );
}

function isCounterfactualEvidence(
  value: unknown,
): value is CounterfactualEvidence {
  return (
    isRecord(value) &&
    value.changedVariable === "artifact_distance_from_light" &&
    isPrediction(value.prediction) &&
    value.observedConsequence === "projection_increases" &&
    typeof value.beforeScale === "number" &&
    Number.isFinite(value.beforeScale) &&
    typeof value.afterScale === "number" &&
    Number.isFinite(value.afterScale) &&
    typeof value.matched === "boolean"
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

export function sanitizeShadowLaboratoryState(
  value: unknown,
): ShadowLaboratoryState {
  const initial = createInitialShadowLaboratoryState();
  if (!isRecord(value)) {
    return initial;
  }

  const savedSlots = isRecord(value.slots) ? value.slots : {};
  const nextSlots = Object.fromEntries(
    SLOT_DEFINITIONS.map((slot) => [
      slot.id,
      isPiece(savedSlots[slot.id]) ? savedSlots[slot.id] : null,
    ]),
  ) as SlotState;
  const savedAnswers = isRecord(value.stepperAnswers)
    ? value.stepperAnswers
    : {};
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
  const savedRunResult =
    value.lastRunResult === "projection_created" ||
    value.lastRunResult === "artifact_outside_light_path" ||
    value.lastRunResult === "invalid_position_order"
      ? value.lastRunResult
      : null;
  const savedRunCount =
    typeof value.runCount === "number" &&
    Number.isSafeInteger(value.runCount) &&
    value.runCount >= 0
      ? Math.min(value.runCount, 10_000)
      : 0;
  const hasValidModelEvidence = isModelEvidence(
    value.lastModelEvidence,
  );

  return {
    mode: value.mode === "stepper" ? "stepper" : "spatial",
    selectedPiece: isPiece(value.selectedPiece)
      ? value.selectedPiece
      : null,
    slots: nextSlots,
    stepperAnswers: nextAnswers as StepperAnswerState,
    artifactPosition: finitePosition(value.artifactPosition, 4, 1, 8),
    carrierPosition: finitePosition(value.carrierPosition, 5, 1, 8),
    runCount: savedRunCount,
    lastRunResult: savedRunResult,
    lastModelEvidence: hasValidModelEvidence ? MODEL_EVIDENCE : null,
    counterfactualPrediction: isPrediction(
      value.counterfactualPrediction,
    )
      ? value.counterfactualPrediction
      : null,
    counterfactualEvidence:
      hasValidModelEvidence &&
      isCounterfactualEvidence(value.counterfactualEvidence)
      ? {
          changedVariable: "artifact_distance_from_light",
          prediction: value.counterfactualEvidence.prediction,
          observedConsequence: "projection_increases",
          beforeScale: value.counterfactualEvidence.beforeScale,
          afterScale: value.counterfactualEvidence.afterScale,
          matched: value.counterfactualEvidence.matched,
        }
      : null,
    hintVisible: value.hintVisible === true,
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

export function runCurrentArrangement(state: ShadowLaboratoryState) {
  const isProductive =
    state.mode === "spatial"
      ? SLOT_DEFINITIONS.every(
          (slot) => state.slots[slot.id] === correctSlots[slot.id],
        )
      : STEPPER_QUESTIONS.every(
          (question) =>
            state.stepperAnswers[question.id] ===
            correctStepperAnswers[question.id],
        );

  return runShadowModel({
    lightPosition: 0,
    artifactPosition: state.artifactPosition,
    wallPosition: 10,
    artifactHeight: 2,
    carrierVoice: "human",
    artifactSilhouette: "bird",
    artifactId: "bird_artifact",
    artifactInLightPath: isProductive,
  });
}
