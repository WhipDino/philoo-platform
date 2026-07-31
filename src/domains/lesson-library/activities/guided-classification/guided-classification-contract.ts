import type { PhilooLessonCharacterGuideConfig } from "@/domains/lessons/philoo-lesson-character-guide";

export const GUIDED_CLASSIFICATION_SCHEMA_VERSION = "1" as const;

export type GuidedClassificationTone = "blue" | "apricot" | "lavender";

export type GuidedClassificationIcon =
  | "brain"
  | "dialogue"
  | "eye"
  | "question"
  | "scales";

export type GuidedClassificationCategory<CategoryId extends string> = {
  id: CategoryId;
  label: string;
  hint: string;
  tone: GuidedClassificationTone;
  icon: GuidedClassificationIcon;
  correctionHint: string;
};

export type GuidedClassificationCard<CategoryId extends string> = {
  id: string;
  text: string;
  answer: CategoryId;
};

export type GuidedClassificationWorkedExample<CategoryId extends string> = {
  eyebrow: string;
  title: string;
  introductionTitle: string;
  introductionBody: string;
  items: readonly {
    categoryId: CategoryId;
    statement: string;
    explanation: string;
  }[];
  continueLabel: string;
};

export type GuidedClassificationTableCopy = {
  desktopAriaLabel: string;
  trayKicker: string;
  trayTitle: string;
  completedTrayTitle: string;
  completedTrayBody: string;
  destinationsAriaLabel: string;
  dropCue: string;
  placeHere: string;
  emptyDestination: string;
  mobileAriaLabel: string;
  mobileItemLabel: string;
  mobilePlacedLabel: string;
  mobileQuestion: string;
  mobileDestinationsAriaLabel: string;
  mobileCompleteTitle: string;
  mobileCompleteBody: string;
  mobileReviewTitle: string;
  mobileReviewActionPrefix: string;
};

export type GuidedClassificationConfig<CategoryId extends string> = {
  id: string;
  schemaVersion: typeof GUIDED_CLASSIFICATION_SCHEMA_VERSION;
  guide?: PhilooLessonCharacterGuideConfig;
  workedExample: GuidedClassificationWorkedExample<CategoryId>;
  prompt: {
    title: string;
    instruction: string;
    selectedInstruction: string;
    idleInstruction: string;
  };
  categories: readonly GuidedClassificationCategory<CategoryId>[];
  cards: readonly GuidedClassificationCard<CategoryId>[];
  feedback: {
    initial: string;
    correctPlacement: string;
    successTitle: string;
    successBody: string;
    retryTitle: string;
  };
  labels: {
    itemSingular: string;
    itemPlural: string;
    progressLabel: string;
    check: string;
  };
  table: GuidedClassificationTableCopy;
};

export type GuidedClassificationState<CategoryId extends string = string> = {
  schemaVersion: typeof GUIDED_CLASSIFICATION_SCHEMA_VERSION;
  stage: "example" | "challenge";
  selectedCardId: string | null;
  placements: Readonly<Record<string, CategoryId>>;
  hasChecked: boolean;
  lastMove: {
    cardId: string;
    destinationId: CategoryId;
  } | null;
};

export function createGuidedClassificationState<
  CategoryId extends string,
>(): GuidedClassificationState<CategoryId> {
  return {
    schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
    stage: "example",
    selectedCardId: null,
    placements: {},
    hasChecked: false,
    lastMove: null,
  };
}

export function sanitizeGuidedClassificationState<CategoryId extends string>(
  config: GuidedClassificationConfig<CategoryId>,
  candidate: unknown,
): GuidedClassificationState<CategoryId> {
  const initial = createGuidedClassificationState<CategoryId>();

  if (!candidate || typeof candidate !== "object") return initial;

  const source = candidate as Partial<GuidedClassificationState<string>>;
  const validCardIds = new Set(config.cards.map((card) => card.id));
  const validCategoryIds = new Set(
    config.categories.map((category) => category.id),
  );
  const placements: Record<string, CategoryId> = {};

  if (source.placements && typeof source.placements === "object") {
    for (const [cardId, destinationId] of Object.entries(source.placements)) {
      if (
        validCardIds.has(cardId) &&
        typeof destinationId === "string" &&
        validCategoryIds.has(destinationId as CategoryId)
      ) {
        placements[cardId] = destinationId as CategoryId;
      }
    }
  }

  const selectedCardId =
    typeof source.selectedCardId === "string" &&
    validCardIds.has(source.selectedCardId)
      ? source.selectedCardId
      : null;
  const lastMove =
    source.lastMove &&
    validCardIds.has(source.lastMove.cardId) &&
    validCategoryIds.has(source.lastMove.destinationId as CategoryId) &&
    placements[source.lastMove.cardId] === source.lastMove.destinationId
      ? {
          cardId: source.lastMove.cardId,
          destinationId: source.lastMove.destinationId as CategoryId,
        }
      : null;

  return {
    schemaVersion: GUIDED_CLASSIFICATION_SCHEMA_VERSION,
    stage: source.stage === "challenge" ? "challenge" : "example",
    selectedCardId,
    placements,
    hasChecked:
      Boolean(source.hasChecked) &&
      Object.keys(placements).length === config.cards.length,
    lastMove,
  };
}

export function evaluateGuidedClassification<CategoryId extends string>(
  config: GuidedClassificationConfig<CategoryId>,
  state: GuidedClassificationState<CategoryId>,
) {
  const incorrectCards = config.cards.filter(
    (card) =>
      state.placements[card.id] &&
      state.placements[card.id] !== card.answer,
  );
  const placedCount = Object.keys(state.placements).length;
  const allPlaced = placedCount === config.cards.length;
  const completedCorrectly =
    state.hasChecked && allPlaced && incorrectCards.length === 0;

  return {
    allPlaced,
    completedCorrectly,
    incorrectCards,
    placedCount,
  };
}
