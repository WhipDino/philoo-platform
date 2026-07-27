import Image from "next/image";
import { getPlatoPose, type PlatoPoseKey } from "./plato-pose-catalog";
import styles from "./plato-guide.module.css";

type PlatoGuideProps = {
  pose: PlatoPoseKey;
  stageBeat?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function PlatoGuide({
  pose,
  stageBeat,
  priority = false,
  sizes = "(max-width: 620px) 230px, (max-width: 900px) 36vw, 420px",
  className,
}: PlatoGuideProps) {
  const asset = getPlatoPose(pose);

  return (
    <div
      className={[styles.guide, className].filter(Boolean).join(" ")}
      data-plato-pose={pose}
    >
      <Image
        key={pose}
        className={styles.image}
        src={asset.src}
        alt={asset.alt}
        width={1024}
        height={1536}
        sizes={sizes}
        data-stage-beat={stageBeat}
        priority={priority}
      />
    </div>
  );
}
