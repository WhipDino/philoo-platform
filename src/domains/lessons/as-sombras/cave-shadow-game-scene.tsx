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
  {
    id: "bird",
    label: "Pássaro",
    success: "Você reconheceu o pássaro.",
    choices: ["Pássaro", "Cavalo", "Ânfora"],
  },
  {
    id: "amphora",
    label: "Ânfora",
    success: "Você reconheceu a ânfora.",
    choices: ["Ânfora", "Pássaro", "Cavalo"],
  },
  {
    id: "horse",
    label: "Cavalo",
    success: "Você reconheceu o cavalo.",
    choices: ["Cavalo", "Ânfora", "Pássaro"],
  },
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

type GamePhase = "playing" | "celebrating" | "complete";

export function CaveShadowGameScene() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [missedChoice, setMissedChoice] = useState<MissedChoice | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>("playing");
  const isCelebrating = gamePhase === "celebrating";
  const isComplete = gamePhase === "complete";
  const round = ROUNDS[Math.min(roundIndex, ROUNDS.length - 1)];

  function chooseShadow(choice: string) {
    if (gamePhase !== "playing") {
      return;
    }

    if (choice !== round.label) {
      setMissedChoice((current) => ({
        choice,
        attempt: (current?.attempt ?? 0) + 1,
      }));
      return;
    }

    setMissedChoice(null);
    setGamePhase("celebrating");
  }

  function continueAfterCelebration() {
    if (roundIndex === ROUNDS.length - 1) {
      setGamePhase("complete");
      return;
    }

    setRoundIndex((current) => current + 1);
    setGamePhase("playing");
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
          data-game-state={gamePhase}
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
              data-result={isCelebrating ? "success" : "waiting"}
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
                  : isCelebrating
                    ? `Nome reconhecido: ${round.label}.`
                  : "Que nome os prisioneiros dariam a esta sombra?"}
              </figcaption>
            </figure>

            {isCelebrating ? (
              <div className={styles.successActions}>
                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={continueAfterCelebration}
                >
                  {roundIndex === ROUNDS.length - 1
                    ? "Ouvir a pergunta"
                    : "Próxima sombra"}
                </button>
              </div>
            ) : !isComplete ? (
              <div
                className={styles.nameStones}
                role="group"
                aria-label="Escolha o nome da sombra"
              >
                {round.choices.map((choice) => {
                  const isMissed = missedChoice?.choice === choice;

                  return (
                    <button
                      key={`${round.id}-${choice}`}
                      type="button"
                      className={styles.nameStone}
                      data-retry={
                        isMissed
                          ? missedChoice.attempt % 2 === 0
                            ? "even"
                            : "odd"
                          : "false"
                      }
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
              pose={
                isComplete
                  ? "curious-interruption"
                  : isCelebrating
                    ? "shadow-celebration"
                    : "observe-with-them"
              }
              stageBeat={
                isComplete
                  ? ROUNDS.length * 2
                  : roundIndex * 2 + (isCelebrating ? 1 : 0)
              }
              sizes="(max-width: 720px) 116px, (max-width: 980px) 150px, 240px"
              priority
            />
            <PhilooFolioVoice speaker="Platão" className={styles.voice}>
              {isComplete ? (
                <p className={styles.finalQuestion}>
                  <strong>Você aprendeu o jogo da parede.</strong>
                  <span>Mas isso significa que sabe o que a produziu?</span>
                </p>
              ) : isCelebrating ? (
                <p className={styles.successMessage}>
                  <strong>{round.success}</strong>
                  <span>Os prisioneiros também dariam esse nome.</span>
                </p>
              ) : missedChoice ? (
                <p>
                  Quase — olhe mais uma vez para o contorno. A sombra espera
                  por outro nome.
                </p>
              ) : (
                <p>
                  Olhe com eles e dê à sombra o nome que aprenderam a
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
