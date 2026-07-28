"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PhilooFolioStage,
  PhilooFolioVoice,
} from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import { AS_SOMBRAS_JOURNEY_STAGES } from "./as-sombras-journey";
import styles from "./cave-shadow-game-scene.module.css";

const ROUNDS = [
  { id: "bird", label: "Pássaro", choices: ["Pássaro", "Cavalo", "Ânfora"] },
  { id: "amphora", label: "Ânfora", choices: ["Ânfora", "Pássaro", "Cavalo"] },
  { id: "horse", label: "Cavalo", choices: ["Cavalo", "Ânfora", "Pássaro"] },
] as const;

const SHADOW_ALT = {
  bird: "Sombra de um pássaro na parede",
  amphora: "Sombra de uma ânfora na parede",
  horse: "Sombra de um cavalo na parede",
} as const;

type MissedChoice = {
  choice: string;
  attempt: number;
};

export function CaveShadowGameScene() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [missedChoice, setMissedChoice] = useState<MissedChoice | null>(null);
  const isComplete = roundIndex === ROUNDS.length;
  const round = ROUNDS[Math.min(roundIndex, ROUNDS.length - 1)];

  function chooseShadow(choice: string) {
    if (choice !== round.label) {
      setMissedChoice((current) => ({
        choice,
        attempt: (current?.attempt ?? 0) + 1,
      }));
      return;
    }

    setMissedChoice(null);
    setRoundIndex((current) => current + 1);
  }

  return (
    <PhilooStoryShell
      backHref="/aula/as-sombras/eles-dao-nomes"
      currentBeat={5}
      totalBeats={10}
      labelledBy="shadow-game-title"
      phase="idle"
      surfaceWidth="narrative"
      surfaceTreatment="folio"
      showSoftFrame={false}
      journey={{
        lessonTitle: "As Sombras",
        currentSceneId: "jogo-da-parede",
        stages: AS_SOMBRAS_JOURNEY_STAGES,
        storageKey: "philoo:journey:as-sombras",
      }}
    >
      <PhilooFolioStage
        eyebrow="Cena 5 · O jogo da parede"
        title="Jogue como eles"
        titleId="shadow-game-title"
        context="Reconheça as sombras usando apenas o que aparece na parede."
        action={
          isComplete ? (
            <Link href="/aula/as-sombras/o-que-existe-atras">
              Olhar para trás <span aria-hidden="true">→</span>
            </Link>
          ) : undefined
        }
        footerLabel={isComplete ? "A parede já não explica tudo" : undefined}
      >
        <section
          className={styles.game}
          data-game-state={isComplete ? "complete" : "playing"}
        >
          <div className={styles.playArea}>
            <div className={styles.roundLabel} aria-live="polite">
              <span aria-hidden="true">A parede mostra</span>
              <strong>
                {isComplete ? "As três sombras" : `Sombra: ${round.label}`}
              </strong>
            </div>

            <figure
              className={styles.shadowStage}
              data-shadow={isComplete ? "all" : round.id}
            >
              <Image
                className={styles.shadowPanel}
                src="/images/story/cave-shadow-recognition-set-v1.webp"
                alt={
                  isComplete
                    ? "Sombras de um pássaro, uma ânfora e um cavalo na parede"
                    : SHADOW_ALT[round.id]
                }
                width={1600}
                height={900}
                sizes="(max-width: 720px) calc(100vw - 56px), (max-width: 1180px) 66vw, 720px"
                priority
              />
              {!isComplete ? (
                <span
                  className={styles.shadowFocus}
                  data-shadow-focus={round.id}
                  aria-hidden="true"
                />
              ) : null}
              <figcaption>
                {isComplete
                  ? "Você reconheceu cada aparência."
                  : "Que nome os prisioneiros dariam a esta sombra?"}
              </figcaption>
            </figure>

            {!isComplete ? (
              <div
                className={styles.nameStones}
                role="group"
                aria-label="Escolha o nome da sombra"
              >
                {round.choices.map((choice) => {
                  const isMissed = missedChoice?.choice === choice;

                  return (
                    <button
                      key={`${round.id}-${choice}-${isMissed ? missedChoice.attempt : 0}`}
                      type="button"
                      className={styles.nameStone}
                      data-retry={isMissed ? "true" : "false"}
                      onClick={() => chooseShadow(choice)}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className={styles.guideArea}>
            <PlatoGuide
              className={styles.plato}
              pose={isComplete ? "curious-interruption" : "shadow-celebration"}
              stageBeat={isComplete ? ROUNDS.length : roundIndex}
              sizes="(max-width: 720px) 116px, (max-width: 980px) 150px, 240px"
              priority
            />
            <PhilooFolioVoice speaker="Platão" className={styles.voice}>
              {isComplete ? (
                <p className={styles.finalQuestion}>
                  <strong>Você aprendeu o jogo da parede.</strong>
                  <span>Mas isso significa que sabe o que a produziu?</span>
                </p>
              ) : missedChoice ? (
                <p>
                  Quase — olhe mais uma vez para o contorno. A sombra espera
                  por outro nome.
                </p>
              ) : (
                <p>
                  Dê à sombra o nome que os prisioneiros aprenderam a
                  reconhecer.
                </p>
              )}
            </PhilooFolioVoice>
          </div>
        </section>
      </PhilooFolioStage>
    </PhilooStoryShell>
  );
}
