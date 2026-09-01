"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  useReducedMotion,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./philoo-lesson-journey-rail.module.css";

const JOURNEY_TRAVEL_FALLBACK_MS = 520;

type JourneyMovement = {
  sourceIndex: number;
  targetIndex: number;
  direction: "up" | "down";
  href: string;
};

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
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const railBodyId = useId();
  const travelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movementRef = useRef<JourneyMovement | null>(null);
  const [movement, setMovement] = useState<JourneyMovement | null>(null);
  const activeStageIndex = stages.findIndex((stage) =>
    stage.sceneIds.includes(currentSceneId),
  );
  const activeStage =
    activeStageIndex >= 0 ? stages[activeStageIndex] : undefined;
  const activeSceneIndex = activeStage?.sceneIds.indexOf(currentSceneId) ?? -1;
  const activeMovement =
    movement?.sourceIndex === activeStageIndex ? movement : null;
  const safeActiveStageIndex = Math.max(activeStageIndex, 0);
  const toggleLabel = expanded ? "Recolher jornada" : "Abrir jornada";
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };
  const visualActiveStageIndex =
    activeMovement?.targetIndex ?? activeStageIndex;

  useEffect(() => {
    movementRef.current = null;

    return () => {
      if (travelTimer.current) {
        clearTimeout(travelTimer.current);
      }
    };
  }, [activeStageIndex]);

  function moveToStage(
    event: React.MouseEvent<HTMLAnchorElement>,
    targetIndex: number,
    href: string,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (event.currentTarget.target !== "" &&
        event.currentTarget.target !== "_self") ||
      event.currentTarget.hasAttribute("download")
    ) {
      return;
    }

    event.preventDefault();

    if (activeMovement) {
      return;
    }

    if (shouldReduceMotion) {
      router.push(href);
      return;
    }

    const nextMovement: JourneyMovement = {
      sourceIndex: activeStageIndex,
      targetIndex,
      direction: targetIndex < activeStageIndex ? "up" : "down",
      href,
    };

    movementRef.current = nextMovement;
    setMovement(nextMovement);

    travelTimer.current = setTimeout(
      finishStageTravel,
      JOURNEY_TRAVEL_FALLBACK_MS,
    );
  }

  function finishStageTravel() {
    const current = movementRef.current;

    if (!current) {
      return;
    }

    if (travelTimer.current) {
      clearTimeout(travelTimer.current);
      travelTimer.current = null;
    }

    movementRef.current = null;
    router.push(current.href);
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax} strict>
        <aside
          className={styles.rail}
          aria-label={`Sua jornada em ${lessonTitle}`}
          aria-busy={activeMovement ? "true" : undefined}
          data-philoo-journey-rail
          data-expanded={expanded}
          data-navigation-direction={activeMovement?.direction}
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
                {expanded ? "←" : (
                  <span className={styles.pathMark} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
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

                    <LayoutGroup id={`journey-${railBodyId}`}>
                      <ol className={styles.stages}>
                        {stages.map((stage, index) => {
                          const isVisualCurrent =
                            index === visualActiveStageIndex;
                          const isCurrentScene =
                            index === activeStageIndex;
                          const canNavigate =
                            index <= furthestVisitedStageIndex &&
                            !isCurrentScene;
                          const state = isVisualCurrent
                            ? "current"
                            : index <= furthestVisitedStageIndex
                              ? "completed"
                              : "upcoming";

                          return (
                            <li
                              className={styles.stage}
                              data-state={state}
                              key={stage.id}
                            >
                              {isVisualCurrent ? (
                                <m.div
                                  className={styles.activeIndicator}
                                  data-journey-selection
                                  data-arrival={
                                    activeMovement ? "traveling" : "settled"
                                  }
                                  layoutId="philoo-journey-selection"
                                  initial={false}
                                  onLayoutAnimationComplete={
                                    finishStageTravel
                                  }
                                  transition={{
                                    layout: {
                                      type: "spring",
                                      stiffness: 420,
                                      damping: 23,
                                      mass: 0.68,
                                      restDelta: 0.8,
                                      restSpeed: 12,
                                    },
                                  }}
                                />
                              ) : null}

                              <span
                                className={styles.marker}
                                aria-hidden="true"
                              >
                                {state === "completed" ? "✓" : index + 1}
                              </span>

                              <div className={styles.stageCopy}>
                                {canNavigate ? (
                                  <Link
                                    className={styles.stageLabel}
                                    href={stage.href}
                                    onClick={(event) =>
                                      moveToStage(
                                        event,
                                        index,
                                        stage.href,
                                      )
                                    }
                                  >
                                    {stage.label}
                                  </Link>
                                ) : (
                                  <span
                                    className={styles.stageLabel}
                                    aria-current={
                                      isCurrentScene ? "step" : undefined
                                    }
                                    aria-disabled={
                                      state === "upcoming"
                                        ? "true"
                                        : undefined
                                    }
                                  >
                                    {stage.label}
                                  </span>
                                )}
                                {isCurrentScene &&
                                stage.sceneIds.length > 1 ? (
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
                    </LayoutGroup>

                    <p className={styles.note}>
                      Cada descoberta abre a próxima etapa.
                    </p>
                    <span className={styles.srOnly} aria-live="polite">
                      {activeMovement
                        ? `Indo para ${stages[activeMovement.targetIndex]?.label}.`
                        : ""}
                    </span>
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
