"use client";

import Link from "next/link";
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

export function CaveDescentScene() {
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
        footerLabel="Continue a história"
        action={
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
