"use client";

import Image from "next/image";
import { useState } from "react";
import {
  RevisionMap,
  isRevisionComplete,
  sanitizeRevisionMap,
  type RevisionClueOption,
  type RevisionMapValue,
  type RevisionRecord,
  type RevisionStrategy,
} from "../interactions/revision-map";
import { getPlatoPose } from "../plato-pose-catalog";
import styles from "./closing-scenes.module.css";
import sceneStyles from "./revision-scene.module.css";

export const REVISION_CLUE_OPTIONS = [
  {
    value: "forma",
    label: "A estabilidade da forma na parede",
  },
  {
    value: "som",
    label: "A voz humana junto da projeção",
  },
  {
    value: "tempo",
    label: "Os passos fora do tempo da forma",
  },
  {
    value: "repeticao",
    label: "A mesma voz acompanhando outra forma",
  },
] as const;

export const PLATO_STRATEGY_FEEDBACK: Readonly<
  Record<RevisionStrategy, string>
> = {
  revise: "Você mudou o modelo porque uma pista exigiu isso.",
  maintain:
    "Manter uma ideia depois de testá-la não é o mesmo que ignorar evidência.",
  uncertain: "Uma dúvida precisa pode indicar o próximo teste.",
};

export function sanitizeRevisionSceneValue(
  value: unknown,
  clueOptions: readonly RevisionClueOption[] = REVISION_CLUE_OPTIONS,
): RevisionMapValue {
  return sanitizeRevisionMap(value, clueOptions);
}

export function isRevisionEvidenceComplete(
  value: unknown,
  clueOptions: readonly RevisionClueOption[] = REVISION_CLUE_OPTIONS,
): boolean {
  const sanitized = sanitizeRevisionSceneValue(value, clueOptions);
  return isRevisionComplete(sanitized);
}

export interface RevisionSceneProps {
  readonly initialHypothesis: string | null;
  readonly clueOptions?: readonly RevisionClueOption[];
  readonly value: RevisionMapValue;
  readonly privateNote: string;
  readonly onHypothesisRevisited: (
    strategy: RevisionStrategy,
  ) => void | boolean | Promise<void | boolean>;
  readonly onRevisionRecorded: (
    revision: RevisionRecord,
    privateNote: string,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContinue: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

export function RevisionScene({
  initialHypothesis,
  clueOptions = REVISION_CLUE_OPTIONS,
  value,
  privateNote,
  onHypothesisRevisited,
  onRevisionRecorded,
  onContinue,
  isBusy = false,
}: RevisionSceneProps) {
  const persistedValiditySignature = JSON.stringify(value);
  const persistedIsComplete = isRevisionComplete(value);
  const [invalidatedSignature, setInvalidatedSignature] = useState<
    string | null
  >(
    null,
  );
  const isRevisionCurrent =
    invalidatedSignature !== persistedValiditySignature;

  return (
    <article
      className={`${styles.closingScene} ${sceneStyles.revisionScene}`}
      aria-labelledby="revision-scene-title"
    >
      <header className={styles.closingHeader}>
        <div>
          <p className={styles.eyebrow}>Ato 5 · retorno à primeira leitura</p>
          <h1 id="revision-scene-title" tabIndex={-1}>
            Sua hipótese, de novo
          </h1>
        </div>
        <p>
          Revisar, manter e registrar uma dúvida são três estratégias
          legítimas. A pista decisiva é o que torna cada escolha
          investigável.
        </p>
      </header>

      <RevisionMap
        initialHypothesis={initialHypothesis}
        clueOptions={clueOptions}
        initialValue={value}
        privateNote={privateNote}
        onHypothesisRevisited={onHypothesisRevisited}
        onRevisionRecorded={onRevisionRecorded}
        onValidityChange={(isValid) =>
          setInvalidatedSignature(
            isValid ? null : persistedValiditySignature,
          )
        }
        reviewer={(strategy) => {
          const platoPose = getPlatoPose(
            strategy === "revise"
              ? "revision-change"
              : strategy === "maintain"
                ? "revision-maintain"
                : "revision-uncertainty",
          );

          return (
            <div className={styles.platoReview}>
              <Image
                src={platoPose.src}
                alt={platoPose.alt}
                width={180}
                height={270}
                sizes="(max-width: 700px) 120px, 180px"
              />
              <div>
                <p className={styles.characterRole}>
                  Platão comenta a estratégia
                </p>
                <blockquote>
                  {PLATO_STRATEGY_FEEDBACK[strategy]}
                </blockquote>
              </div>
            </div>
          );
        }}
        disabled={isBusy}
      />

      {isRevisionCurrent && persistedIsComplete ? (
        <div className={styles.closingAction}>
          <p>
            O registro mostra por que sua leitura se manteve, mudou ou
            ficou precisamente incerta.
          </p>
          <button
            type="button"
            onClick={onContinue}
            disabled={isBusy}
          >
            Testar em outro tipo de sombra
          </button>
        </div>
      ) : null}
    </article>
  );
}
