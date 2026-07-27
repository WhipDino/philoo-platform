import styles from "./cave-story-progress.module.css";

type CaveStoryProgressProps = {
  currentBeat: number;
  totalBeats: number;
};

export function CaveStoryProgress({
  currentBeat,
  totalBeats,
}: CaveStoryProgressProps) {
  const label = `Cena ${currentBeat} de ${totalBeats}`;

  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuenow={currentBeat}
      aria-valuemax={totalBeats}
      aria-valuetext={label}
    >
      {Array.from({ length: totalBeats }, (_, index) => {
        const beat = index + 1;
        const state =
          beat < currentBeat
            ? "complete"
            : beat === currentBeat
              ? "current"
              : "future";

        return <span key={beat} data-state={state} aria-hidden="true" />;
      })}
    </div>
  );
}
