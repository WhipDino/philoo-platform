import Image from "next/image";
import {
  getCharacterPose,
  type CharacterId,
} from "@/domains/character-library";
import styles from "./plato-guide.module.css";

type PhilooCharacterGuideProps = {
  characterId: CharacterId;
  poseId: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function PhilooCharacterGuide({
  characterId,
  poseId,
  priority = false,
  sizes = "(max-width: 620px) 230px, (max-width: 900px) 36vw, 420px",
  className,
}: PhilooCharacterGuideProps) {
  const asset = getCharacterPose(characterId, poseId);

  return (
    <div
      className={[styles.guide, className].filter(Boolean).join(" ")}
      data-character-id={characterId}
      data-character-pose={poseId}
    >
      <Image
        key={`${characterId}-${poseId}`}
        className={styles.image}
        src={asset.src}
        alt={asset.alt}
        width={1024}
        height={1536}
        sizes={sizes}
        unoptimized
        priority={priority}
      />
    </div>
  );
}
