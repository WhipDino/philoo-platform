import type { PlatoPoseKey } from "./plato-pose-catalog";
import { PlatoGuide } from "./plato-guide";

export type PhilooLessonCharacterGuideConfig = {
  characterId: "plato";
  pose: PlatoPoseKey;
  priority?: boolean;
  sizes?: string;
};

type PhilooLessonCharacterGuideProps = {
  config: PhilooLessonCharacterGuideConfig;
  className?: string;
};

export function PhilooLessonCharacterGuide({
  config,
  className,
}: PhilooLessonCharacterGuideProps) {
  switch (config.characterId) {
    case "plato":
      return (
        <PlatoGuide
          className={className}
          pose={config.pose}
          priority={config.priority}
          sizes={config.sizes}
        />
      );
  }
}
