import type { ReactNode } from "react";
import styles from "./philoo-narrative-composition.module.css";

export type PhilooNarrativeCompositionProps = {
  dialogue: ReactNode;
  guide: ReactNode;
  illustration?: ReactNode;
  guideSide?: "start" | "end";
  className?: string;
};

export function PhilooNarrativeComposition({
  dialogue,
  guide,
  illustration,
  guideSide = "end",
  className,
}: PhilooNarrativeCompositionProps) {
  const hasIllustration = illustration != null;

  return (
    <div
      className={[styles.composition, className].filter(Boolean).join(" ")}
      data-philoo-narrative-composition
      data-guide-side={guideSide}
      data-has-illustration={hasIllustration ? "true" : "false"}
    >
      <div className={styles.narrativeStack}>
        {hasIllustration ? (
          <div
            className={styles.illustration}
            data-narrative-slot="illustration"
          >
            {illustration}
          </div>
        ) : null}
        <div className={styles.dialogue} data-narrative-slot="dialogue">
          {dialogue}
        </div>
      </div>
      <div className={styles.guide} data-narrative-slot="guide">
        {guide}
      </div>
    </div>
  );
}
