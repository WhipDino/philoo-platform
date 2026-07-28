"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PhilooFolioStage,
  PhilooFolioVoice,
} from "../philoo-folio-stage";
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { useStorySceneTransition } from "../use-story-scene-transition";
import {
  CAVE_STORY_BEATS,
  CAVE_STORY_TOTAL_BEATS,
} from "./cave-story-beats";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-soft-story-layout.module.css";
import pathStyles from "../philoo-story-path-stage.module.css";

export function CaveDescentScene() {
  const [hasAdvancedPath, setHasAdvancedPath] = useState(false);
  const nextScene = "/aula/as-sombras/so-a-parede";
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: nextScene,
    durationMs: 480,
  });

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/primeira-tela"
      currentBeat={CAVE_STORY_BEATS.descent.ordinal}
      totalBeats={CAVE_STORY_TOTAL_BEATS}
      labelledBy="cave-descent-title"
      phase={phase}
      onAnimationEnd={completeExit}
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "a-descida",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow={CAVE_STORY_BEATS.descent.label}
        title={CAVE_STORY_BEATS.descent.sceneTitle}
        titleId="cave-descent-title"
        footerLabel={
          hasAdvancedPath ? "A luz ficou para trás" : "A entrada ainda está perto"
        }
        path={
          <ol className={pathStyles.path} aria-label="Caminho pela passagem">
            <li
              data-story-step-state={hasAdvancedPath ? "visited" : "current"}
            >
              <span className={pathStyles.stepChip}>
                <span className={pathStyles.stepIcon} aria-hidden="true">
                  {hasAdvancedPath ? "✓" : "1"}
                </span>
                <span className={pathStyles.stepLabel}>Entrada</span>
                {!hasAdvancedPath ? (
                  <span className={pathStyles.activeStep} aria-hidden="true" />
                ) : null}
              </span>
            </li>
            <li
              data-story-step-state={hasAdvancedPath ? "current" : "upcoming"}
            >
              <span className={pathStyles.stepChip}>
                <span className={pathStyles.stepIcon} aria-hidden="true">
                  2
                </span>
                <span className={pathStyles.stepLabel}>Profundezas</span>
                {hasAdvancedPath ? (
                  <span className={pathStyles.activeStep} aria-hidden="true" />
                ) : null}
              </span>
            </li>
          </ol>
        }
        action={
          hasAdvancedPath ? (
            <Link
              href={nextScene}
              onClick={beginNavigation}
              aria-disabled={phase === "leaving"}
            >
              {CAVE_STORY_BEATS.descent.action}
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ) : (
            <button
              type="button"
              aria-pressed={hasAdvancedPath}
              onClick={() => setHasAdvancedPath(true)}
            >
              Avançar pela passagem
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </button>
          )
        }
      >
        <PhilooNarrativeComposition
          className={styles.narrativeComposition}
          guideSide="start"
          dialogue={
            <PhilooFolioVoice speaker="Platão">
              <h2 className={styles.title}>{CAVE_STORY_BEATS.descent.title}</h2>
              <p className={styles.lead}>{CAVE_STORY_BEATS.descent.story}</p>
              <p className={styles.guidance}>
                {CAVE_STORY_BEATS.descent.guidance}
              </p>
            </PhilooFolioVoice>
          }
          guide={<PlatoGuide pose="descent" priority />}
        />
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
