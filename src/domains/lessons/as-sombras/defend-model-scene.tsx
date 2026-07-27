"use client";

import Image from "next/image";
import { useState } from "react";
import type { ConfidenceLevel } from "../interactions/confidence-control";
import {
  CerResponse,
  assembleCerSentence,
  isCerResponseBuilt,
  isCerResponseCoherent,
  sanitizeCerResponse,
  type CerResponseConfig,
  type CerResponseValue,
  type CerReview,
} from "../interactions/cer-response";
import type { AnomalyClueId } from "./anomaly-scene";
import styles from "./closing-scenes.module.css";
import sceneStyles from "./defend-model-scene.module.css";

export const PATTERN_KEEPER_ARGUMENT =
  "A parede é a única evidência que todos podem conferir. Ela sempre nos ajudou a prever. Um som estranho não prova um mundo invisível.";

const allClues = [
  {
    value: "forma",
    label: "a forma com asas permaneceu estável na parede",
  },
  {
    value: "som",
    label: "uma voz humana disse “mais devagar” durante a projeção",
  },
  {
    value: "tempo",
    label: "os passos começaram antes e terminaram depois da forma",
  },
  {
    value: "repeticao",
    label: "a mesma voz acompanhou outra forma mais tarde",
  },
] as const;

export const DEFEND_MODEL_CONFIG: CerResponseConfig = {
  claims: [
    {
      value: "hidden_source",
      label:
        "há uma fonte escondida que a parede, sozinha, não explica",
    },
    {
      value: "wall_model",
      label:
        "as pistas ainda não exigem abandonar o modelo da parede",
    },
    {
      value: "insufficient",
      label: "Ainda não há evidência suficiente",
      requiresNextEvidence: true,
    },
  ],
  clues: allClues,
  bridges: [
    {
      value: "independent_channels",
      label:
        "som, passos e projeção variam de modo independente, indicando partes diferentes no mecanismo",
      validClaims: ["hidden_source"],
      validClues: ["som", "tempo", "repeticao"],
    },
    {
      value: "stable_prediction",
      label:
        "a estabilidade da forma ainda sustenta as previsões feitas a partir da parede",
      validClaims: ["wall_model"],
      validClues: ["forma"],
    },
    {
      value: "observation_limit",
      label:
        "a pista limita o modelo atual, mas ainda não mostra diretamente a fonte",
      validClaims: ["insufficient"],
      validClues: ["forma", "som", "tempo", "repeticao"],
    },
  ],
  acknowledgments: [
    {
      value: "predictive",
      label:
        "o modelo da parede ainda explica padrões e previsões úteis",
    },
    {
      value: "shared",
      label:
        "a parede ainda oferece uma observação pública para a comunidade",
    },
  ],
  nextEvidence: [
    {
      value: "observe_mechanism",
      label: "observar o mecanismo entre a fonte e a parede",
    },
    {
      value: "locate_voice",
      label: "localizar de onde partem a voz e os passos",
    },
    {
      value: "repeat_sources",
      label: "comparar a mesma fonte com outras projeções",
    },
  ],
};

export function defendModelConfigFor(
  inspectedClueIds: readonly AnomalyClueId[],
): CerResponseConfig {
  return {
    ...DEFEND_MODEL_CONFIG,
    clues: allClues.filter((clue) =>
      inspectedClueIds.includes(clue.value),
    ),
  };
}

export function sanitizeDefendModelValue(
  value: unknown,
  inspectedClueIds: readonly AnomalyClueId[],
): CerResponseValue {
  return sanitizeCerResponse(
    value,
    defendModelConfigFor(inspectedClueIds),
  );
}

export function isDefendedModelComplete(
  value: unknown,
  inspectedClueIds: readonly AnomalyClueId[],
): boolean {
  const config = defendModelConfigFor(inspectedClueIds);
  const sanitized = sanitizeCerResponse(value, config);
  return (
    inspectedClueIds.length >= 2 &&
    sanitized.reviewed === true &&
    sanitized.coherent === true &&
    isCerResponseBuilt(sanitized, config) &&
    isCerResponseCoherent(sanitized, config)
  );
}

export interface DefendModelSceneProps {
  readonly inspectedClueIds: readonly AnomalyClueId[];
  readonly value: CerResponseValue;
  readonly onClaimBuilt: (value: {
    readonly claim: string;
    readonly nextEvidence: string | null;
  }) => void | boolean | Promise<void | boolean>;
  readonly onEvidenceLinked: (value: {
    readonly clue: string;
    readonly bridge: string;
  }) => void | boolean | Promise<void | boolean>;
  readonly onRivalAcknowledged: (
    value: string,
  ) => void | boolean | Promise<void | boolean>;
  readonly onConfidenceRecorded: (
    value: ConfidenceLevel,
  ) => void | boolean | Promise<void | boolean>;
  readonly onReview: (
    value: CerReview,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

export function DefendModelScene({
  inspectedClueIds,
  value,
  onClaimBuilt,
  onEvidenceLinked,
  onRivalAcknowledged,
  onConfidenceRecorded,
  onReview,
  onContinue,
  isBusy = false,
}: DefendModelSceneProps) {
  const config = defendModelConfigFor(inspectedClueIds);
  const persistedValiditySignature = JSON.stringify(value);
  const inspectedCluesSignature = inspectedClueIds.join(":");
  const persistedIsComplete = isDefendedModelComplete(
    value,
    inspectedClueIds,
  );
  const currentSignature =
    `${inspectedCluesSignature}:${persistedValiditySignature}`;
  const [invalidatedSignature, setInvalidatedSignature] = useState<
    string | null
  >(
    null,
  );
  const isResponseCurrent =
    invalidatedSignature !== currentSignature;
  const canContinue =
    isResponseCurrent && persistedIsComplete;

  return (
    <article
      className={styles.closingScene}
      aria-labelledby="defend-model-title"
    >
      <header className={styles.closingHeader}>
        <div>
          <p className={styles.eyebrow}>Ato 5 · confronto honesto</p>
          <h1 id="defend-model-title" tabIndex={-1}>
            O melhor argumento contrário
          </h1>
        </div>
        <p>
          A Guardiã do Padrão não é um obstáculo a vencer. Ela protege o
          que funcionou. Responda ao argumento mais forte que ela pode
          oferecer.
        </p>
      </header>

      <section
        className={sceneStyles.patternKeeper}
        aria-labelledby="pattern-keeper-name"
      >
        <div className={sceneStyles.patternKeeperMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className={styles.characterRole}>Argumento contrário</p>
          <h2 id="pattern-keeper-name">Guardiã do Padrão</h2>
          <blockquote>{PATTERN_KEEPER_ARGUMENT}</blockquote>
        </div>
      </section>

      {config.clues.length > 0 ? (
        <CerResponse
          key={inspectedClueIds.join(":")}
          config={config}
          initialValue={value}
          onClaimBuilt={onClaimBuilt}
          onEvidenceLinked={onEvidenceLinked}
          onRivalAcknowledged={onRivalAcknowledged}
          onConfidenceRecorded={onConfidenceRecorded}
          onReview={onReview}
          onValidityChange={(isValid) =>
            setInvalidatedSignature(
              isValid ? null : currentSignature,
            )
          }
          disabled={isBusy}
        />
      ) : (
        <section className={sceneStyles.closingNotice} role="alert">
          <h2>Faltam pistas inspecionadas</h2>
          <p>
            Use Voltar para examinar ao menos duas pistas antes de
            defender uma conclusão. Nenhuma evidência será inventada para
            preencher essa etapa.
          </p>
        </section>
      )}

      {isResponseCurrent && value.reviewed ? (
        <section className={styles.platoReview} aria-live="polite">
          <Image
            src="/images/plato/platao-master.webp"
            alt="Platão revisa sua resposta"
            width={180}
            height={223}
            sizes="(max-width: 700px) 120px, 180px"
          />
          <div>
            <p className={styles.characterRole}>Platão entra na revisão</p>
            <blockquote>
              {assembleCerSentence(value, config)}
            </blockquote>
            <p>
              {value.coherent
                ? "Que nova pista faria você diminuir ou aumentar sua confiança?"
                : value.clue === "som"
                  ? "Sua pista descreve o som, mas sua conclusão é sobre a forma. Que relação liga os dois?"
                  : "Que relação ainda falta entre a pista e a conclusão?"}
            </p>
          </div>
        </section>
      ) : null}

      {canContinue ? (
        <div className={styles.closingAction}>
          <p>
            Você ligou uma afirmação a uma pista, reconheceu o que o modelo
            rival explica e calibrou sua confiança.
          </p>
          <button
            type="button"
            onClick={onContinue}
            disabled={isBusy}
          >
            Rever minha primeira hipótese
          </button>
        </div>
      ) : null}
    </article>
  );
}
