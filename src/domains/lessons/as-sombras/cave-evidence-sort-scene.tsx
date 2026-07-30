"use client";

import { BrainIcon, EyeIcon, QuestionIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PhilooFolioStage } from "../philoo-folio-stage";
import { PhilooStoryShell } from "../philoo-story-shell";
import { PlatoGuide } from "../plato-guide";
import {
  PhilooDiscoveryTable,
  type DiscoveryCard,
  type DiscoveryDestination,
} from "../interactions/philoo-discovery-table";
import {
  AS_SOMBRAS_JOURNEY_STAGES,
  getAsSombrasChapterLabel,
} from "./as-sombras-journey";
import styles from "./cave-evidence-sort-scene.module.css";

type DestinationId = "observed" | "concluded" | "unknown";

type EvidenceCard = DiscoveryCard & {
  answer: DestinationId;
};

const DESTINATIONS = [
  {
    id: "observed",
    label: "Eles viram",
    hint: "Apareceu diante deles.",
    tone: "blue",
    icon: <EyeIcon size={22} weight="duotone" />,
  },
  {
    id: "concluded",
    label: "Eles acreditaram",
    hint: "Parecia verdade para eles.",
    tone: "apricot",
    icon: <BrainIcon size={22} weight="duotone" />,
  },
  {
    id: "unknown",
    label: "Eles não sabiam",
    hint: "Ainda faltavam pistas.",
    tone: "lavender",
    icon: <QuestionIcon size={22} weight="duotone" />,
  },
] satisfies readonly DiscoveryDestination<DestinationId>[];

const CARDS: EvidenceCard[] = [
  {
    id: "shadow",
    text: "Uma sombra apareceu na parede.",
    answer: "observed",
  },
  {
    id: "real-object",
    text: "A sombra era o objeto verdadeiro.",
    answer: "concluded",
  },
  {
    id: "whole-world",
    text: "A parede mostrava o mundo inteiro.",
    answer: "concluded",
  },
  {
    id: "behind-wall",
    text: "O que existia atrás da parede?",
    answer: "unknown",
  },
];

const FEEDBACK: Record<DestinationId, string> = {
  observed: "Isso apareceu diretamente diante dos prisioneiros.",
  concluded: "Isso era uma crença criada a partir do que aparecia na parede.",
  unknown: "Eles ainda não tinham pistas para responder essa pergunta.",
};

export function CaveEvidenceSortScene() {
  const [exampleAcknowledged, setExampleAcknowledged] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, DestinationId>>(
    {},
  );
  const [hasChecked, setHasChecked] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const selected = CARDS.find((card) => card.id === selectedId);
  const placedCount = Object.keys(placements).length;
  const allPlaced = placedCount === CARDS.length;
  const incorrectCount = useMemo(
    () =>
      CARDS.filter(
        (card) => placements[card.id] && placements[card.id] !== card.answer,
      ).length,
    [placements],
  );
  const completedCorrectly = hasChecked && incorrectCount === 0;

  function chooseCard(id: string) {
    setSelectedId(id);
    setHasChecked(false);
    setReasoning(null);
  }

  function placeIn(destination: DestinationId) {
    if (!selectedId) return;
    moveCard(selectedId, destination);
  }

  function moveCard(cardId: string, destination: DestinationId) {
    setPlacements((current) => ({ ...current, [cardId]: destination }));
    setSelectedId(null);
    setHasChecked(false);
    const card = CARDS.find((item) => item.id === cardId);
    setReasoning(
      card && card.answer !== destination
        ? FEEDBACK[card.answer]
        : "Essa escolha combina com o que os prisioneiros poderiam afirmar.",
    );
  }

  return (
    <PhilooStoryShell
        backHref="/aula/as-sombras/eles-dao-nomes"
        onBack={
          exampleAcknowledged
            ? () => {
                setExampleAcknowledged(false);
                setSelectedId(null);
                setReasoning(null);
              }
            : undefined
        }
        currentBeat={5}
        totalBeats={10}
        labelledBy="evidence-title"
        phase="idle"
        surfaceWidth="narrative"
        surfaceTreatment="folio"
        showSoftFrame={false}
        journey={{
          lessonTitle: "As Sombras",
          currentSceneId: "o-que-chegou-ate-eles",
          stages: AS_SOMBRAS_JOURNEY_STAGES,
          storageKey: "philoo:journey:as-sombras",
        }}
      >
        <PhilooFolioStage
          eyebrow={getAsSombrasChapterLabel("o-que-chegou-ate-eles")}
          title="O que realmente chegou até eles?"
          titleId="evidence-title"
          context="Separe o que foi visto do que foi apenas concluído."
          action={
            completedCorrectly ? (
              <Link href="/aula/as-sombras/a-primeira-duvida">
                Seguir a dúvida <span aria-hidden="true">→</span>
              </Link>
            ) : undefined
          }
          footerLabel={
            exampleAcknowledged ? "Aplicação independente" : "Exemplo guiado"
          }
        >
          <section
            className={styles.workspace}
            aria-labelledby="evidence-title"
            data-complete={completedCorrectly ? "true" : "false"}
          >
            {!exampleAcknowledged ? (
              <div className={styles.activityHeading}>
                <p>
                  <strong>
                    Primeiro, aprenda a diferença entre os três bolsos.
                  </strong>
                  <span>
                    As pegadas não aparecem no desafio: são só um exemplo.
                  </span>
                </p>
              </div>
            ) : null}

            {!exampleAcknowledged ? (
              <section
                className={styles.workedExample}
                aria-labelledby="example-title"
              >
                <PlatoGuide
                  className={styles.exampleGuide}
                  pose="teaching-pointer"
                  sizes="(max-width: 540px) 120px, 210px"
                  priority
                />
                <div className={styles.exampleCopy}>
                  <p className={styles.label} id="example-title">
                    Uma pista, três jeitos de pensar
                  </p>
                  <h2>Imagine que você encontrou pegadas.</h2>
                  <div className={styles.exampleGrid}>
                    <article data-tone="blue">
                      <div>
                        <EyeIcon aria-hidden="true" weight="duotone" />
                        <strong>Eles viram</strong>
                      </div>
                      <b>Há três pegadas no chão.</b>
                      <p>
                        Use quando algo apareceu diante dos olhos deles.
                      </p>
                    </article>
                    <article data-tone="apricot">
                      <div>
                        <BrainIcon aria-hidden="true" weight="duotone" />
                        <strong>Eles acreditaram</strong>
                      </div>
                      <b>Alguém passou por aqui.</b>
                      <p>
                        Use quando uma ideia parece verdadeira, mesmo sem eles
                        verem sua origem.
                      </p>
                    </article>
                    <article data-tone="lavender">
                      <div>
                        <QuestionIcon aria-hidden="true" weight="duotone" />
                        <strong>Eles não sabiam</strong>
                      </div>
                      <b>Quem deixou as pegadas?</b>
                      <p>
                        Use quando ainda faltam pistas para responder.
                      </p>
                    </article>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExampleAcknowledged(true)}
                  >
                    Entendi os três <span aria-hidden="true">→</span>
                  </button>
                </div>
              </section>
            ) : (
              <>
                <div className={styles.exerciseTopline}>
                  <div className={styles.exercisePrompt}>
                    <strong>Agora organize as pistas.</strong>
                    <span>
                      Arraste cada cartão ou toque nele e escolha um bolso.
                    </span>
                  </div>
                  <div
                    className={styles.instructions}
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      className={styles.progressNumber}
                      data-progress-fraction
                      aria-label={`${placedCount} de ${CARDS.length} pistas organizadas`}
                    >
                      <strong aria-hidden="true">{placedCount}</strong>
                      <i aria-hidden="true" />
                      <small aria-hidden="true">{CARDS.length}</small>
                    </span>
                    <p>
                      {selected ? (
                        <>
                          <strong>“{selected.text}”</strong>
                          <span>Arraste ou escolha um bolso.</span>
                        </>
                      ) : (
                        <>
                          <strong>
                            {placedCount} de {CARDS.length} pistas organizadas
                          </strong>
                          <span>Continue investigando.</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className={styles.decisionBar}>
                  <div
                    className={styles.reasoning}
                    role="status"
                    aria-live="polite"
                    data-result={
                      completedCorrectly
                        ? "correct"
                        : hasChecked
                          ? "retry"
                          : undefined
                    }
                  >
                    {completedCorrectly ? (
                      <>
                        <strong>Perfeito: você organizou as quatro ideias.</strong>
                        <span>
                          Você separou o que apareceu, o que eles acreditaram e
                          o que ainda não podiam saber.
                        </span>
                      </>
                    ) : hasChecked ? (
                      <>
                        <strong>
                          Revise {incorrectCount}{" "}
                          {incorrectCount === 1 ? "cartão" : "cartões"}.
                        </strong>
                        <span>{reasoning}</span>
                      </>
                    ) : (
                      reasoning ?? "Escolha uma pista para começar."
                    )}
                  </div>
                  {allPlaced && !hasChecked ? (
                    <button
                      type="button"
                      className={styles.checkButton}
                      onClick={() => setHasChecked(true)}
                    >
                      Conferir descobertas <span aria-hidden="true">→</span>
                    </button>
                  ) : null}
                </div>

                <PhilooDiscoveryTable
                  cards={CARDS}
                  destinations={DESTINATIONS}
                  placements={placements}
                  selectedCardId={selectedId}
                  onSelectCard={chooseCard}
                  onPlaceCard={placeIn}
                  onMoveCard={moveCard}
                  hideCompletionTray
                />
              </>
            )}
          </section>
        </PhilooFolioStage>
      </PhilooStoryShell>
  );
}
