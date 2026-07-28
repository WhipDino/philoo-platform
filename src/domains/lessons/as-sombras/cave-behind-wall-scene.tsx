"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-behind-wall-scene.module.css";

type RevealProgress = 0 | 1 | 2 | 3;

const REVEALS = [
  {
    step: 1,
    id: "fire",
    control: "Revelar a luz",
    copy: "Uma fogueira permanece acesa atrás dos prisioneiros.",
  },
  {
    step: 2,
    id: "objects",
    control: "Revelar os objetos",
    copy:
      "Entre a fogueira e a parede, pessoas carregam objetos pelo caminho.",
  },
  {
    step: 3,
    id: "effect",
    control: "Revelar o efeito",
    copy:
      "A parede recebe as sombras desses objetos: é esse efeito que os prisioneiros veem.",
  },
] as const;

export function CaveBehindWallScene() {
  const [progress, setProgress] = useState<RevealProgress>(0);

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/jogo-da-parede"
      currentBeat={6}
      totalBeats={10}
      labelledBy="behind-wall-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "o-que-existe-atras",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow="Cena 6 · O outro lado"
        title="O que existe atrás?"
        titleId="behind-wall-title"
        context="Revele cada parte do mecanismo na ordem em que ela age."
        currentMoment={progress}
        totalMoments={3}
        action={
          progress === 3 ? (
            <Link href="/aula/as-sombras/caminho-da-sombra">
              Montar o caminho <span aria-hidden="true">→</span>
            </Link>
          ) : undefined
        }
        footerLabel="O mecanismo está completo"
      >
        <section
          className={styles.scene}
          aria-labelledby="behind-wall-title"
          data-progress={progress}
        >
          <div className={styles.exhibit}>
            <figure className={styles.evidence}>
              <Image
                className={styles.evidenceImage}
                src="/images/story/cave-behind-wall-layers-v1.webp"
                alt="Vista lateral da caverna com uma fogueira, uma pessoa carregando uma ânfora, os prisioneiros e a sombra projetada na parede"
                width={1600}
                height={900}
                sizes="(max-width: 700px) calc(100vw - 58px), (max-width: 1180px) 66vw, 820px"
                priority
              />

              {REVEALS.map((reveal) => (
                <span
                  key={reveal.id}
                  className={styles.highlight}
                  data-reveal-layer={reveal.id}
                  data-visible={progress >= reveal.step ? "true" : "false"}
                  aria-hidden="true"
                >
                  <span>{reveal.step}</span>
                </span>
              ))}

              <figcaption>Vista lateral · evidência completa</figcaption>
            </figure>

            <aside className={styles.revealPanel}>
              <div className={styles.guideBrief}>
                <PlatoGuide
                  className={styles.plato}
                  pose="reveal-behind"
                  stageBeat={progress}
                  sizes="(max-width: 700px) 96px, 140px"
                  priority
                />
                <p>
                  <strong>Eles não conseguem ver isto.</strong>
                  <span>
                    Olhe por trás deles e revele uma parte de cada vez.
                  </span>
                </p>
              </div>

              <ol
                className={styles.revealNotes}
                aria-label="Partes reveladas do mecanismo"
                aria-live="polite"
              >
                {REVEALS.map((reveal) =>
                  progress >= reveal.step ? (
                    <li key={reveal.id} data-note={reveal.id}>
                      <span aria-hidden="true">{reveal.step}</span>
                      <p>{reveal.copy}</p>
                    </li>
                  ) : null,
                )}
              </ol>

              <div
                className={styles.controls}
                role="group"
                aria-label="Controles da revelação"
              >
                {REVEALS.map((reveal) => {
                  const isRevealed = progress >= reveal.step;
                  const isAvailable = progress === reveal.step - 1;

                  return (
                    <button
                      key={reveal.id}
                      type="button"
                      className={styles.revealControl}
                      data-state={
                        isRevealed
                          ? "revealed"
                          : isAvailable
                            ? "available"
                            : "waiting"
                      }
                      aria-label={reveal.control}
                      aria-pressed={isRevealed}
                      disabled={!isAvailable}
                      onClick={() =>
                        setProgress(reveal.step as RevealProgress)
                      }
                    >
                      <span className={styles.controlNumber} aria-hidden="true">
                        {reveal.step}
                      </span>
                      <span>{reveal.control}</span>
                      <small aria-hidden="true">
                        {isRevealed
                          ? "Visto"
                          : isAvailable
                            ? "Agora"
                            : "Depois"}
                      </small>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
