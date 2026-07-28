import type { ReactNode } from "react";
import styles from "./philoo-story-folio.module.css";

export type PhilooStoryFolioMode =
  | "conversation"
  | "illustrated"
  | "workbench"
  | "reflection";

export type PhilooStoryFolioProps = {
  title: string;
  titleId: string;
  mode: PhilooStoryFolioMode;
  character: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  activity?: ReactNode;
  className?: string;
};

export function PhilooStoryFolio({
  title,
  titleId,
  mode,
  character,
  primary,
  secondary,
  activity,
  className,
}: PhilooStoryFolioProps) {
  return (
    <div
      className={[styles.folio, className].filter(Boolean).join(" ")}
      data-philoo-story-folio
      data-folio-mode={mode}
    >
      <span className={styles.backSheet} aria-hidden="true" />
      <span className={styles.middleSheet} aria-hidden="true" />

      <div className={styles.page}>
        <h1
          id={titleId}
          className={styles.chapterTab}
          data-folio-chapter-tab
        >
          {title}
        </h1>

        <div className={styles.composition}>
          <div className={styles.character} data-folio-slot="character">
            {character}
          </div>
          <div className={styles.primary} data-folio-slot="primary">
            {primary}
          </div>
          {secondary != null ? (
            <div className={styles.secondary} data-folio-slot="secondary">
              {secondary}
            </div>
          ) : null}
          {activity != null ? (
            <div className={styles.activity} data-folio-slot="activity">
              {activity}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
