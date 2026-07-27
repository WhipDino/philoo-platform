"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorySceneTransition } from "../use-story-scene-transition";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-shadow-names-scene.module.css";

const NEXT_SCENE = "/aula/as-sombras/o-que-chegou-ate-eles";

export function CaveShadowNamesScene() {
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: NEXT_SCENE,
    durationMs: 520,
  });

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
        <div className={styles.shadowWall} aria-hidden="true" />
        <div className={styles.caveShade} aria-hidden="true" />
        <div className={styles.transitionVeil} aria-hidden="true" />

        <div className={styles.storyCopy}>
          <p className={styles.sceneLabel}>Cena 4 · As sombras ganham nomes</p>
          <h1 id="shadow-names-title">
            As formas voltam.
            <span>E elas aprendem a reconhecê-las.</span>
          </h1>
          <p>
            Dia após dia, certos contornos atravessam a parede. Sem conhecer
            o que existe atrás delas, as pessoas dão nomes ao que veem e
            tentam prever o que aparecerá depois.
          </p>
        </div>

        <div className={styles.shadowNames} aria-label="Nomes dados às sombras">
          <span className={styles.birdName}>“pássaro”</span>
          <span className={styles.amphoraName}>“ânfora”</span>
          <span className={styles.horseName}>“cavalo”</span>
        </div>

        <div className={styles.guideRail}>
          <div className={styles.plato}>
            <Image
              src="/images/story/plato-descent-v1.png"
              alt="Platão chama sua atenção para a diferença entre a sombra e sua origem"
              width={1018}
              height={1544}
              sizes="(max-width: 700px) 94px, 132px"
              priority
            />
          </div>
          <div className={styles.guideWords}>
            <p>Platão observa com você</p>
            <strong>
              Dar nomes organiza o mundo. Mas o nome revela a origem da
              sombra — ou apenas o que parece estar na parede?
            </strong>
          </div>
          <Link
            className={styles.primaryAction}
            href={NEXT_SCENE}
            onClick={beginNavigation}
            aria-disabled={phase === "leaving"}
          >
            Separar as pistas
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
