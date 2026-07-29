"use client";

import { HandTapIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-doxa-scene.module.css";

const DOXA_BEATS = [
  {
    title: "Uma palavra da filosofia",
    copy: "Dóxa é uma opinião ou crença formada a partir de como algo aparece para nós.",
  },
] as const;

export function CaveDoxaScene() {
  const [revealed, setRevealed] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  function toggleFrame() {
    setRevealed((current) => {
      if (!current) {
        setHasRevealed(true);
      }

      return !current;
    });
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/caminho-da-sombra"
      currentBeat={8}
      totalBeats={10}
      labelledBy="doxa-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "doxa",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow="Cena 8 · Palavra da filosofia"
        title="Dóxa"
        titleId="doxa-title"
        context="δόξα · quando uma aparência vira uma crença"
      >
        <section className={styles.scene} aria-labelledby="doxa-title">
          <div className={styles.conceptColumn}>
            <article className={styles.definition}>
              <header className={styles.wordHeader}>
                <p className={styles.greek} lang="grc">
                  δόξα
                </p>
                <span>substantivo · filosofia</span>
              </header>

              <div className={styles.definitionCopy}>
                <p className={styles.beatLabel}>{DOXA_BEATS[0].title}</p>
                <p>{DOXA_BEATS[0].copy}</p>
              </div>
            </article>

            <aside className={styles.caveNote}>
              <PlatoGuide
                className={styles.plato}
                pose="doxa"
                stageBeat={revealed ? 1 : 0}
                sizes="(max-width: 620px) 138px, (max-width: 900px) 180px, 250px"
                priority
              />
              <div>
                <p className={styles.beatLabel}>
                  {revealed ? "Platão liga as pistas" : "Antes de abrir"}
                </p>
                {revealed ? (
                  <p>
                    Você não inventou a disputa: formou uma ideia com a parte
                    que conseguiu ver. Os prisioneiros faziam o mesmo com as
                    sombras — transformavam uma pista incompleta em uma crença
                    sobre o mundo.
                  </p>
                ) : (
                  <p>
                    Olhe primeiro para o recorte. O que parece estar acontecendo
                    entre as duas crianças?
                  </p>
                )}
              </div>
            </aside>
          </div>

          <article
            className={styles.modernExample}
            data-revealed={revealed ? "true" : "false"}
            aria-labelledby="modern-example-title"
          >
            <header className={styles.exampleHeader}>
              <div>
                <p className={styles.kicker}>Um exemplo de hoje</p>
                <h2 id="modern-example-title">
                  O que este recorte faz você imaginar?
                </h2>
              </div>
              <span aria-hidden="true">quadro parcial</span>
            </header>

            <button
              type="button"
              className={styles.frameControl}
              aria-expanded={revealed}
              aria-controls="doxa-frame-reveal"
              aria-label={
                revealed
                  ? "Voltar ao recorte"
                  : "Ver o que ficou fora do recorte"
              }
              onClick={toggleFrame}
            >
              <span className={styles.imageMat}>
                <Image
                  className={styles.eventImage}
                  src="/images/story/cave-cropped-event-v1.webp"
                  alt={
                    revealed
                      ? "Um instante de um acontecimento entre duas crianças segurando o mesmo giz de cera sobre um desenho"
                      : "Um instante de um acontecimento entre duas crianças, visto por um recorte estreito"
                  }
                  width={1600}
                  height={900}
                  sizes="(max-width: 720px) calc(100vw - 56px), (max-width: 1180px) 58vw, 640px"
                  loading="eager"
                />
                <span className={styles.cropCorners} aria-hidden="true" />
                {!hasRevealed ? (
                  <span
                    className={styles.tapCue}
                    data-doxa-tap-cue
                    aria-hidden="true"
                  >
                    <span className={styles.tapRipple} />
                    <HandTapIcon weight="fill" />
                  </span>
                ) : null}
              </span>
              <span className={styles.controlLabel}>
                <span aria-hidden="true" className={styles.controlGlyph}>
                  {revealed ? "↙" : "↗"}
                </span>
                <span>
                  <strong>
                    {revealed ? "Voltar ao recorte" : "Ver o que ficou fora"}
                  </strong>
                  <small>
                    {revealed
                      ? "Compare de novo"
                      : "Abra o enquadramento, sem trocar a imagem"}
                  </small>
                </span>
              </span>
            </button>

            {revealed ? (
              <div
                id="doxa-frame-reveal"
                className={styles.revealNote}
                role="status"
              >
                <div>
                  <p className={styles.beatLabel}>O quadro inteiro</p>
                  <strong>
                    No recorte, parecia que as crianças disputavam o giz. Ao
                    abrir o quadro, vemos que uma estava entregando o giz à
                    outra.
                  </strong>
                </div>
                <Link href="/aula/as-sombras/o-que-chegou-ate-eles">
                  Testar essa diferença <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <p className={styles.openPrompt}>
                Observe o recorte e toque na imagem para descobrir o que ficou
                de fora.
              </p>
            )}
          </article>
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
