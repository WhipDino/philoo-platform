"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorySceneTransition } from "../use-story-scene-transition";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-prisoner-wall-scene.module.css";

const NEXT_SCENE = "/aula/as-sombras/eles-dao-nomes";

export function CavePrisonerWallScene() {
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 520,
  });

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
        aria-labelledby="prisoner-wall-title"
        data-phase={phase}
        onAnimationEnd={completeExit}
      >
        <div className={styles.prisonerCave} aria-hidden="true" />
        <div className={styles.caveShade} aria-hidden="true" />
        <div className={styles.wallLight} aria-hidden="true" />
        <div className={styles.transitionVeil} aria-hidden="true" />

        <div className={styles.guide}>
          <Image
            src="/images/story/plato-descent-v1.png"
            alt="Platão observa a parede junto de você"
            width={1018}
            height={1544}
            sizes="(max-width: 700px) 112px, 160px"
            priority
          />
        </div>

        <div className={styles.narrationDeck}>
          <div className={styles.deckHeading}>
            <p>Cena 3 · Diante da parede</p>
            <h1 id="prisoner-wall-title">
              Esta é a única vista que conhecem.
            </h1>
          </div>
          <div className={styles.narration}>
            <p>
              Chegamos. As pessoas de quem falei estão presas, lado a lado,
              sempre voltadas para a mesma parede.
            </p>
            <p>
              Desde crianças, elas veem apenas o que aparece diante delas.
              Para elas, este é o mundo inteiro.
            </p>
          </div>
          <Link
            className={styles.primaryAction}
            href={NEXT_SCENE}
            onClick={beginNavigation}
            aria-disabled={phase === "leaving"}
          >
            Olhar com elas
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
