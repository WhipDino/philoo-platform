"use client";

import Image from "next/image";
import { getPlatoPose } from "../plato-pose-catalog";
import { SHADOW_CAUSAL_LINKS } from "./shadow-model";
import type {
  CounterfactualPrediction,
  ShadowLaboratoryState,
} from "./shadow-laboratory-state";
import { runCurrentArrangement } from "./shadow-laboratory-state";
import styles from "./shadow-laboratory.module.css";

export function CausalResult({
  state,
  canRequestHint,
  isBusy,
  onRequestHint,
}: {
  readonly state: ShadowLaboratoryState;
  readonly canRequestHint: boolean;
  readonly isBusy: boolean;
  readonly onRequestHint: () => void;
}) {
  const platoPose = getPlatoPose("prediction-model");
  const evaluation = state.lastRunRecord
    ? runCurrentArrangement(state)
    : null;

  return (
    <section className={styles.causalResult} aria-labelledby="result-title">
      <div>
        <p className={styles.eyebrow}>Evidência causal</p>
        <h2 id="result-title">O que o arranjo permite concluir</h2>
      </div>

      <div
        className={styles.liveResult}
        role="status"
        aria-label="Resultado do modelo"
        aria-live="polite"
      >
        {evaluation?.projectionResolved ? (
          <>
            <strong>
              A projeção chegou à parede; ela tem uma fonte diferente do
              som.
            </strong>
            <p>
              Projeção: o artefato com pássaro bloqueia a luz e o contorno
              chega à parede.{" "}
              {evaluation.soundResolved
                ? "Som: a voz humana e os passos pertencem ao carregador humano."
                : "A fonte do som ainda não foi ligada ao carregador humano."}{" "}
              {evaluation.observerResolved
                ? ""
                : "O lugar de observação ainda precisa ser reconstruído."}
            </p>
          </>
        ) : state.lastRunResult ? (
          <>
            <strong>O arranjo ainda não produz uma projeção.</strong>
            <p>
              Neste arranjo, a luz não envia o contorno à parede. Qual peça
              precisa mudar?
            </p>
          </>
        ) : (
          <p>
            Execute um arranjo para observar separadamente a projeção, a
            voz e os passos.
          </p>
        )}
      </div>

      <ol className={styles.causalLedger}>
        {SHADOW_CAUSAL_LINKS.map((link, index) => (
          <li
            key={link}
            data-confirmed={
              (index < 3 && evaluation?.projectionResolved) ||
              (index === 3 && evaluation?.soundResolved)
                ? "true"
                : "false"
            }
          >
            <span>{index + 1}</span>
            {link === "fire_illuminates_artifact"
              ? "Fogo ilumina o artefato"
              : link === "artifact_blocks_light"
                ? "Artefato bloqueia a luz"
                : link === "projection_reaches_wall"
                  ? "Projeção alcança a parede"
                  : "Carregador produz voz e passos"}
          </li>
        ))}
      </ol>

      {canRequestHint ? (
        <button
          className={styles.hintAction}
          type="button"
          onClick={onRequestHint}
          disabled={isBusy}
        >
          Pedir uma pergunta a Platão
        </button>
      ) : null}

      {state.hintVisible ? (
        <aside className={styles.laboratoryPlato}>
          <Image
            src={platoPose.src}
            alt={platoPose.alt}
            width={84}
            height={126}
          />
          <div>
            <p className={styles.eyebrow}>Uma conexão, não a resposta</p>
            <blockquote>
              Um modelo merece confiança quando consegue prever.
            </blockquote>
            <p data-testid="plato-single-link">
              Uma ligação para testar: o fogo ilumina o artefato.
            </p>
          </div>
        </aside>
      ) : null}
    </section>
  );
}

export function CounterfactualPanel({
  state,
  isBusy,
  onPrediction,
  onTest,
  onCompare,
}: {
  readonly state: ShadowLaboratoryState;
  readonly isBusy: boolean;
  readonly onPrediction: (prediction: CounterfactualPrediction) => void;
  readonly onTest: () => void;
  readonly onCompare: () => void;
}) {
  const predictionChoices: readonly {
    value: CounterfactualPrediction;
    label: string;
  }[] = [
    {
      value: "projection_increases",
      label: "A projeção fica maior",
    },
    {
      value: "projection_decreases",
      label: "A projeção fica menor",
    },
    {
      value: "projection_unchanged",
      label: "A projeção não muda",
    },
  ];

  return (
    <section
      className={styles.counterfactualPanel}
      aria-labelledby="counterfactual-title"
    >
      <div>
        <p className={styles.eyebrow}>Teste contrafactual</p>
        <h2 id="counterfactual-title">
          Se o artefato se aproximar do fogo, o que muda?
        </h2>
        <p>
          Registre a previsão antes de comparar os dois arranjos. Um palpite
          diferente continua produzindo evidência útil.
        </p>
      </div>
      <fieldset>
        <legend>Sua previsão sobre o tamanho da projeção</legend>
        {predictionChoices.map((choice) => (
          <label key={choice.value}>
            <input
              type="radio"
              name="counterfactual-prediction"
              value={choice.value}
              checked={state.counterfactualPrediction === choice.value}
              onChange={() => onPrediction(choice.value)}
              disabled={isBusy}
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </fieldset>
      <button
        className={styles.runModelAction}
        type="button"
        onClick={onTest}
        disabled={!state.counterfactualPrediction || isBusy}
      >
        Testar previsão
      </button>

      {state.counterfactualEvidence ? (
        <div className={styles.counterfactualResult} aria-live="polite">
          <strong>
            {state.counterfactualEvidence.matched
              ? "A previsão combinou com o modelo."
              : "O modelo mostrou outra consequência — agora você pode revisar a previsão."}
          </strong>
          <p>
            Ao aproximar o artefato da luz, a escala passou de{" "}
            {state.counterfactualEvidence.beforeScale.toFixed(1)} para{" "}
            {state.counterfactualEvidence.afterScale.toFixed(1)}. A projeção
            ficou maior; a voz e os passos continuaram pertencendo ao
            carregador.
          </p>
          <button type="button" onClick={onCompare} disabled={isBusy}>
            Comparar antes e depois
          </button>
        </div>
      ) : null}

      {state.counterfactualEvidence && state.comparisonVisible ? (
        <div
          className={styles.beforeAfter}
          role="region"
          aria-label="Comparação antes e depois"
        >
          <div>
            <span>Antes</span>
            <strong>
              escala {state.counterfactualEvidence.beforeScale.toFixed(1)}
            </strong>
            <small>artefato mais distante</small>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <span>Depois</span>
            <strong>
              escala {state.counterfactualEvidence.afterScale.toFixed(1)}
            </strong>
            <small>projeção maior</small>
          </div>
        </div>
      ) : null}
    </section>
  );
}
