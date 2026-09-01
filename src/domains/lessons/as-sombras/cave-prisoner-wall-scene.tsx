"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PhilooStoryPathStage } from "../philoo-story-path-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { useStorySceneTransition } from "../use-story-scene-transition";
import {
  AS_SOMBRAS_JOURNEY_STAGES,
  getAsSombrasChapterLabel,
} from "./as-sombras-journey";
import styles from "../philoo-soft-story-layout.module.css";

const NEXT_SCENE = "/aula/as-sombras/eles-dao-nomes";
const SCENE_TITLE = "Mais fundo";

const STORY_PATH_STEPS = [
  { id: "luz", label: "A luz fica para trás", kind: "story" },
  { id: "pessoas", label: "Quem vive aqui", kind: "lesson" },
  { id: "parede", label: "O mundo na parede", kind: "concept" },
] as const;

const DIALOGUE_BEATS = [
  "Vamos mais fundo. A luz da entrada já ficou para trás, e cada passo faz o mundo lá fora parecer mais distante.",
  "Desde crianças, elas vivem presas nesta posição. Não conseguem virar o corpo nem a cabeça: a parede é a única vista que conhecem.",
  "Logo adiante veremos o que ocupa todos os seus dias: uma parede iluminada e as sombras que atravessam sua superfície. Venha devagar. Primeiro, quero que enxergue este lugar como elas enxergam.",
] as const;

type DialogueBeat = 0 | 1 | 2;

const PLATO_BY_BEAT = [
  "deeper-entrance-fades",
  "prisoners-empathy",
  "first-wall-reveal",
] as const satisfies readonly PlatoPoseKey[];

const NEXT_BEAT: Record<DialogueBeat, DialogueBeat> = {
  0: 1,
  1: 2,
  2: 2,
};

export function CavePrisonerWallScene() {
  const [dialogueIndex, setDialogueIndex] = useState<DialogueBeat>(0);
  const [furthestDialogueIndex, setFurthestDialogueIndex] =
    useState<DialogueBeat>(0);
  const isLastBeat = dialogueIndex === DIALOGUE_BEATS.length - 1;
  const finalActionRef = useRef<HTMLAnchorElement>(null);
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 560,
  });

  useEffect(() => {
    if (isLastBeat) {
      finalActionRef.current?.focus();
    }
  }, [isLastBeat]);

  function selectDialogueBeat(nextBeat: DialogueBeat) {
    setDialogueIndex(nextBeat);
    setFurthestDialogueIndex((furthest) =>
      Math.max(furthest, nextBeat) as DialogueBeat,
    );
  }

  function continueStory() {
    selectDialogueBeat(NEXT_BEAT[dialogueIndex]);
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      onBack={
        dialogueIndex > 0
          ? () => selectDialogueBeat((dialogueIndex - 1) as DialogueBeat)
          : undefined
      }
      currentBeat={3}
      totalBeats={10}
      labelledBy="descent-journey-title"
      phase={phase}
      onAnimationEnd={completeExit}
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "so-a-parede",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooStoryPathStage
        eyebrow={getAsSombrasChapterLabel("so-a-parede")}
        title={SCENE_TITLE}
        titleId="descent-journey-title"
        context="Siga Platão até a parede"
        steps={STORY_PATH_STEPS}
        currentStep={dialogueIndex}
        furthestStep={furthestDialogueIndex}
        onStepSelect={(step) => selectDialogueBeat(step as DialogueBeat)}
        transitionKey={dialogueIndex}
        showPath={false}
        guide={
          <PlatoGuide
            pose={PLATO_BY_BEAT[dialogueIndex]}
            stageBeat={dialogueIndex}
            priority
          />
        }
        speaker="Platão"
        action={
          isLastBeat ? (
            <Link
              ref={finalActionRef}
              href={NEXT_SCENE}
              onClick={beginNavigation}
              aria-disabled={phase === "leaving"}
            >
              Chegar mais perto
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
        <p className={styles.beatCopy} key={dialogueIndex}>
          {DIALOGUE_BEATS[dialogueIndex]}
        </p>
      </PhilooStoryPathStage>
    </PhilooStoryShell>
  );
}
