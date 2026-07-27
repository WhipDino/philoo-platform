"use client";

import Link from "next/link";
import { PhilooDialogueCard } from "../philoo-dialogue-card";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { useStorySceneTransition } from "../use-story-scene-transition";
import {
  CAVE_STORY_BEATS,
  CAVE_STORY_TOTAL_BEATS,
} from "./cave-story-beats";
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
      showSoftFrame={false}
    >
      <div
        className={`${styles.storyLayout} ${styles.storyLayoutWithHeading}`}
        data-character-side="left"
      >
        <h1 id="cave-descent-title" className={styles.sceneHeading}>
          {CAVE_STORY_BEATS.descent.sceneTitle}
        </h1>

        <div className={styles.guideSlot}>
          <PlatoGuide pose="descent" priority />
        </div>

        <div className={styles.dialogueSlot}>
          <PhilooDialogueCard
            speaker="Platão"
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
            <h2 className={styles.title}>
              {CAVE_STORY_BEATS.descent.title}
            </h2>
            <p className={styles.lead}>{CAVE_STORY_BEATS.descent.story}</p>
            <p className={styles.guidance}>
              {CAVE_STORY_BEATS.descent.guidance}
            </p>
          </PhilooDialogueCard>
        </div>
      </div>
    </PhilooStoryShell>
  );
}
