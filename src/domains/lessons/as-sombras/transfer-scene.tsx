"use client";

import Image from "next/image";
import type { ConfidenceLevel } from "../interactions/confidence-control";
import {
  TransferClassification,
  type TransferAnswers,
  type TransferClassificationValue,
} from "../interactions/transfer-classification";
import styles from "./closing-scenes.module.css";
import sceneStyles from "./transfer-scene.module.css";

export interface TransferSceneProps {
  readonly value: TransferClassificationValue;
  readonly canComplete: boolean;
  readonly onConfidenceRecorded: (
    value: ConfidenceLevel,
  ) => void | boolean | Promise<void | boolean>;
  readonly onContextRevealed: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly onClassified: (
    value: TransferAnswers,
  ) => void | boolean | Promise<void | boolean>;
  readonly onComplete: () =>
    | void
    | boolean
    | Promise<void | boolean>;
  readonly isBusy?: boolean;
}

export function TransferScene({
  value,
  canComplete,
  onConfidenceRecorded,
  onContextRevealed,
  onClassified,
  onComplete,
  isBusy = false,
}: TransferSceneProps) {
  return (
    <article
      className={`${styles.closingScene} ${sceneStyles.transferScene}`}
      aria-labelledby="transfer-scene-title"
    >
      <header className={styles.closingHeader}>
        <div>
          <p className={styles.eyebrow}>Ato 6 · outro tipo de sombra</p>
          <h1 id="transfer-scene-title" tabIndex={-1}>
            O recorte não é a reunião
          </h1>
        </div>
        <p>
          Uma representação pode ser verdadeira e ainda assim sustentar
          uma conclusão ampla demais. Registre sua confiança antes de
          abrir o enquadramento.
        </p>
      </header>

      <TransferClassification
        key={value.contextRevealed ? "wide-context" : "cropped-context"}
        caption="Todos apoiaram a nova regra"
        renderRepresentation={(expanded) => (
          <CouncilRepresentation expanded={expanded} />
        )}
        initialValue={value}
        canComplete={canComplete}
        onConfidenceRecorded={onConfidenceRecorded}
        onContextRevealed={onContextRevealed}
        onClassified={onClassified}
        onComplete={onComplete}
        disabled={isBusy}
        contextReview={
          <section className={styles.platoReview}>
            <Image
              src="/images/plato/platao-master.webp"
              alt="Platão observa o enquadramento ampliado"
              width={180}
              height={223}
              sizes="(max-width: 700px) 120px, 180px"
            />
            <div>
              <p className={styles.characterRole}>
                Platão pergunta sobre a conclusão
              </p>
              <blockquote>
                A imagem é falsa — ou a conclusão foi além dela?
              </blockquote>
            </div>
          </section>
        }
      />
    </article>
  );
}

function CouncilRepresentation({
  expanded,
}: {
  readonly expanded: boolean;
}) {
  return (
    <div
      className={sceneStyles.councilFrame}
      data-expanded={expanded}
      aria-label={
        expanded
          ? "Conselho escolar em contexto amplo, com apoio e discordância"
          : "Recorte do conselho escolar mostrando apenas o grupo que fala"
      }
    >
      <div className={sceneStyles.councilBoard} aria-hidden="true">
        CONSELHO · REGRA 07
      </div>
      <div className={sceneStyles.supportingGroup}>
        <CouncilParticipant
          initials="LM"
          name="Luana"
          position="a favor"
        />
        <CouncilParticipant
          initials="RC"
          name="Ravi"
          position="a favor"
        />
        <CouncilParticipant
          initials="IS"
          name="Iara"
          position="apresenta a regra"
          speaking
        />
      </div>
      {expanded ? (
        <>
          <div className={sceneStyles.dissentingGroup}>
            <CouncilParticipant
              initials="BN"
              name="Bento"
              position="discorda"
              dissenting
            />
            <CouncilParticipant
              initials="MA"
              name="Maya"
              position="discorda"
              dissenting
            />
          </div>
          <div className={sceneStyles.objectionCard}>
            <strong>DISCORDO</strong>
            <span>
              A regra exclui quem não pode participar no mesmo horário.
            </span>
          </div>
          <p className={sceneStyles.dissentCount}>2 vozes contrárias</p>
        </>
      ) : null}
      <div className={sceneStyles.councilTable} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function CouncilParticipant({
  initials,
  name,
  position,
  speaking = false,
  dissenting = false,
}: {
  readonly initials: string;
  readonly name: string;
  readonly position: string;
  readonly speaking?: boolean;
  readonly dissenting?: boolean;
}) {
  return (
    <div
      className={sceneStyles.councilParticipant}
      data-speaking={speaking}
      data-dissenting={dissenting}
    >
      <span aria-hidden="true">{initials}</span>
      <strong>{name}</strong>
      <small>{position}</small>
    </div>
  );
}
