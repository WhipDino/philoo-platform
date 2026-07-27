"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PhilooDialogueCard } from "../philoo-dialogue-card";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import type { PlatoPoseKey } from "../plato-pose-catalog";
import { useStorySceneTransition } from "../use-story-scene-transition";
import styles from "./cave-soft-story-layout.module.css";

const NEXT_SCENE = "/aula/as-sombras/o-que-chegou-ate-eles";

const DIALOGUE_BEATS = [
  {
    speaker: "Platão",
    kind: "plato",
    text: "Agora, olhe com elas. Tudo o que conseguem ver acontece nesta parede.",
  },
  {
    speaker: "Prisioneiro",
    kind: "prisoner",
    text: "Um pássaro! Eu reconheci primeiro!",
  },
  {
    speaker: "Platão",
    kind: "plato",
    text: "Aqui, quem reconhece as sombras mais depressa parece ser o mais sábio.",
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
      currentBeat={4}
      totalBeats={10}
      labelledBy="shadow-names-title"
      phase={phase}
      onAnimationEnd={completeExit}
    >
      <div className={styles.storyLayout} data-character-side="left">
        <h1 id="shadow-names-title" className={styles.srOnly}>
          O mundo na parede
        </h1>

        <div className={styles.wallWhisper} aria-hidden="true" />
        <svg
          className={styles.shadowMotif}
          viewBox="0 0 700 420"
          aria-hidden="true"
        >
          <path d="M82 112c42-48 81-46 124 0 43-46 82-48 124 0-36-17-70-18-103-5l-21 44-21-44c-33-13-67-12-103 5Z" />
          <path d="M340 165h74l19 29-18 76c-3 19-16 30-38 30s-35-11-38-30l-18-76 19-29Zm17-31h40l9 31h-58l9-31Z" />
          <ellipse cx="548" cy="222" rx="73" ry="45" />
          <circle cx="610" cy="181" r="27" />
          <path d="M594 176 626 137l15 52ZM503 250h20v89h-20zm67 0h20v89h-20z" />
        </svg>

        <div className={styles.guideSlot}>
          <PlatoGuide
            pose={PLATO_BY_BEAT[dialogueIndex]}
            stageBeat={dialogueIndex}
            priority
          />
        </div>

        <div className={styles.dialogueSlot}>
          <PhilooDialogueCard
            sceneLabel="Cena 4 · O mundo na parede"
            speaker={dialogueBeat.speaker}
            currentBeat={dialogueIndex + 1}
            totalBeats={DIALOGUE_BEATS.length}
            tone={dialogueBeat.kind === "prisoner" ? "activity" : "dialogue"}
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
                <button
                  type="button"
                  onClick={continueStory}
                >
                  Continuar
                  <span className={styles.actionArrow} aria-hidden="true">
                    →
                  </span>
                </button>
              )
            }
          >
            <p className={styles.beatCopy} key={dialogueIndex}>
              {dialogueBeat.text}
            </p>
          </PhilooDialogueCard>
        </div>
      </div>
    </PhilooStoryShell>
  );
}
