import type { PhilooLessonCharacterGuideConfig } from "@/domains/lessons/philoo-lesson-character-guide";

export const GUIDED_CLASSIFICATION_CHARACTER_BRIEF = {
  role: "Apresentar o exemplo resolvido e conduzir o olhar até as categorias.",
  composition: {
    background: "transparent",
    crop: "personagem inteiro, sem cortar mãos, cabeça ou gesto",
    facing: "direita",
    gesture: "apontar ou apresentar o conteúdo à direita",
    safeArea: "manter o lado direito livre para os cartões de conteúdo",
    preferredAspectRatio: "2:3",
  },
  renderedSize: {
    desktop: {
      columnWidth: "190–385 px",
      height: "270–430 px",
    },
    tablet: {
      columnWidth: "142–190 px",
      height: "270–300 px",
    },
    phone: {
      frameWidth: "148 px",
      frameHeight: "154 px",
      imageWidth: "124% do frame para preservar o gesto",
    },
  },
} as const;

export type GuidedClassificationCharacterPresetId = "plato";

type GuidedClassificationCharacterPreset = {
  guide: PhilooLessonCharacterGuideConfig;
  generationBrief: typeof GUIDED_CLASSIFICATION_CHARACTER_BRIEF;
};

const GUIDED_CLASSIFICATION_CHARACTER_PRESETS = {
  plato: {
    guide: {
      characterId: "plato",
      pose: "teaching-pointer",
      sizes: "(max-width: 540px) 120px, 210px",
    },
    generationBrief: GUIDED_CLASSIFICATION_CHARACTER_BRIEF,
  },
} satisfies Record<
  GuidedClassificationCharacterPresetId,
  GuidedClassificationCharacterPreset
>;

/**
 * Returns the approved character treatment for EX-05.
 *
 * Add a philosopher here only after its transparent asset satisfies the
 * generation brief above. Lesson configs should never hardcode file paths,
 * pose keys or responsive image sizes.
 */
export function getGuidedClassificationCharacterPreset(
  id: GuidedClassificationCharacterPresetId,
) {
  return GUIDED_CLASSIFICATION_CHARACTER_PRESETS[id];
}

export function getGuidedClassificationGuide(
  id: GuidedClassificationCharacterPresetId,
): PhilooLessonCharacterGuideConfig {
  return { ...getGuidedClassificationCharacterPreset(id).guide };
}
