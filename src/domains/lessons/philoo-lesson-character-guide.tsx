import type { CharacterId } from "@/domains/character-library";
import { PhilooCharacterGuide } from "./philoo-character-guide";
import type { PlatoPoseKey } from "./plato-pose-catalog";
import { PlatoGuide } from "./plato-guide";

export type PhilooLessonCharacterGuideConfig = {
  characterId: CharacterId;
  pose: string;
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
  if (config.characterId === "plato") {
    return (
      <PlatoGuide
        className={className}
        pose={config.pose as PlatoPoseKey}
        priority={config.priority}
        sizes={config.sizes}
      />
    );
  }

  return (
    <PhilooCharacterGuide
      className={className}
      characterId={config.characterId}
      poseId={config.pose}
      priority={config.priority}
      sizes={config.sizes}
    />
  );
}
