"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./cave-invitation-scene.module.css";

export function CaveInvitationScene() {
  const [isPausedForReview, setIsPausedForReview] = useState(false);

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
        aria-labelledby="cave-invitation-title"
      >
        <div className={styles.caveBackdrop} aria-hidden="true" />
        <div className={styles.skyGlow} aria-hidden="true" />
        <div
          className={styles.environmentLight}
          data-scene-depth="cave"
          aria-hidden="true"
        />

        <svg
          className={styles.inquiryThread}
          data-scene-connection="plato-dialogue"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className={styles.desktopThread}
            d="M548 638 C660 616 648 472 806 430"
          />
          <path
            className={styles.mobileThread}
            d="M890 328 C852 350 820 376 780 414"
          />
          <path
            className={styles.smallMobileThread}
            d="M890 328 C852 376 812 430 780 510"
          />
        </svg>

        <div className={styles.plato}>
          <span className={styles.floorContact} aria-hidden="true" />
          <Image
            src="/images/story/plato-welcome-v2.png"
            alt="Platão abre os braços e convida você a entrar na caverna"
            width={1009}
            height={1559}
            sizes="(max-width: 900px) 82vw, 34vw"
            priority
          />
          <span className={styles.platoRelight} aria-hidden="true" />
        </div>

        <div className={styles.caveForeground} aria-hidden="true" />

        <div className={styles.dialogue}>
          <p className={styles.chapterLabel}>Capítulo 1 · Entre comigo</p>
          <h1 id="cave-invitation-title">Venha comigo.</h1>
          <p className={styles.lead}>
            Por alguns minutos, olhe apenas para a parede. Depois me conte:
            o que ela deixa você conhecer?
          </p>
          <p className={styles.reassurance}>
            Não tenha pressa. Aqui, até uma sombra pode guardar uma pergunta.
          </p>

          {isPausedForReview ? (
            <div className={styles.reviewPause} role="status">
              <strong>Paramos aqui por enquanto.</strong>
              <span>
                A próxima cena só nasce depois da sua aprovação.
              </span>
            </div>
          ) : (
            <button
              className={styles.primaryAction}
              type="button"
              onClick={() => setIsPausedForReview(true)}
            >
              Entrar na caverna
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
