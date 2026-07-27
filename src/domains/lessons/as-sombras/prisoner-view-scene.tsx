"use client";

import { useState } from "react";
import styles from "./as-sombras.module.css";

export type ObservationStatementId = "winged_outline" | "bird_claim";
export type ObservationClassification = "percebi" | "conclui";

export interface PrisonerViewSceneProps {
  readonly classifications: Readonly<
    Partial<Record<ObservationStatementId, ObservationClassification>>
  >;
  readonly onClassify: (
    statementId: ObservationStatementId,
    classification: ObservationClassification,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () => void | boolean | Promise<void | boolean>;
  readonly isBusy?: boolean;
}
const statements = [
  {
    id: "winged_outline",
    text: "Um contorno com asas passou.",
  },
  {
    id: "bird_claim",
    text: "Um pássaro passou.",
  },
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

export function PrisonerViewScene({
  classifications,
  onClassify,
  onContinue,
  isBusy = false,
}: PrisonerViewSceneProps) {
  const [answers, setAnswers] = useState({ ...classifications });
  const [senseNote, setSenseNote] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isComplete = statements.every((statement) => answers[statement.id]);

  function classify(
    statementId: ObservationStatementId,
    classification: ObservationClassification,
  ) {
    const result = onClassify(statementId, classification);
    const update = () =>
      setAnswers((current) => ({
        ...current,
        [statementId]: classification,
      }));

    if (isPromiseLike(result)) {
      setIsPending(true);
      void result
        .then((accepted) => {
          if (accepted !== false) {
            update();
          }
        })
        .finally(() => setIsPending(false));
      return;
    }

    if (result !== false) {
      update();
    }
  }

  return (
    <article className={styles.openingScene}>
      <section
        className={`${styles.wallStage} ${styles.prisonerStage}`}
        aria-labelledby="prisoner-view-title"
      >
        <div className={styles.stageWash} aria-hidden="true" />
        <div className={styles.fixedView} aria-hidden="true">
          <svg viewBox="0 0 760 280" role="presentation">
            <path
              className={styles.chain}
              d="M8 230 C130 172 188 264 306 202 S520 158 748 230"
            />
            <g className={styles.wingedSilhouette}>
              <path d="M278 138c44-54 84-62 111-38 27-24 67-16 111 38-42-16-71-8-111 28-40-36-69-44-111-28Z" />
              <path d="m389 112 12 55-24 0 12-55Z" />
            </g>
          </svg>
        </div>
        <div className={styles.stageTitle}>
          <p className={styles.eyebrow}>Ato 1 · ponto de vista fixo</p>
          <h1 id="prisoner-view-title" tabIndex={-1}>
            Só a parede
          </h1>
          <p>
            A comunidade aprendeu a ler recorrências daqui. Agora separe o
            que chega aos sentidos do nome que damos a isso.
          </p>
        </div>
        <div className={styles.senseActions} aria-label="Ações disponíveis">
          <button
            type="button"
            onClick={() =>
              setSenseNote(
                "A luz recorta uma forma escura com duas extensões laterais.",
              )
            }
          >
            Observar
          </button>
          <button
            type="button"
            onClick={() =>
              setSenseNote(
                "Um ruído ritmado chega da passagem, sem mostrar sua fonte.",
              )
            }
          >
            Escutar
          </button>
          <button
            type="button"
            onClick={() =>
              setSenseNote(
                "As correntes limitam o movimento. Você pode testar apenas as pistas que chegam daqui.",
              )
            }
          >
            Tentar olhar para trás
          </button>
        </div>
        <p className={styles.senseNote} aria-live="polite">
          {senseNote}
        </p>
      </section>

      <section className={styles.investigationTray}>
        <div className={styles.trayHeading}>
          <p className={styles.eyebrow}>Caderno da Parede · distinção 01</p>
          <h2>O que foi percebido? O que já foi concluído?</h2>
          <p>
            A Guardiã do Padrão conhece bem essas formas. Classificar não
            diminui esse conhecimento; mostra até onde cada pista alcança.
          </p>
        </div>

        <div className={styles.classificationGrid}>
          {statements.map((statement) => (
            <fieldset key={statement.id} disabled={isBusy || isPending}>
              <legend>{statement.text}</legend>
              <label>
                <input
                  type="radio"
                  name={`classification-${statement.id}`}
                  value="percebi"
                  checked={answers[statement.id] === "percebi"}
                  onChange={() => classify(statement.id, "percebi")}
                />
                <span>Percebi</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={`classification-${statement.id}`}
                  value="conclui"
                  checked={answers[statement.id] === "conclui"}
                  onChange={() => classify(statement.id, "conclui")}
                />
                <span>Concluí</span>
              </label>
            </fieldset>
          ))}
        </div>

        {isComplete ? (
          <div className={styles.learningFeedback} aria-live="polite">
            <p>
              Você percebeu um contorno. “Pássaro” já é uma explicação. Você
              consegue verificar a fonte daqui?
            </p>
          </div>
        ) : null}

        <button
          className={styles.primaryAction}
          type="button"
          onClick={onContinue}
          disabled={isBusy || isPending || !isComplete}
        >
          Levar a distinção adiante
        </button>
      </section>
    </article>
  );
}
