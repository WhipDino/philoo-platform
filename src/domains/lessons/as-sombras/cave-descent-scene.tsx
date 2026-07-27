"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CAVE_STORY_BEATS,
  CAVE_STORY_TOTAL_BEATS,
} from "./cave-story-beats";
import { CaveStoryProgress } from "./cave-story-progress";
import styles from "./cave-descent-scene.module.css";

export function CaveDescentScene() {
  const [isPausedForReview, setIsPausedForReview] = useState(false);

  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.topbar}>
        <Link
          className={styles.back}
          href="/aula/as-sombras/primeira-tela"
        >
          <span aria-hidden="true">←</span>
          <span>Voltar</span>
        </Link>

        <div className={styles.lessonName}>
          <strong>Philoo</strong>
          <span aria-hidden="true">·</span>
          <span>As Sombras</span>
        </div>

        <CaveStoryProgress
          currentBeat={CAVE_STORY_BEATS.descent.ordinal}
          totalBeats={CAVE_STORY_TOTAL_BEATS}
        />
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="cave-descent-title"
      >
        <div className={styles.caveBackdrop} aria-hidden="true" />
        <div className={styles.caveVeil} aria-hidden="true" />
        <div className={styles.entranceGlow} aria-hidden="true" />
        <div className={styles.lampGlow} aria-hidden="true" />

        <svg
          className={styles.inquiryThread}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M120 624 C310 692 468 647 620 700 C786 758 929 704 1097 540" />
        </svg>

        <div className={styles.plato}>
          <Image
            src="/images/story/plato-descent-v1.png"
            alt="Platão guia você pela descida segurando uma pequena lamparina"
            width={1018}
            height={1544}
            sizes="(max-width: 900px) 74vw, 31vw"
            priority
          />
        </div>

        <div className={styles.dialogue}>
          <div className={styles.dialogueContent}>
            <p className={styles.chapterLabel}>
              {CAVE_STORY_BEATS.descent.label}
            </p>
            <h1 id="cave-descent-title">{CAVE_STORY_BEATS.descent.title}</h1>
            <p className={styles.lead}>{CAVE_STORY_BEATS.descent.story}</p>
            <p className={styles.reassurance}>
              {CAVE_STORY_BEATS.descent.guidance}
            </p>

            {isPausedForReview ? (
              <div className={styles.reviewPause} role="status">
                <strong>As pessoas estão logo adiante.</strong>
                <span>
                  Paramos aqui para revisar a descida antes de entrar na
                  próxima cena.
                </span>
              </div>
            ) : (
              <button
                className={styles.primaryAction}
                type="button"
                onClick={() => setIsPausedForReview(true)}
              >
                {CAVE_STORY_BEATS.descent.action}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
