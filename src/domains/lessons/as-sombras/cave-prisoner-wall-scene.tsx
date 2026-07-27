"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStorySceneTransition } from "../use-story-scene-transition";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-prisoner-wall-scene.module.css";

const NEXT_SCENE = "/aula/as-sombras/eles-dao-nomes";

const DIALOGUE_BEATS = [
  "Vamos mais fundo. A luz da entrada já ficou para trás, e cada passo faz o mundo lá fora parecer mais distante.",
  "É aqui embaixo que vivem as pessoas de quem falei. Elas estão aqui desde crianças e cresceram sem poder virar o corpo ou a cabeça.",
  "Logo adiante veremos o que ocupa todos os seus dias: uma parede iluminada e as sombras que atravessam sua superfície. Venha devagar. Primeiro, quero que enxergue este lugar como elas enxergam.",
] as const;

export function CavePrisonerWallScene() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const isLastBeat = dialogueIndex === DIALOGUE_BEATS.length - 1;
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 560,
  });

  function continueStory() {
    setDialogueIndex((current) =>
      Math.min(current + 1, DIALOGUE_BEATS.length - 1),
    );
  }

  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.back} href="/aula/as-sombras/a-descida">
          <span aria-hidden="true">←</span>
          <span>Voltar</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <CaveStoryProgress currentBeat={3} totalBeats={10} />
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="descent-journey-title"
        data-phase={phase}
        onAnimationEnd={completeExit}
      >
        <h1 id="descent-journey-title" className={styles.srOnly}>
          Mais fundo na caverna
        </h1>

        <div
          className={styles.journeyArtwork}
          role="img"
          aria-label="Platão desce por uma passagem de pedra, olha para você e estende a mão enquanto três pessoas aparecem ao longe"
        >
          <Image
            className={styles.desktopArtwork}
            src="/images/story/cave-descent-journey-v1.webp"
            alt=""
            fill
            sizes="(max-width: 620px) 1px, 100vw"
            priority
          />
          <Image
            className={styles.mobileArtwork}
            src="/images/story/cave-descent-journey-mobile-v2.webp"
            alt=""
            fill
            sizes="(max-width: 620px) 100vw, 1px"
            priority
          />
        </div>

        <div className={styles.cinematicShade} aria-hidden="true" />
        <div className={styles.transitionVeil} aria-hidden="true" />

        <div className={styles.dialogueCluster}>
          <p className={styles.sceneLabel}>Cena 3 · Mais fundo</p>

          <div
            className={styles.speechBubble}
            key={dialogueIndex}
            role="status"
            aria-live="polite"
          >
            <p className={styles.speaker}>Platão</p>
            <p className={styles.dialogue}>
              “{DIALOGUE_BEATS[dialogueIndex]}”
            </p>

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
                  Chegar mais perto
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
