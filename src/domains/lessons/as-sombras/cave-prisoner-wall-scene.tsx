"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PhilooDialogueCard } from "../philoo-dialogue-card";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { useStorySceneTransition } from "../use-story-scene-transition";
import styles from "./cave-soft-story-layout.module.css";

const NEXT_SCENE = "/aula/as-sombras/eles-dao-nomes";
const SCENE_TITLE = "Mais fundo";

const DIALOGUE_BEATS = [
  "Vamos mais fundo. A luz da entrada já ficou para trás, e cada passo faz o mundo lá fora parecer mais distante.",
  "É aqui embaixo que vivem as pessoas de quem falei. Elas estão aqui desde crianças e cresceram sem poder virar o corpo ou a cabeça.",
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
  const [dialogueIndex, setDialogueIndex] =
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

  function continueStory() {
    setDialogueIndex((current) => NEXT_BEAT[current]);
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/a-descida"
      currentBeat={3}
      totalBeats={10}
      labelledBy="descent-journey-title"
      phase={phase}
      onAnimationEnd={completeExit}
      surfaceWidth="narrative"
      showSoftFrame={false}
    >
      <div className={`${styles.storyLayout} ${styles.storyLayoutWithHeading}`}>
        <h1 id="descent-journey-title" className={styles.sceneHeading}>
          {SCENE_TITLE}
        </h1>

        <div className={styles.dialogueSlot}>
          <PhilooDialogueCard
            speaker="Platão"
            currentBeat={dialogueIndex + 1}
            totalBeats={DIALOGUE_BEATS.length}
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
          </PhilooDialogueCard>
        </div>

        <div className={styles.guideSlot}>
          <PlatoGuide
            pose={PLATO_BY_BEAT[dialogueIndex]}
            stageBeat={dialogueIndex}
            priority
          />
        </div>
      </div>
    </PhilooStoryShell>
  );
}
