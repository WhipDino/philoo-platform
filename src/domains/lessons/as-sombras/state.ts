import type { JsonObject } from "../contracts";

export const CAVE_SCENE_IDS = [
  "prologue_corte_de_luz",
  "prisoner_view",
  "prediction_mastery",
  "impossible_shadow",
  "evidence_investigation",
  "shadow_laboratory",
  "defend_model",
  "revision_map",
  "transfer_case",
] as const;

export type CaveSceneId = (typeof CAVE_SCENE_IDS)[number];

export type CaveSceneState = Readonly<
  Partial<Record<CaveSceneId, JsonObject>>
>;

export const initialCaveSceneState: CaveSceneState = {};

export const PROLOGUE_HYPOTHESIS_RESPONSE_KEY = "prologueHypothesis";

export const CAVE_RESPONSE_KEYS = {
  prologueHypothesis: PROLOGUE_HYPOTHESIS_RESPONSE_KEY,
  observationClassification: "observationClassification",
  wallForecasts: "wallForecasts",
  wallPatternMastery: "wallPatternMastery",
  anomalyNotice: "anomalyNotice",
  firstClue: "firstClue",
  inspectedClues: "inspectedClues",
  modelFitComparisons: "modelFitComparisons",
  causalModel: "causalModel",
  counterfactualPrediction: "counterfactualPrediction",
  defendedModel: "defendedModel",
  revision: "revision",
  transferClassification: "transferClassification",
} as const;
