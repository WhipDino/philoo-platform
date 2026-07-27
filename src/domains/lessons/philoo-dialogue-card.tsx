import type { ReactNode } from "react";
import styles from "./philoo-dialogue-card.module.css";

type PhilooDialogueCardProps = {
  sceneLabel?: string;
  speaker: string;
  currentBeat?: number;
  totalBeats?: number;
  action: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "dialogue" | "activity" | "reflection";
};

export function PhilooDialogueCard({
  sceneLabel,
  speaker,
  currentBeat,
  totalBeats,
  action,
  children,
  className,
  tone = "dialogue",
}: PhilooDialogueCardProps) {
  const hasBeatProgress =
    typeof currentBeat === "number" && typeof totalBeats === "number";

  return (
    <div
      className={[styles.cluster, className].filter(Boolean).join(" ")}
      data-tone={tone}
    >
      {sceneLabel ? <p className={styles.sceneLabel}>{sceneLabel}</p> : null}

      <div className={styles.card} role="status" aria-live="polite">
        <span className={styles.quoteMark} aria-hidden="true">
          “
        </span>
        <p className={styles.speaker}>{speaker}</p>
        <div className={styles.copy}>{children}</div>

        <div className={styles.footer}>
          {hasBeatProgress ? (
            <div
              className={styles.beatProgress}
              aria-label={`Fala ${currentBeat} de ${totalBeats}`}
            >
              {Array.from({ length: totalBeats }, (_, index) => (
                <span
                  key={index}
                  data-active={index + 1 === currentBeat}
                  data-complete={index + 1 < currentBeat}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : (
            <span />
          )}

          <div className={styles.actionSlot}>{action}</div>
        </div>
      </div>
    </div>
  );
}
