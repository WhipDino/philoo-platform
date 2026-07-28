"use client";

import Link from "next/link";
import { PhilooDialogueCard } from "../philoo-dialogue-card";
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

export function CaveInvitationScene() {
  const beat = CAVE_STORY_BEATS.invitation;
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: "/aula/as-sombras/a-descida",
    durationMs: 560,
  });

  return (
    <PhilooStoryShell
      backHref="/inicio"
      backLabel="Sair"
      currentBeat={beat.ordinal}
      totalBeats={CAVE_STORY_TOTAL_BEATS}
      labelledBy="cave-invitation-title"
      phase={phase}
      onAnimationEnd={completeExit}
      surfaceWidth="narrative"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "primeira-tela",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <div className={`${styles.storyLayout} ${styles.storyLayoutWithHeading}`}>
        <h1 id="cave-invitation-title" className={styles.sceneHeading}>
          {beat.sceneTitle}
        </h1>

        <PhilooNarrativeComposition
          className={styles.narrativeComposition}
          guideSide="end"
          dialogue={
            <PhilooDialogueCard
              speaker="Platão"
              action={
                <Link
                  href="/aula/as-sombras/a-descida"
                  onClick={beginNavigation}
                  aria-disabled={phase === "leaving"}
                >
                  {beat.action}
                  <span className={styles.actionArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              }
            >
              <h2 className={styles.title}>{beat.title}</h2>
              <p className={styles.lead}>{beat.story}</p>
              <p className={styles.guidance}>{beat.guidance}</p>
              <p className={styles.source}>{beat.source}</p>
            </PhilooDialogueCard>
          }
          guide={<PlatoGuide pose="invitation" priority />}
        />
      </div>
    </PhilooStoryShell>
  );
}
