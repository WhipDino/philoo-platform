"use client";

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
  {
    title: "Na caverna",
    copy: "Os prisioneiros não estão fingindo. Eles organizam o pouco que conseguem perceber.",
  },
  {
    title: "Fora da caverna",
    copy: "Uma imagem pode ser verdadeira e ainda assim deixar algo importante fora do quadro.",
  },
] as const;

export function CaveDoxaScene() {
  const [revealed, setRevealed] = useState(false);

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
                sizes="(max-width: 620px) 96px, (max-width: 900px) 130px, 190px"
                priority
              />
              <div>
                <p className={styles.beatLabel}>{DOXA_BEATS[1].title}</p>
                <p>{DOXA_BEATS[1].copy}</p>
                <span>Platão nos ajuda a separar aparência e invenção.</span>
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
              onClick={() => setRevealed((current) => !current)}
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
                  <p className={styles.beatLabel}>{DOXA_BEATS[2].title}</p>
                  <strong>
                    Uma imagem pode ser verdadeira e ainda assim incompleta.
                  </strong>
                  <p>{DOXA_BEATS[2].copy}</p>
                  <p>
                    O quadro mostrava só uma parte do acontecimento. Ver mais
                    não apaga o primeiro olhar — ajuda a revisá-lo.
                  </p>
                </div>
                <Link href="/aula/as-sombras/o-que-chegou-ate-eles">
                  Testar essa diferença <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <p className={styles.openPrompt}>
                Não há resposta para acertar: observe a impressão que o recorte
                produz.
              </p>
            )}
          </article>
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
