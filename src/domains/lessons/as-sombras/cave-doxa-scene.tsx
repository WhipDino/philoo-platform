"use client";

import { HandTapIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-doxa-scene.module.css";

type DoxaMoment = "meaning" | "observe" | "reveal" | "connect";

const MOMENT_NUMBER: Record<DoxaMoment, number> = {
  meaning: 1,
  observe: 2,
  reveal: 3,
  connect: 4,
};

export function CaveDoxaScene() {
  const [moment, setMoment] = useState<DoxaMoment>("meaning");
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (moment !== "meaning") {
      stageHeadingRef.current?.focus();
    }
  }, [moment]);

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
          <div
            className={styles.stage}
            data-doxa-stage
            data-moment={moment}
          >
            <MomentProgress active={MOMENT_NUMBER[moment]} />

            {moment === "meaning" ? (
              <article
                className={`${styles.moment} ${styles.meaningMoment}`}
                data-doxa-moment="meaning"
              >
                <div className={styles.wordArtifact}>
                  <div className={styles.wordHeader}>
                    <p className={styles.greek} lang="grc">
                      δόξα
                    </p>
                    <span>substantivo · filosofia</span>
                  </div>
                  <p className={styles.beatLabel}>Uma palavra da filosofia</p>
                  <h2>Dóxa é uma opinião ou crença</h2>
                  <p className={styles.lead}>
                    Ela é formada a partir de como algo aparece para nós.
                  </p>
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => setMoment("observe")}
                  >
                    Ver um exemplo <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ) : null}

            {moment === "observe" || moment === "reveal" ? (
              <article
                className={`${styles.moment} ${styles.discoveryMoment}`}
                data-doxa-moment={moment}
              >
                <header className={styles.discoveryHeader}>
                  <div>
                    <p className={styles.beatLabel}>
                      {moment === "observe"
                        ? "Primeiro, observe"
                        : "Agora, veja o todo"}
                    </p>
                    <h2 ref={stageHeadingRef} tabIndex={-1}>
                      {moment === "observe"
                        ? "Olhando apenas para este recorte, o que parece estar acontecendo?"
                        : "O quadro completo muda a história"}
                    </h2>
                  </div>
                  <span className={styles.frameBadge}>
                    {moment === "observe" ? "recorte" : "quadro inteiro"}
                  </span>
                </header>

                <button
                  type="button"
                  className={styles.frameControl}
                  aria-label={
                    moment === "observe"
                      ? "Revelar o quadro inteiro"
                      : "Quadro inteiro revelado"
                  }
                  disabled={moment === "reveal"}
                  onClick={() => setMoment("reveal")}
                >
                  <span className={styles.imageMat}>
                    <Image
                      className={styles.eventImage}
                      src="/images/story/cave-cropped-event-v1.webp"
                      alt={
                        moment === "observe"
                          ? "Um instante de um acontecimento entre duas crianças, visto por um recorte estreito"
                          : "Duas crianças sorrindo enquanto uma entrega o giz de cera à outra"
                      }
                      width={1600}
                      height={900}
                      sizes="(max-width: 720px) calc(100vw - 64px), (max-width: 1180px) 72vw, 900px"
                      priority
                    />
                    <span className={styles.cropCorners} aria-hidden="true" />
                    {moment === "observe" ? (
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
                </button>

                {moment === "observe" ? (
                  <p className={styles.observationPrompt}>
                    Não precisa responder. Guarde sua primeira impressão e
                    toque na imagem.
                  </p>
                ) : (
                  <div className={styles.revealExplanation}>
                    <div className={styles.revealNumber} aria-hidden="true">
                      !
                    </div>
                    <p>
                      Talvez tenha parecido que as crianças disputavam o giz.
                      Era uma conclusão possível com a parte que você tinha.
                      Agora vemos que uma criança estava entregando o giz à
                      outra.
                    </p>
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={() => setMoment("connect")}
                    >
                      Entender o que aconteceu{" "}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                )}
              </article>
            ) : null}

            {moment === "connect" ? (
              <article
                className={`${styles.moment} ${styles.connectionMoment}`}
                data-doxa-moment="connect"
              >
                <div className={styles.platoSurface}>
                  <PlatoGuide
                    className={styles.plato}
                    pose="doxa"
                    stageBeat={1}
                    sizes="(max-width: 620px) 210px, (max-width: 900px) 260px, 340px"
                    priority
                  />
                </div>
                <div
                  className={styles.voiceBridge}
                  data-doxa-voice-bridge
                  aria-hidden="true"
                >
                  <span />
                  <span />
                </div>
                <blockquote
                  className={styles.dialogueCard}
                  data-doxa-dialogue-card
                >
                  <span className={styles.dialogueQuote} aria-hidden="true">
                    “
                  </span>
                  <div className={styles.connectionCopy}>
                    <p className={styles.beatLabel}>Platão explica</p>
                    <h2 ref={stageHeadingRef} tabIndex={-1}>
                      Isso é dóxa.
                    </h2>
                    <p>
                      Formamos uma crença usando aquilo que conseguimos
                      perceber. Os prisioneiros faziam o mesmo com as sombras.
                    </p>
                    <p>
                      Eles não estavam inventando: tentavam compreender o mundo
                      usando apenas uma parte dele.
                    </p>
                    <Link
                      className={styles.primaryAction}
                      href="/aula/as-sombras/o-que-chegou-ate-eles"
                    >
                      Continuar a investigação{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </blockquote>
              </article>
            ) : null}
          </div>
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}

function MomentProgress({ active }: { active: number }) {
  return (
    <div className={styles.momentProgress} aria-label={`Momento ${active} de 4`}>
      {[1, 2, 3, 4].map((number) => (
        <span
          key={number}
          data-state={
            number === active
              ? "current"
              : number < active
                ? "complete"
                : "upcoming"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
