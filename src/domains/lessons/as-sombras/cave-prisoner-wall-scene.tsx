"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStorySceneTransition } from "../use-story-scene-transition";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-prisoner-wall-scene.module.css";

const NEXT_SCENE = "/aula/as-sombras/eles-dao-nomes";

const DIALOGUE_BEATS = [
  "Vamos mais fundo. A luz da entrada já ficou para trás, e cada passo faz o mundo lá fora parecer mais distante.",
  "É aqui embaixo que vivem as pessoas de quem falei. Elas estão aqui desde crianças e cresceram sem poder virar o corpo ou a cabeça.",
  "Logo adiante veremos o que ocupa todos os seus dias: uma parede iluminada e as sombras que atravessam sua superfície. Venha devagar. Primeiro, quero que enxergue este lugar como elas enxergam.",
] as const;

type DialogueBeat = 0 | 1 | 2;

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

        <div className={styles.transitionVeil} aria-hidden="true" />

        <div className={styles.conversationLayout}>
          <div className={styles.dialogueCluster}>
            <p className={styles.sceneLabel}>Cena 3 · Mais fundo</p>

            <div
              className={styles.speechBubble}
              role="status"
              aria-live="polite"
            >
              <div className={styles.dialogueContent} key={dialogueIndex}>
                <span className={styles.quoteMark} aria-hidden="true">
                  “
                </span>
                <p className={styles.speaker}>Platão</p>
                <p className={styles.dialogue}>{DIALOGUE_BEATS[dialogueIndex]}</p>
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
                    ref={finalActionRef}
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

          <div className={styles.platoVisual}>
            <Image
              className={styles.plato}
              src="/images/story/plato-explaining-v1.png"
              alt="Platão conversa com você enquanto explica a história"
              width={1024}
              height={1536}
              sizes="(max-width: 620px) 230px, (max-width: 900px) 34vw, 390px"
              data-stage-beat={dialogueIndex}
              priority
            />
          </div>
        </div>
      </section>
    </main>
  );
}
