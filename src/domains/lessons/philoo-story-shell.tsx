"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type AnimationEventHandler,
  type ReactNode,
} from "react";
import { CaveStoryProgress } from "./as-sombras/cave-story-progress";
import {
  PhilooLessonJourneyRail,
  type LessonJourneyStage,
} from "./philoo-lesson-journey-rail";
import { PhilooOuterRibbons } from "./philoo-outer-ribbons";
import { PhilooSoftFrame } from "./philoo-soft-frame";
import styles from "./philoo-story-shell.module.css";

type StoryJourney = {
  lessonTitle: string;
  currentSceneId: string;
  stages: readonly LessonJourneyStage[];
  storageKey: string;
};

const JOURNEY_STATE_EVENT = "philoo:journey-state";
const journeyExpansionMemory = new Map<string, boolean>();
const journeyProgressMemory = new Map<string, number>();

function readJourneyExpansion(storageKey: string | undefined) {
  if (!storageKey) {
    return true;
  }

  const remembered = journeyExpansionMemory.get(storageKey);

  if (remembered !== undefined) {
    return remembered;
  }

  if (typeof window === "undefined") {
    return true;
  }

  try {
    return window.sessionStorage.getItem(storageKey) !== "collapsed";
  } catch {
    return true;
  }
}

function subscribeToJourneyExpansion(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(JOURNEY_STATE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(JOURNEY_STATE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readFurthestVisitedStage(
  storageKey: string | undefined,
  currentStageIndex: number,
  lastStageIndex: number,
) {
  if (!storageKey) {
    return currentStageIndex;
  }

  const remembered = journeyProgressMemory.get(storageKey);

  if (remembered !== undefined) {
    return Math.max(currentStageIndex, Math.min(remembered, lastStageIndex));
  }

  if (typeof window === "undefined") {
    return currentStageIndex;
  }

  try {
    const stored = Number.parseInt(
      window.sessionStorage.getItem(`${storageKey}:furthest`) ?? "",
      10,
    );

    return Number.isFinite(stored)
      ? Math.max(currentStageIndex, Math.min(stored, lastStageIndex))
      : currentStageIndex;
  } catch {
    return currentStageIndex;
  }
}

type PhilooStoryShellProps = {
  backHref: string;
  backLabel?: string;
  onBack?: () => void;
  currentBeat: number;
  totalBeats: number;
  labelledBy: string;
  phase: "idle" | "leaving";
  onAnimationEnd?: AnimationEventHandler<HTMLElement>;
  children: ReactNode;
  className?: string;
  showSoftFrame?: boolean;
  surfaceWidth?: "fluid" | "narrative";
  surfaceTreatment?: "standard" | "folio";
  journey?: StoryJourney;
};

export function PhilooStoryShell({
  backHref,
  backLabel = "Voltar",
  onBack,
  currentBeat,
  totalBeats,
  labelledBy,
  phase,
  onAnimationEnd,
  children,
  className,
  showSoftFrame = true,
  surfaceWidth = "fluid",
  surfaceTreatment = "standard",
  journey,
}: PhilooStoryShellProps) {
  const activeJourney =
    journey &&
    journey.stages.some((stage) =>
      stage.sceneIds.includes(journey.currentSceneId),
    )
      ? journey
      : undefined;
  const getJourneyExpansion = useCallback(
    () => readJourneyExpansion(activeJourney?.storageKey),
    [activeJourney?.storageKey],
  );
  const journeyExpanded = useSyncExternalStore(
    subscribeToJourneyExpansion,
    getJourneyExpansion,
    () => true,
  );
  const currentJourneyStageIndex = activeJourney
    ? activeJourney.stages.findIndex((stage) =>
        stage.sceneIds.includes(activeJourney.currentSceneId),
      )
    : -1;
  const getFurthestVisitedStage = useCallback(
    () =>
      readFurthestVisitedStage(
        activeJourney?.storageKey,
        currentJourneyStageIndex,
        (activeJourney?.stages.length ?? 0) - 1,
      ),
    [
      activeJourney?.stages.length,
      activeJourney?.storageKey,
      currentJourneyStageIndex,
    ],
  );
  const furthestVisitedStageIndex = useSyncExternalStore(
    subscribeToJourneyExpansion,
    getFurthestVisitedStage,
    () => currentJourneyStageIndex,
  );

  useEffect(() => {
    if (
      !activeJourney ||
      currentJourneyStageIndex < 0 ||
      typeof window === "undefined"
    ) {
      return;
    }

    const furthest = getFurthestVisitedStage();
    journeyProgressMemory.set(activeJourney.storageKey, furthest);

    try {
      window.sessionStorage.setItem(
        `${activeJourney.storageKey}:furthest`,
        String(furthest),
      );
    } catch {
      // The in-memory value keeps visited scene links available.
    }

    window.dispatchEvent(new Event(JOURNEY_STATE_EVENT));
  }, [activeJourney, currentJourneyStageIndex, getFurthestVisitedStage]);

  function changeJourneyExpansion(expanded: boolean) {
    if (!activeJourney || typeof window === "undefined") {
      return;
    }

    journeyExpansionMemory.set(activeJourney.storageKey, expanded);

    try {
      window.sessionStorage.setItem(
        activeJourney.storageKey,
        expanded ? "expanded" : "collapsed",
      );
    } catch {
      // The in-memory value keeps the interaction usable in private contexts.
    }

    window.dispatchEvent(new Event(JOURNEY_STATE_EVENT));
  }

  const storySurface = (
    <section
      className={styles.storySurface}
      aria-labelledby={labelledBy}
      data-phase={phase}
      data-philoo-story-shell
      data-surface-width={surfaceWidth}
      data-surface-treatment={surfaceTreatment}
      onAnimationEnd={onAnimationEnd}
    >
      {showSoftFrame ? <PhilooSoftFrame /> : null}
      <div className={styles.storyContent}>{children}</div>
    </section>
  );

  return (
    <main
      id="conteudo"
      className={[styles.page, className].filter(Boolean).join(" ")}
      data-surface-width={surfaceWidth}
      data-has-journey={activeJourney ? "true" : undefined}
    >
      {surfaceWidth === "narrative" && !activeJourney ? (
        <PhilooOuterRibbons />
      ) : null}

      <header className={styles.topbar}>
        {onBack ? (
          <button className={styles.back} type="button" onClick={onBack}>
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            <span>{backLabel}</span>
          </button>
        ) : (
          <Link className={styles.back} href={backHref}>
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            <span>{backLabel}</span>
          </Link>
        )}

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>{journey?.lessonTitle ?? "As Sombras"}</span>
        </div>

        {!activeJourney ? (
          <CaveStoryProgress
            currentBeat={currentBeat}
            totalBeats={totalBeats}
          />
        ) : null}
      </header>

      {activeJourney ? (
        <MotionConfig reducedMotion="user">
          <motion.div
            layout
            className={styles.journeyLayout}
            data-philoo-journey-layout
            data-journey-state={journeyExpanded ? "expanded" : "collapsed"}
            transition={{
              layout: {
                type: "spring",
                stiffness: 310,
                damping: 34,
                mass: 0.82,
              },
            }}
          >
            <motion.div
              key={activeJourney.currentSceneId}
              className={styles.storyMotionSlot}
              data-philoo-story-motion-slot
              data-philoo-scene-id={activeJourney.currentSceneId}
            >
              {storySurface}
            </motion.div>
            <PhilooLessonJourneyRail
              lessonTitle={activeJourney.lessonTitle}
              stages={activeJourney.stages}
              currentSceneId={activeJourney.currentSceneId}
              furthestVisitedStageIndex={furthestVisitedStageIndex}
              expanded={journeyExpanded}
              onExpandedChange={changeJourneyExpansion}
            />
          </motion.div>
        </MotionConfig>
      ) : (
        storySurface
      )}
    </main>
  );
}
