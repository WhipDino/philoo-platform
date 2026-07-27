"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

        <div
          className={styles.chapterProgress}
          role="img"
          aria-label="Capítulo 1 de 3"
        >
          <span data-current="true" />
          <span />
          <span />
        </div>
      </header>

      <section
        className={styles.storyScene}
        aria-labelledby="cave-descent-title"
      >
        <div className={styles.caveBackdrop} aria-hidden="true" />
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
          <p className={styles.chapterLabel}>
            Capítulo 1 · A descida
          </p>
          <h1 id="cave-descent-title">
            Eles nunca olharam para trás.
          </h1>
          <p className={styles.lead}>
            Desde crianças, essas pessoas enxergam apenas a parede à
            frente. Não conhecem outro caminho, outra luz, outro mundo.
          </p>
          <p className={styles.reassurance}>
            Não lhes falta inteligência. Falta-lhes uma perspectiva que
            nunca puderam experimentar.
          </p>

          {isPausedForReview ? (
            <div className={styles.reviewPause} role="status">
              <strong>A próxima parte começa na parede.</strong>
              <span>
                Paramos aqui para você observar esta cena antes de
                continuar.
              </span>
            </div>
          ) : (
            <button
              className={styles.primaryAction}
              type="button"
              onClick={() => setIsPausedForReview(true)}
            >
              Chegar mais perto
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
