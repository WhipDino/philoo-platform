import type { ReactNode } from "react";
import styles from "./philoo-story-path-stage.module.css";

type PhilooFolioStageProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  context?: string;
  currentMoment?: number;
  totalMoments?: number;
  path?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  footerLabel?: string;
  className?: string;
  moment?: "story" | "concept";
};

type PhilooFolioVoiceProps = {
  speaker: string;
  children: ReactNode;
  tone?: "dialogue" | "prisoner" | "concept";
  className?: string;
};

export function PhilooFolioStage({
  eyebrow,
  title,
  titleId,
  context,
  currentMoment,
  totalMoments,
  path,
  children,
  action,
  footerLabel,
  className,
  moment = "story",
}: PhilooFolioStageProps) {
  const hasMoment =
    typeof currentMoment === "number" && typeof totalMoments === "number";
  const resolvedFooterLabel =
    footerLabel ??
    (hasMoment ? `Momento ${currentMoment} de ${totalMoments}` : undefined);

  return (
    <section
      className={[styles.stage, className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
      data-philoo-folio-stage
      data-folio-moment={moment}
      data-has-path={path ? "true" : "false"}
    >
      <span className={styles.underlay} aria-hidden="true" />
      <div
        className={styles.page}
        data-has-path={path ? "true" : "false"}
        data-has-footer={action ? "true" : "false"}
      >
        <header className={styles.masthead}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 id={titleId}>{title}</h1>
            {context ? <p>{context}</p> : null}
          </div>
          {hasMoment ? (
            <span className={styles.beatCount}>
              {currentMoment} de {totalMoments}
            </span>
          ) : null}
        </header>

        {path}

        <div className={styles.storyBody} data-philoo-folio-body>
          {children}
        </div>

        {action ? (
          <footer className={styles.actionDock}>
            <span>{resolvedFooterLabel}</span>
            <div data-philoo-folio-action>{action}</div>
          </footer>
        ) : null}
      </div>
    </section>
  );
}

export function PhilooFolioVoice({
  speaker,
  children,
  tone = "dialogue",
  className,
}: PhilooFolioVoiceProps) {
  return (
    <div
      className={[styles.voiceSheet, className].filter(Boolean).join(" ")}
      data-philoo-folio-voice
      data-tone={tone}
      role="status"
      aria-live="polite"
    >
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
      <p className={styles.speaker}>{speaker}</p>
      <div className={styles.copy}>{children}</div>
    </div>
  );
}
