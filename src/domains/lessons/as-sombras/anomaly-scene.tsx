"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./as-sombras.module.css";

export type AnomalyClueId = "forma" | "som" | "tempo" | "repeticao";

export interface AnomalySceneProps {
  readonly firstClueId?: AnomalyClueId;
  readonly anomalyNoticed?: boolean;
  readonly onAnomalyNoticed: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly onFirstClue: (
    clueId: AnomalyClueId,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: (
    clueId: AnomalyClueId,
  ) => void | boolean | Promise<void | boolean>;
  readonly isBusy?: boolean;
}
const clueChoices = [
  { id: "forma", label: "forma" },
  { id: "som", label: "som" },
  { id: "tempo", label: "tempo" },
  { id: "repeticao", label: "repetição" },
] as const;

function isPromiseLike<T>(
  value: T | Promise<T>,
): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

export function AnomalyScene({
  firstClueId,
  anomalyNoticed = false,
  onAnomalyNoticed,
  onFirstClue,
  onContinue,
  isBusy = false,
}: AnomalySceneProps) {
  const [hasPlayed, setHasPlayed] = useState(anomalyNoticed);
  const [selectedClue, setSelectedClue] = useState<
    AnomalyClueId | undefined
  >(firstClueId);
  const [isPending, setIsPending] = useState(false);

  function play() {
    if (hasPlayed) {
      setHasPlayed(false);
      requestAnimationFrame(() => setHasPlayed(true));
      return;
    }

    const result = onAnomalyNoticed();
    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            setHasPlayed(true);
          }
        })
        .finally(() => setIsPending(false));
      return;
    }
    if (result !== false) {
      setHasPlayed(true);
    }
  }

  function chooseClue(clueId: AnomalyClueId) {
    const result = onFirstClue(clueId);
    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            setSelectedClue(clueId);
          }
        })
        .finally(() => setIsPending(false));
      return;
    }
    if (result !== false) {
      setSelectedClue(clueId);
    }
  }

  return (
    <article className={styles.openingScene}>
      <section
        className={`${styles.wallStage} ${styles.anomalyStage}`}
        aria-labelledby="anomaly-title"
        data-playing={hasPlayed || undefined}
      >
        <div className={styles.stageTitle}>
          <p className={styles.eyebrow}>Ato 3 · previsão interrompida</p>
          <h1 id="anomaly-title" tabIndex={-1}>
            O pássaro impossível
          </h1>
          <p>
            Você conhece o contorno com asas. Desta vez, observe se forma,
            som e duração ainda contam a mesma história.
          </p>
        </div>

        <div className={styles.anomalyPlayback}>
          {hasPlayed ? (
            <>
              <svg
                className={styles.anomalySilhouette}
                viewBox="0 0 620 220"
                role="img"
                aria-label="Silhueta com asas"
              >
                <path d="M122 124c75-88 142-96 188-50 46-46 113-38 188 50-72-30-121-14-188 48-67-62-116-78-188-48Z" />
                <path d="m310 82 18 92h-36l18-92Z" />
              </svg>
              <div className={styles.visibleSoundCues}>
                <span>passos pesados</span>
                <span>voz humana: “mais devagar”</span>
              </div>
            </>
          ) : (
            <p className={styles.playbackPrompt}>
              Faça sua previsão familiar e revele o acontecimento quando
              quiser. Não há cronômetro.
            </p>
          )}

          <div
            className={styles.eventTimeline}
            aria-label="Tempo visível das pistas"
          >
            <span>antes · passos</span>
            <span>durante · silhueta e voz</span>
            <span>depois · passos</span>
          </div>
        </div>

        <button
          className={styles.replayAction}
          type="button"
          onClick={play}
          disabled={isBusy || isPending}
        >
          {hasPlayed ? "Reproduzir novamente" : "Reproduzir acontecimento"}
        </button>

        <aside
          className={styles.staticTranscript}
          role="region"
          aria-label="Transcrição do acontecimento"
        >
          <strong>Transcrição disponível antes da reprodução</strong>
          <p>
            passos pesados começam · o contorno com asas aparece · voz
            humana: “mais devagar” · o contorno termina · passos pesados
            continuam
          </p>
        </aside>
      </section>

      <section className={styles.investigationTray}>
        <div className={styles.trayHeading}>
          <p className={styles.eyebrow}>Escolha sua primeira pista</p>
          <h2>Qual incompatibilidade você quer seguir primeiro?</h2>
          <p>
            Não existe ordem punida. Sua escolha organiza a próxima mesa
            de evidências.
          </p>
        </div>

        <div className={styles.firstClueChoices}>
          {clueChoices.map((clue) => (
            <button
              key={clue.id}
              type="button"
              onClick={() => chooseClue(clue.id)}
              disabled={!hasPlayed || isBusy || isPending}
              aria-pressed={selectedClue === clue.id}
            >
              Investigar primeiro: {clue.label}
            </button>
          ))}
        </div>

        {selectedClue ? (
          <aside className={styles.platoQuestion} aria-live="polite">
            <Image
              className={styles.platoPortrait}
              src="/images/plato/platao-master.webp"
              alt="Platão pensativo entra na investigação"
              width={72}
              height={90}
            />
            <div>
              <p className={styles.eyebrow}>Platão entra depois da pista</p>
              <blockquote>
                O que falhou: o que você percebeu ou a explicação?
              </blockquote>
            </div>
          </aside>
        ) : null}

        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => {
            if (selectedClue) {
              onContinue(selectedClue);
            }
          }}
          disabled={!selectedClue || isBusy || isPending}
        >
          Seguir a incompatibilidade
        </button>
      </section>
    </article>
  );
}
