"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  PhilooFolioStage,
  PhilooFolioVoice,
} from "../philoo-folio-stage";
import { PhilooNarrativeComposition } from "../philoo-narrative-composition";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { useStorySceneTransition } from "../use-story-scene-transition";
import {
  AS_SOMBRAS_JOURNEY_STAGES,
  getAsSombrasChapterLabel,
} from "./as-sombras-journey";
import styles from "./cave-soft-story-layout.module.css";

const NEXT_SCENE = "/aula/as-sombras/jogo-da-parede";

const DIALOGUE_BEATS = [
  {
    speaker: "Platão",
    kind: "plato",
    text: "Agora, olhe com elas. Tudo o que conseguem ver acontece nesta parede.",
    storyPanel: {
      src: "/images/story/cave-wall-observers-v5.png",
      alt: "Três prisioneiros observam juntos as sombras na parede da caverna",
    },
  },
  {
    speaker: "Prisioneiro",
    kind: "prisoner",
    text: "Um pássaro! Eu reconheci primeiro!",
    storyPanel: {
      src: "/images/story/cave-prisoner-bird-shadow-v5.png",
      alt: "Um prisioneiro aponta para a sombra de um pássaro na parede",
    },
  },
  {
    speaker: "Platão",
    kind: "plato",
    text: "Aqui, quem reconhece as sombras mais depressa parece ser o mais sábio.",
    storyPanel: {
      src: "/images/story/cave-prisoner-congratulated-v5.png",
      alt: "Os prisioneiros parabenizam quem reconheceu primeiro a sombra do pássaro",
    },
  },
  {
    speaker: "Platão",
    kind: "plato",
    text: "Eles conhecem muito bem as aparências — mas nunca viram o que as produz. Guarde essa diferença.",
  },
] as const;

const PLATO_BY_BEAT = [
  "observe-with-them",
  "listening-prisoner",
  "shadow-expert",
  "appearance-source",
] as const satisfies readonly PlatoPoseKey[];

export function CaveShadowNamesScene() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const isLastBeat = dialogueIndex === DIALOGUE_BEATS.length - 1;
  const dialogueBeat = DIALOGUE_BEATS[dialogueIndex];
  const finalActionRef = useRef<HTMLAnchorElement>(null);
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 520,
  });

  useEffect(() => {
    if (isLastBeat) {
      finalActionRef.current?.focus();
    }
  }, [isLastBeat]);

  function continueStory() {
    setDialogueIndex((current) =>
      Math.min(current + 1, DIALOGUE_BEATS.length - 1),
    );
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/so-a-parede"
      onBack={
        dialogueIndex > 0
          ? () => setDialogueIndex((current) => Math.max(0, current - 1))
          : undefined
      }
      currentBeat={4}
      totalBeats={10}
      labelledBy="shadow-names-title"
      phase={phase}
      onAnimationEnd={completeExit}
      className={styles.storyPanelPage}
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "eles-dao-nomes",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow={getAsSombrasChapterLabel("eles-dao-nomes")}
        title="O mundo na parede"
        titleId="shadow-names-title"
        currentMoment={dialogueIndex + 1}
        totalMoments={DIALOGUE_BEATS.length}
        action={
          isLastBeat ? (
            <Link
              ref={finalActionRef}
              href={NEXT_SCENE}
              onClick={beginNavigation}
              aria-disabled={phase === "leaving"}
            >
              Observar as sombras
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ) : (
            <button type="button" onClick={continueStory}>
              Continuar
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </button>
          )
        }
      >
        <PhilooNarrativeComposition
          className={styles.storyStage}
          guideSide="start"
          illustration={
            "storyPanel" in dialogueBeat ? (
              <figure
                className={styles.storyPanel}
                data-story-panel
                key={dialogueBeat.storyPanel.src}
              >
                <Image
                  src={dialogueBeat.storyPanel.src}
                  alt={dialogueBeat.storyPanel.alt}
                  width={1600}
                  height={900}
                  sizes="(max-width: 620px) calc(100vw - 52px), (max-width: 900px) 52vw, 600px"
                />
              </figure>
            ) : undefined
          }
          dialogue={
            <PhilooFolioVoice
              speaker={dialogueBeat.speaker}
              tone={dialogueBeat.kind === "prisoner" ? "prisoner" : "dialogue"}
            >
              <p className={styles.beatCopy} key={dialogueIndex}>
                {dialogueBeat.text}
              </p>
            </PhilooFolioVoice>
          }
          guide={
            <PlatoGuide
              pose={PLATO_BY_BEAT[dialogueIndex]}
              stageBeat={dialogueIndex}
              priority
            />
          }
        />
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
