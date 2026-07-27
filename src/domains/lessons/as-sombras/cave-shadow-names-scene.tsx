"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStorySceneTransition } from "../use-story-scene-transition";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-shadow-names-scene.module.css";

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

export function CaveShadowNamesScene() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const isLastBeat = dialogueIndex === DIALOGUE_BEATS.length - 1;
  const dialogueBeat = DIALOGUE_BEATS[dialogueIndex];
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 520,
  });

  function continueStory() {
    setDialogueIndex((current) =>
      Math.min(current + 1, DIALOGUE_BEATS.length - 1),
    );
  }

  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.back} href="/aula/as-sombras/so-a-parede">
          <span aria-hidden="true">←</span>
          <span>Voltar</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <CaveStoryProgress currentBeat={4} totalBeats={10} />
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="shadow-names-title"
        data-phase={phase}
        onAnimationEnd={completeExit}
      >
        <h1 id="shadow-names-title" className={styles.srOnly}>
          O mundo na parede
        </h1>

        <div
          className={styles.storyArtwork}
          role="img"
          aria-label="Platão e três prisioneiros observam as sombras de um pássaro, uma ânfora e um cavalo na parede da caverna"
        >
          <Image
            className={styles.desktopArtwork}
            src="/images/story/cave-shadow-game-v1.webp"
            alt=""
            fill
            sizes="(max-width: 900px) 1px, 100vw"
            priority
          />
          <Image
            className={styles.mobileArtwork}
            src="/images/story/cave-shadow-game-mobile-v1.webp"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 1px"
            priority
          />
        </div>

        <div className={styles.cinematicShade} aria-hidden="true" />
        <div className={styles.transitionVeil} aria-hidden="true" />

        <div className={styles.dialogueCluster}>
          <p className={styles.sceneLabel}>Cena 4 · O mundo na parede</p>

          <div
            className={styles.speechBubble}
            data-speaker={dialogueBeat.kind}
            role="status"
            aria-live="polite"
          >
            <div className={styles.dialogueContent} key={dialogueIndex}>
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              <p className={styles.speaker}>{dialogueBeat.speaker}</p>
              <p className={styles.dialogue}>{dialogueBeat.text}</p>
            </div>

            <div className={styles.dialogueFooter}>
              <div
                className={styles.beatProgress}
                aria-label={`Fala ${dialogueIndex + 1} de ${DIALOGUE_BEATS.length}`}
              >
                {DIALOGUE_BEATS.map((_, index) => (
                  <span
                    key={index}
                    data-active={index === dialogueIndex}
                    data-complete={index < dialogueIndex}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {isLastBeat ? (
                <Link
                  className={styles.primaryAction}
                  href={NEXT_SCENE}
                  onClick={beginNavigation}
                  aria-disabled={phase === "leaving"}
                >
                  Observar as sombras
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <button
                  className={styles.continueAction}
                  type="button"
                  onClick={continueStory}
                >
                  Continuar
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
