"use client";

import { useState } from "react";
import type { JsonObject } from "../contracts";
import { PredictionConsequence } from "../interactions/prediction-consequence";
import styles from "./as-sombras.module.css";

export interface WallForecastResult extends JsonObject {
  readonly id: string;
  readonly choice: string;
  readonly matchedPattern: boolean;
}

export interface WallPatternMastery extends JsonObject {
  readonly coreMatches: number;
  readonly coreAttempted: 4;
  readonly supportAttempted: boolean;
  readonly supportMatched: boolean | null;
}

export interface PredictionMasterySceneProps {
  readonly forecasts: readonly WallForecastResult[];
  readonly onForecast: (
    result: WallForecastResult,
  ) => void | boolean | Promise<void | boolean>;
  readonly onComplete: (
    mastery: WallPatternMastery,
  ) => void | boolean | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

const forecastRounds = [
  {
    id: "direction",
    marker: "direção",
    prompt: "Depois de dois contornos baixos, de onde vem o contorno alto?",
    choices: [
      { value: "left", label: "Da esquerda" },
      { value: "right", label: "Da direita" },
    ],
    correct: "left",
    consequence: "O contorno alto entrou pela esquerda.",
  },
  {
    id: "rhythm",
    marker: "ritmo",
    prompt: "Duas batidas curtas vieram antes da forma. O que vem agora?",
    choices: [
      { value: "long", label: "Uma batida longa" },
      { value: "three", label: "Três batidas curtas" },
    ],
    correct: "long",
    consequence: "Uma batida longa antecedeu a próxima forma.",
  },
  {
    id: "silhouette",
    marker: "silhueta",
    prompt: "A ponta dupla alternou com um arco. Qual forma retorna?",
    choices: [
      { value: "double", label: "A ponta dupla" },
      { value: "arc", label: "O arco" },
    ],
    correct: "double",
    consequence: "A ponta dupla voltou à parede.",
  },
  {
    id: "timing",
    marker: "tempo",
    prompt: "A luz cresce depois do terceiro passo. Quando a forma aparece?",
    choices: [
      { value: "third", label: "Depois do terceiro passo" },
      { value: "first", label: "Depois do primeiro passo" },
    ],
    correct: "third",
    consequence: "A forma apareceu depois do terceiro passo.",
  },
  {
    id: "supported",
    marker: "regra em foco",
    prompt: "Com a regra destacada, qual sequência fecha o par?",
    choices: [
      { value: "low-high", label: "Baixo, depois alto" },
      { value: "high-high", label: "Alto, depois alto" },
    ],
    correct: "low-high",
    consequence: "Um contorno baixo foi seguido por um alto.",
  },
] as const;

type ForecastRound = (typeof forecastRounds)[number];

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findLatestValidForecast(
  value: readonly unknown[],
  round: ForecastRound,
) {
  for (let index = value.length - 1; index >= 0; index -= 1) {
    const item = value[index];
    if (
      isRecord(item) &&
      item.id === round.id &&
      typeof item.choice === "string" &&
      round.choices.some((choice) => choice.value === item.choice)
    ) {
      return item.choice;
    }
  }
  return undefined;
}

export function sanitizeWallForecasts(
  value: unknown,
): readonly WallForecastResult[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const coreResults: WallForecastResult[] = [];
  for (const round of forecastRounds.slice(0, 4)) {
    const choice = findLatestValidForecast(value, round);
    if (choice === undefined) {
      break;
    }
    coreResults.push({
      id: round.id,
      choice,
      matchedPattern: choice === round.correct,
    });
  }

  const coreMatches = coreResults.filter(
    (result) => result.matchedPattern,
  ).length;
  if (coreResults.length < 4 || coreMatches >= 3) {
    return coreResults;
  }

  const supportRound = forecastRounds[4];
  const supportChoice = findLatestValidForecast(value, supportRound);
  return supportChoice === undefined
    ? coreResults
    : [
        ...coreResults,
        {
          id: supportRound.id,
          choice: supportChoice,
          matchedPattern: supportChoice === supportRound.correct,
        },
      ];
}

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

export function PredictionMasteryScene({
  forecasts,
  onForecast,
  onComplete,
  isBusy = false,
}: PredictionMasterySceneProps) {
  const restoredForecasts = sanitizeWallForecasts(forecasts);
  const [hasStarted, setHasStarted] = useState(
    restoredForecasts.length > 0,
  );
  const [results, setResults] = useState<readonly WallForecastResult[]>(
    restoredForecasts,
  );
  const [activeRound, setActiveRound] = useState(
    Math.min(restoredForecasts.length, 4),
  );

  const firstFour = results.filter((result) =>
    forecastRounds.slice(0, 4).some((round) => round.id === result.id),
  );
  const firstFourMatches = firstFour.filter(
    (result) => result.matchedPattern,
  ).length;
  const needsSupport = firstFour.length >= 4 && firstFourMatches < 3;
  const round = forecastRounds[activeRound];
  const currentResult = round
    ? results.find((result) => result.id === round.id)
    : undefined;
  const isReadyToComplete =
    (firstFour.length >= 4 && !needsSupport) ||
    (needsSupport && results.some((result) => result.id === "supported"));
  const supportResult = results.find(
    (result) => result.id === "supported",
  );

  function saveForecast(choice: string, matchedPattern: boolean) {
    if (!round) {
      return false;
    }

    const result = { id: round.id, choice, matchedPattern };
    const saved = onForecast(result);
    const update = () =>
      setResults((current) => [
        ...current.filter((item) => item.id !== result.id),
        result,
      ]);

    if (isPromiseLike(saved)) {
      return saved.then((accepted) => {
        if (accepted !== false) {
          update();
        }
        return accepted;
      });
    }

    if (saved !== false) {
      update();
    }
    return saved;
  }

  return (
    <article className={styles.openingScene}>
      <section
        className={`${styles.wallStage} ${styles.patternStage}`}
        aria-labelledby="prediction-title"
      >
        <div className={styles.patternLedger} aria-label="Duas demonstrações">
          <div>
            <span>Demonstração 1 de 2</span>
            <svg viewBox="0 0 240 92" aria-label="Baixo, baixo, alto">
              <path d="M14 72h42V52H14Zm70 0h42V52H84Zm70 0h62V18h-62Z" />
            </svg>
            <p>baixo · baixo · alto</p>
          </div>
          <div>
            <span>Demonstração 2 de 2</span>
            <svg viewBox="0 0 240 92" aria-label="Ponta, arco, ponta">
              <path d="m22 72 28-52 28 52Zm78 0c0-38 56-38 56 0Zm68 0 28-52 28 52Z" />
            </svg>
            <p>ponta · arco · ponta</p>
          </div>
        </div>
        <div className={styles.stageTitle}>
          <p className={styles.eyebrow}>Ato 2 · competência da parede</p>
          <h1 id="prediction-title" tabIndex={-1}>
            As regras da parede
          </h1>
          <p>
            A Guardiã do Padrão não adivinha: ela compara direção, ritmo,
            forma e tempo. O modelo da parede é útil porque suas regras
            produzem expectativas verificáveis.
          </p>
        </div>
      </section>

      <section className={styles.investigationTray}>
        {!hasStarted ? (
          <div className={styles.startForecasts}>
            <p>
              Observe as duas sequências guiadas. Quando estiver pronto,
              faça quatro previsões sem limite de tempo.
            </p>
            <button
              className={styles.primaryAction}
              type="button"
              onClick={() => setHasStarted(true)}
              disabled={isBusy}
            >
              Começar previsões
            </button>
          </div>
        ) : null}

        {hasStarted && round && !isReadyToComplete ? (
          <div className={styles.forecastPanel}>
            <div className={styles.forecastIndex}>
              <span>
                {activeRound < 4
                  ? `Previsão ${activeRound + 1} de 4`
                  : "Previsão apoiada · 5 de 5"}
              </span>
              <strong>{round.marker}</strong>
            </div>
            {needsSupport && activeRound === 4 ? (
              <div className={styles.supportRule}>
                <strong>Regra em foco</strong>
                <p>
                  Nas sequências estáveis, um contorno baixo abre espaço
                  para um contorno alto. Use essa relação no novo caso.
                </p>
              </div>
            ) : null}
            <PredictionConsequence
              key={round.id}
              prompt={round.prompt}
              choices={round.choices}
              isMatch={(choice) => choice === round.correct}
              consequence={round.consequence}
              matchedFeedback="Sua previsão combinou com o padrão. Isso mostra que o padrão é útil — ainda não mostra o que o produz."
              unmatchedFeedback="O resultado não combinou com esta previsão. A diferença torna a regra mais visível; seu progresso continua."
              onCommit={saveForecast}
              disabled={isBusy}
            />
            {currentResult ? (
              <button
                className={styles.secondaryAction}
                type="button"
                onClick={() => setActiveRound((index) => index + 1)}
                disabled={isBusy}
              >
                Próxima previsão
              </button>
            ) : null}
          </div>
        ) : null}

        {hasStarted && isReadyToComplete ? (
          <div className={styles.masterySummary} aria-live="polite">
            <p className={styles.eyebrow}>Caderno da Parede · regra testada</p>
            <h2>
              {firstFourMatches >= 3
                ? "Seu modelo antecipou a parede."
                : "A regra ficou mais nítida com uma pista de apoio."}
            </h2>
            <p>
              Nas quatro previsões principais, {firstFourMatches}{" "}
              {firstFourMatches === 1 ? "combinou" : "combinaram"} com o
              padrão.
              {supportResult
                ? ` A previsão apoiada ${
                    supportResult.matchedPattern
                      ? "também combinou"
                      : "não combinou"
                  }.`
                : ""}{" "}
              Isso confirma a utilidade do padrão, não a identidade da
              fonte.
            </p>
            <button
              className={styles.primaryAction}
              type="button"
              onClick={() =>
                onComplete({
                  coreMatches: firstFourMatches,
                  coreAttempted: 4,
                  supportAttempted: supportResult !== undefined,
                  supportMatched:
                    supportResult?.matchedPattern ?? null,
                })
              }
              disabled={isBusy}
            >
              Confrontar o próximo acontecimento
            </button>
          </div>
        ) : null}
      </section>
    </article>
  );
}
