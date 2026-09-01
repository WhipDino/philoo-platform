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
import styles from "../philoo-soft-story-layout.module.css";

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
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "primeira-tela",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow={beat.label}
        title={beat.sceneTitle}
        titleId="cave-invitation-title"
        footerLabel="Continue a história"
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
        <PhilooNarrativeComposition
          className={styles.narrativeComposition}
          guideSide="end"
          dialogue={
            <PhilooFolioVoice speaker="Platão">
              <h2 className={styles.title}>{beat.title}</h2>
              <p className={styles.lead}>{beat.story}</p>
              <p className={styles.guidance}>{beat.guidance}</p>
              <p className={styles.source}>{beat.source}</p>
            </PhilooFolioVoice>
          }
          guide={<PlatoGuide pose="invitation" priority />}
        />
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
