"use client";

import Link from "next/link";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import { useId } from "react";
import styles from "./philoo-lesson-journey-rail.module.css";

export type LessonJourneyStage = {
  id: string;
  label: string;
  sceneIds: readonly string[];
  href: string;
};

export type PhilooLessonJourneyRailProps = {
  lessonTitle: string;
  stages: readonly LessonJourneyStage[];
  currentSceneId: string;
  furthestVisitedStageIndex: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

export function PhilooLessonJourneyRail({
  lessonTitle,
  stages,
  currentSceneId,
  furthestVisitedStageIndex,
  expanded,
  onExpandedChange,
}: PhilooLessonJourneyRailProps) {
  const shouldReduceMotion = useReducedMotion();
  const railBodyId = useId();
  const activeStageIndex = stages.findIndex((stage) =>
    stage.sceneIds.includes(currentSceneId),
  );
  const activeStage =
    activeStageIndex >= 0 ? stages[activeStageIndex] : undefined;
  const activeSceneIndex = activeStage?.sceneIds.indexOf(currentSceneId) ?? -1;
  const safeActiveStageIndex = Math.max(activeStageIndex, 0);
  const toggleLabel = expanded ? "Recolher jornada" : "Abrir jornada";
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <aside
          className={styles.rail}
          aria-label={`Sua jornada em ${lessonTitle}`}
          data-philoo-journey-rail
          data-expanded={expanded}
        >
          <div className={styles.offsetLayer} aria-hidden="true" />

          <div className={styles.card}>
            <button
              className={styles.toggle}
              type="button"
              aria-label={toggleLabel}
              aria-expanded={expanded}
              aria-controls={railBodyId}
              title={toggleLabel}
              onClick={() => onExpandedChange(!expanded)}
            >
              <span
                className={styles.arrow}
                data-direction={expanded ? "open" : "close"}
                aria-hidden="true"
              >
                ←
              </span>
            </button>

            <div className={styles.body} id={railBodyId}>
              <AnimatePresence initial={false} mode="wait">
                {expanded ? (
                  <m.div
                    key="expanded"
                    className={styles.content}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={transition}
                  >
                    <header className={styles.heading}>
                      <span className={styles.eyebrow}>Seu caminho</span>
                      <h2>{lessonTitle}</h2>
                      <p>Veja onde você está nesta história.</p>
                    </header>

                    <ol className={styles.stages}>
                      {stages.map((stage, index) => {
                        const state =
                          index === activeStageIndex
                            ? "current"
                            : index <= furthestVisitedStageIndex
                              ? "completed"
                            : "upcoming";
                        const isCurrent = state === "current";

                        return (
                          <li
                            className={styles.stage}
                            data-state={state}
                            key={stage.id}
                          >
                            <span className={styles.marker} aria-hidden="true">
                              {state === "completed" ? "✓" : index + 1}
                            </span>

                            <div className={styles.stageCopy}>
                              {state === "completed" ? (
                                <Link
                                  className={styles.stageLabel}
                                  href={stage.href}
                                >
                                  {stage.label}
                                </Link>
                              ) : (
                                <span
                                  className={styles.stageLabel}
                                  aria-current={
                                    isCurrent ? "step" : undefined
                                  }
                                  aria-disabled={
                                    state === "upcoming" ? "true" : undefined
                                  }
                                >
                                  {stage.label}
                                </span>
                              )}
                              {isCurrent && stage.sceneIds.length > 1 ? (
                                <span className={styles.sceneProgress}>
                                  {activeSceneIndex + 1} de{" "}
                                  {stage.sceneIds.length}
                                </span>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    <p className={styles.note}>
                      Cada descoberta abre a próxima etapa.
                    </p>
                  </m.div>
                ) : (
                  <m.div
                    key="collapsed"
                    className={styles.collapsedCue}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                  >
                    <span>{safeActiveStageIndex + 1}</span>
                    <i />
                    <small>Jornada</small>
                    <span className={styles.srOnly}>
                      Etapa {safeActiveStageIndex + 1} de {stages.length}:{" "}
                      {activeStage?.label ?? "Progresso da aula"}
                    </span>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>
      </LazyMotion>
    </MotionConfig>
  );
}
