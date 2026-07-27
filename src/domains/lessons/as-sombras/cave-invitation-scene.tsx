"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorySceneTransition } from "../use-story-scene-transition";
import {
  CAVE_STORY_BEATS,
  CAVE_STORY_TOTAL_BEATS,
} from "./cave-story-beats";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-invitation-scene.module.css";

export function CaveInvitationScene() {
  const beat = CAVE_STORY_BEATS.invitation;
  const { phase, beginNavigation, completeExit } = useStorySceneTransition({
    href: "/aula/as-sombras/a-descida",
    durationMs: 560,
  });

  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.exit} href="/inicio">
          <span aria-hidden="true">←</span>
          <span>Sair</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <CaveStoryProgress
          currentBeat={beat.ordinal}
          totalBeats={CAVE_STORY_TOTAL_BEATS}
        />
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="cave-invitation-title"
        data-phase={phase}
        onAnimationEnd={completeExit}
      >
        <div className={styles.caveBackdrop} aria-hidden="true" />
        <div className={styles.skyGlow} aria-hidden="true" />
        <div className={styles.transitionVeil} aria-hidden="true" />

        <svg
          className={styles.inquiryThread}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M425 468 C610 398 672 530 832 452 C915 412 980 404 1062 423" />
        </svg>

        <div className={styles.plato}>
          <Image
            src="/images/story/plato-welcome-v2.png"
            alt="Platão abre os braços e convida você a entrar na caverna"
            width={1009}
            height={1559}
            sizes="(max-width: 900px) 82vw, 34vw"
            priority
          />
        </div>

        <div className={styles.dialogue}>
          <p className={styles.chapterLabel}>{beat.label}</p>
          <h1 id="cave-invitation-title">{beat.title}</h1>
          <p className={styles.lead}>{beat.story}</p>
          <p className={styles.reassurance}>{beat.guidance}</p>
          <p className={styles.source}>{beat.source}</p>

          <Link
            className={styles.primaryAction}
            href="/aula/as-sombras/a-descida"
            onClick={beginNavigation}
            aria-disabled={phase === "leaving"}
          >
            {beat.action}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
