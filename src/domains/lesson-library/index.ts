export {
  GuidedClassificationActivity,
} from "./activities/guided-classification/guided-classification-activity";
export {
  GuidedClassificationExercise,
  type GuidedClassificationExerciseProps,
} from "./activities/guided-classification/guided-classification-exercise";
export {
  GUIDED_CLASSIFICATION_CHARACTER_BRIEF,
  getGuidedClassificationCharacterPreset,
  getGuidedClassificationGuide,
  type GuidedClassificationCharacterPresetId,
} from "./activities/guided-classification/guided-classification-character-presets";
export {
  GUIDED_CLASSIFICATION_SCHEMA_VERSION,
  createGuidedClassificationState,
  evaluateGuidedClassification,
  sanitizeGuidedClassificationState,
  type GuidedClassificationCard,
  type GuidedClassificationCategory,
  type GuidedClassificationConfig,
  type GuidedClassificationIcon,
  type GuidedClassificationState,
  type GuidedClassificationTableCopy,
  type GuidedClassificationTone,
  type GuidedClassificationWorkedExample,
} from "./activities/guided-classification/guided-classification-contract";
export { PhilooCausalPath } from "./activities/causal-path/philoo-causal-path";
export type { CausalPathItem } from "./activities/causal-path/philoo-causal-path";
export { PhilooCausalPathDemonstration } from "./activities/causal-path/philoo-causal-path-demonstration";
export {
  PredictionConsequence,
  type PredictionChoice,
  type PredictionConsequenceProps,
} from "./activities/prediction-consequence/prediction-consequence";
export { PhilooChoiceDemonstration } from "./activities/prediction-consequence/philoo-choice-demonstration";
export {
  PhilooPairConnect,
  type PairConnectItem,
  type PairConnectProps,
} from "./activities/pair-connect/philoo-pair-connect";
export { PhilooPairConnectDemonstration } from "./activities/pair-connect/philoo-pair-connect-demonstration";
export {
  PhilooDualLens,
  type DualLensAlternative,
  type DualLensImage,
  type DualLensState,
  type PhilooDualLensProps,
} from "./activities/dual-lens/philoo-dual-lens";
export { PhilooDualLensDemonstration } from "./activities/dual-lens/philoo-dual-lens-demonstration";
export {
  PhilooDecisionLayers,
  type DecisionLayer,
  type DecisionLayersOutOfPlaceFeedback,
  type DecisionLayersState,
  type PhilooDecisionLayersProps,
} from "./activities/decision-layers/philoo-decision-layers";
export { PhilooDecisionLayersDemonstration } from "./activities/decision-layers/philoo-decision-layers-demonstration";
export { selectExercisesForChapter } from "./select-exercises";
export type { ExerciseBeat, ExercisePick, ExerciseSelectionResult } from "./select-exercises";
